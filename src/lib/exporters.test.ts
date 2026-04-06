import { describe, it, expect } from 'vitest'
import { exportToCSV, exportToXLSX, exportToPDF } from './exporters'
import type { ExportData } from './exporters'
import * as XLSX from 'xlsx'

// ─── Test fixtures ────────────────────────────────────────────────────────────

const FIELDS = [
  { key: 'nome', label: 'Nome' },
  { key: 'email', label: 'E-mail' },
  { key: 'status', label: 'Status' },
]

const ROWS = [
  { nome: 'João da Costa', email: 'joao@example.com', status: 'Ativo' },
  { nome: 'Maria, "a" Silva', email: 'maria@example.com', status: 'Inativo' },
]

const DATA: ExportData = {
  fields: FIELDS,
  rows: ROWS,
  filename: 'test.csv',
}

// ─── CSV ─────────────────────────────────────────────────────────────────────

describe('exportToCSV', () => {
  it('returns a Buffer', () => {
    const buf = exportToCSV(DATA)
    expect(buf).toBeInstanceOf(Buffer)
  })

  it('starts with UTF-8 BOM', () => {
    const buf = exportToCSV(DATA)
    const str = buf.toString('utf-8')
    expect(str.startsWith('\uFEFF')).toBe(true)
  })

  it('includes uppercase headers', () => {
    const buf = exportToCSV(DATA)
    // Strip BOM before comparing
    const str = buf.toString('utf-8').replace(/^\uFEFF/, '')
    const firstLine = str.split('\r\n')[0]
    expect(firstLine).toBe('NOME,E-MAIL,STATUS')
  })

  it('produces correct number of data rows', () => {
    const buf = exportToCSV(DATA)
    const str = buf.toString('utf-8')
    // BOM + header + 2 data rows = 3 lines
    const lines = str.split('\r\n').filter(Boolean)
    expect(lines).toHaveLength(3)
  })

  it('escapes commas and quotes in values', () => {
    const buf = exportToCSV(DATA)
    const str = buf.toString('utf-8')
    // 'Maria, "a" Silva' should be escaped
    expect(str).toContain('"Maria, ""a"" Silva"')
  })

  it('handles null/undefined values as empty strings', () => {
    const data: ExportData = {
      fields: [{ key: 'nome', label: 'Nome' }, { key: 'cpf', label: 'CPF' }],
      rows: [{ nome: 'João', cpf: null }],
      filename: 'test.csv',
    }
    const buf = exportToCSV(data)
    const str = buf.toString('utf-8')
    const dataLine = str.split('\r\n')[1]
    expect(dataLine).toBe('João,')
  })
})

// ─── XLSX ────────────────────────────────────────────────────────────────────

describe('exportToXLSX', () => {
  it('returns a Buffer', () => {
    const buf = exportToXLSX(DATA)
    expect(buf).toBeInstanceOf(Buffer)
  })

  it('produces a valid XLSX workbook', () => {
    const buf = exportToXLSX(DATA)
    const wb = XLSX.read(buf, { type: 'buffer' })
    expect(wb.SheetNames).toContain('Profissionais')
  })

  it('has the correct header row', () => {
    const buf = exportToXLSX(DATA)
    const wb = XLSX.read(buf, { type: 'buffer' })
    const ws = wb.Sheets['Profissionais']
    const rows = XLSX.utils.sheet_to_json<string[]>(ws, { header: 1 }) as string[][]
    expect(rows[0]).toEqual(['Nome', 'E-mail', 'Status'])
  })

  it('has the correct number of data rows + footer', () => {
    const buf = exportToXLSX(DATA)
    const wb = XLSX.read(buf, { type: 'buffer' })
    const ws = wb.Sheets['Profissionais']
    const rows = XLSX.utils.sheet_to_json<string[]>(ws, { header: 1 }) as string[][]
    // header(1) + data(2) + footer(1) = 4
    expect(rows).toHaveLength(4)
  })

  it('footer contains total record count', () => {
    const buf = exportToXLSX(DATA)
    const wb = XLSX.read(buf, { type: 'buffer' })
    const ws = wb.Sheets['Profissionais']
    const rows = XLSX.utils.sheet_to_json<string[]>(ws, { header: 1 }) as string[][]
    const lastRow = rows[rows.length - 1]
    expect(String(lastRow[0])).toContain('2')
  })
})

// ─── PDF ─────────────────────────────────────────────────────────────────────

describe('exportToPDF', () => {
  it('returns a Buffer', async () => {
    const buf = await exportToPDF(DATA)
    expect(buf).toBeInstanceOf(Buffer)
  })

  it('starts with PDF magic bytes (%PDF)', async () => {
    const buf = await exportToPDF(DATA)
    expect(buf.slice(0, 4).toString()).toBe('%PDF')
  })

  it('generates PDF with metadata', async () => {
    const dataWithMeta: ExportData = {
      ...DATA,
      meta: {
        generatedAt: '06 de abril de 2026 às 14:30',
        userName: 'Tide Cardoso',
        statusFilter: 'Ativos',
        totalCount: 2,
      },
    }
    const buf = await exportToPDF(dataWithMeta)
    expect(buf.length).toBeGreaterThan(1000)
  })
})
