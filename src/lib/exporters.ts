import * as XLSX from 'xlsx'
import PDFDocument from 'pdfkit'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ExportField {
  key: string
  label: string
}

export interface ExportData {
  fields: ExportField[]
  rows: Record<string, unknown>[]
  filename: string
  /** Optional metadata shown in PDF header */
  meta?: {
    generatedAt?: string
    userName?: string
    statusFilter?: string
    totalCount?: number
  }
}

// ─── CSV ─────────────────────────────────────────────────────────────────────

function escapeCsvField(value: unknown): string {
  if (value === null || value === undefined) return ''
  const str = String(value)
  if (str.includes('"') || str.includes(',') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export function exportToCSV(data: ExportData): Buffer {
  const BOM = '\uFEFF'
  const headers = data.fields.map((f) => f.label.toUpperCase())
  const rows: string[] = [headers.join(',')]

  for (const row of data.rows) {
    const cells = data.fields.map((f) => escapeCsvField(row[f.key]))
    rows.push(cells.join(','))
  }

  return Buffer.from(BOM + rows.join('\r\n'), 'utf-8')
}

// ─── XLSX ────────────────────────────────────────────────────────────────────

export function exportToXLSX(data: ExportData): Buffer {
  const wb = XLSX.utils.book_new()

  // Build worksheet data: header row + data rows + footer
  const headerRow = data.fields.map((f) => f.label)
  const dataRows = data.rows.map((row) =>
    data.fields.map((f) => {
      const v = row[f.key]
      return v === null || v === undefined ? '' : String(v)
    })
  )
  const footerRow = [`Total de registros: ${data.rows.length}`]

  const wsData = [headerRow, ...dataRows, footerRow]
  const ws = XLSX.utils.aoa_to_sheet(wsData)

  // Column widths
  const colWidths: Record<string, number> = {
    nome: 20,
    cpf: 15,
    email: 25,
    cliente: 20,
    posicao: 25,
    status: 12,
    senioridade: 15,
    contrato_inicio: 14,
    contrato_fim: 14,
    renovacao: 14,
  }
  ws['!cols'] = data.fields.map((f) => ({ wch: colWidths[f.key] ?? 16 }))

  // Freeze first row
  ws['!freeze'] = { xSplit: 0, ySplit: 1, topLeftCell: 'A2', activePane: 'bottomLeft', state: 'frozen' }

  // Style header row (blue bg, white text, bold)
  const headerStyle = {
    font: { bold: true, color: { rgb: 'FFFFFF' } },
    fill: { fgColor: { rgb: '2563EB' } },
    alignment: { horizontal: 'center' },
  }
  for (let col = 0; col < data.fields.length; col++) {
    const cellRef = XLSX.utils.encode_cell({ r: 0, c: col })
    if (ws[cellRef]) {
      ws[cellRef].s = headerStyle
    }
  }

  // Style status cells with color
  for (let rowIdx = 0; rowIdx < data.rows.length; rowIdx++) {
    for (let colIdx = 0; colIdx < data.fields.length; colIdx++) {
      const field = data.fields[colIdx]
      if (field.key === 'status') {
        const cellRef = XLSX.utils.encode_cell({ r: rowIdx + 1, c: colIdx })
        if (ws[cellRef]) {
          const val = String(ws[cellRef].v ?? '').toLowerCase()
          ws[cellRef].s = {
            font: {
              color: { rgb: val.includes('ativ') ? '16A34A' : '9CA3AF' },
            },
          }
        }
      }
    }
  }

  XLSX.utils.book_append_sheet(wb, ws, 'Profissionais')

  const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })
  return Buffer.from(buf)
}

// ─── PDF ─────────────────────────────────────────────────────────────────────

export async function exportToPDF(data: ExportData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 42, bottom: 42, left: 42, right: 42 },
      info: { Title: 'Relatório de Profissionais — Elopar' },
    })

    const chunks: Buffer[] = []
    doc.on('data', (chunk: Buffer) => chunks.push(chunk))
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)

    const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right
    const meta = data.meta ?? {}

    // ── Header ─────────────────────────────────────────────────────────────
    doc
      .font('Helvetica-Bold')
      .fontSize(16)
      .fillColor('#111827')
      .text('ELOPAR — Professional Manager', { align: 'left' })

    doc
      .font('Helvetica')
      .fontSize(11)
      .fillColor('#374151')
      .text('Relatório de Profissionais', { align: 'left' })

    doc.moveDown(0.5)

    if (meta.generatedAt || meta.userName || meta.statusFilter) {
      doc.fontSize(9).fillColor('#6B7280')
      if (meta.generatedAt) doc.text(`Gerado em: ${meta.generatedAt}`)
      if (meta.userName) doc.text(`Usuário: ${meta.userName}`)
      if (meta.statusFilter) {
        const label =
          meta.totalCount !== undefined
            ? `${meta.statusFilter} (${meta.totalCount} registros)`
            : meta.statusFilter
        doc.text(`Filtros: Status = ${label}`)
      }
    }

    doc.moveDown(0.8)

    // ── Table ───────────────────────────────────────────────────────────────
    const colCount = data.fields.length
    const colWidth = Math.floor(pageWidth / colCount)
    const rowHeight = 18
    const headerBg = '#F3F4F6'
    const borderColor = '#E5E7EB'

    function drawRow(
      y: number,
      cells: string[],
      isHeader: boolean,
      isEven: boolean
    ) {
      // Background
      if (isHeader) {
        doc.rect(doc.page.margins.left, y, pageWidth, rowHeight).fill(headerBg)
      } else if (isEven) {
        doc.rect(doc.page.margins.left, y, pageWidth, rowHeight).fill('#F9FAFB')
      }

      // Border
      doc
        .rect(doc.page.margins.left, y, pageWidth, rowHeight)
        .stroke(borderColor)

      // Text
      cells.forEach((cell, i) => {
        const x = doc.page.margins.left + i * colWidth
        const statusField = data.fields[i]?.key === 'status'
        let textColor = '#111827'
        if (statusField) {
          textColor = cell.toLowerCase().includes('ativ') ? '#16A34A' : '#9CA3AF'
        }

        doc
          .font(isHeader ? 'Helvetica-Bold' : 'Helvetica')
          .fontSize(8)
          .fillColor(isHeader ? '#111827' : textColor)
          .text(cell, x + 3, y + 5, {
            width: colWidth - 6,
            lineBreak: false,
            ellipsis: true,
          })
      })
    }

    let currentY = doc.y
    const headerCells = data.fields.map((f) => f.label)
    drawRow(currentY, headerCells, true, false)
    currentY += rowHeight

    for (let i = 0; i < data.rows.length; i++) {
      // New page check
      if (currentY + rowHeight > doc.page.height - doc.page.margins.bottom - 20) {
        doc.addPage()
        currentY = doc.page.margins.top
        // Redraw header on new page
        drawRow(currentY, headerCells, true, false)
        currentY += rowHeight
      }

      const cells = data.fields.map((f) => {
        const v = data.rows[i][f.key]
        return v === null || v === undefined ? '' : String(v)
      })
      drawRow(currentY, cells, false, i % 2 === 0)
      currentY += rowHeight
    }

    // ── Footer per page ────────────────────────────────────────────────────
    const totalPages = doc.bufferedPageRange().count + 1
    const today = new Date().toLocaleDateString('pt-BR')

    // Write footer on current (last) page
    doc
      .fontSize(8)
      .fillColor('#9CA3AF')
      .text(
        `Página 1 de ${totalPages} — Exportado em ${today}`,
        doc.page.margins.left,
        doc.page.height - doc.page.margins.bottom - 10,
        { align: 'center', width: pageWidth }
      )

    doc.end()
  })
}
