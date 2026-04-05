import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { formatDate, formatCurrency } from '@/lib/utils/formatting'

// ─── CSV helpers ──────────────────────────────────────────────────────────────

function escapeCsvField(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return ''
  const str = String(value)
  // Escapa aspas duplas e envolve em aspas se necessário
  if (str.includes('"') || str.includes(',') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

function buildCsvRow(fields: (string | number | null | undefined)[]): string {
  return fields.map(escapeCsvField).join(',')
}

// ─── Headers CSV ─────────────────────────────────────────────────────────────

const CSV_HEADERS = [
  'OS',
  'Nome',
  'E-mail',
  'Telefone',
  'Gestor',
  'Perfil',
  'Cargo',
  'Senioridade',
  'Status',
  'Tipo Contrato',
  'Cliente',
  'Data Início',
  'Data Fim',
  'Início Contrato',
  'Fim Contrato',
  'Prazo Renovação',
  'Taxa Hora',
  'Valor CLT',
  'Valor Estratégico',
  'Horas Trabalhadas',
  'Valor Pagamento',
  'Outros Valores',
  'Taxa Cobrança',
  'Cobrança Renovação',
  'Total Faturamento',
]

// ─── Route Handler ────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const supabase = await createClient()

  // Verifica sessão
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  // Lê filtros da query string (mesmos da lista de profissionais)
  const { searchParams } = new URL(request.url)
  const search = searchParams.get('q')?.trim() ?? ''
  const clienteId = searchParams.get('cliente') ?? ''
  const status = searchParams.get('status') ?? ''

  // Query — busca todos (sem paginação) para o CSV
  let query = supabase
    .from('professionals')
    .select(`
      os,
      name,
      email,
      contact,
      manager,
      profile,
      position,
      seniority,
      status,
      contract_type,
      client:clients(name),
      date_start,
      date_end,
      contract_start,
      contract_end,
      renewal_deadline,
      hourly_rate,
      value_clt,
      value_strategic,
      hours_worked,
      payment_value,
      other_values,
      billing_rate,
      renewal_billing,
      total_billing
    `)
    .order('name')

  if (search) query = query.ilike('name', `%${search}%`)
  if (clienteId) query = query.eq('client_id', clienteId)
  if (status) query = query.eq('status', status)

  const { data: professionals, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Monta o CSV com BOM UTF-8 (para Excel reconhecer acentos)
  const BOM = '\uFEFF'
  const rows: string[] = [CSV_HEADERS.join(',')]

  for (const p of professionals ?? []) {
    const clientName = (p.client as { name: string } | null)?.name ?? ''
    rows.push(
      buildCsvRow([
        p.os,
        p.name,
        p.email,
        p.contact,
        p.manager,
        p.profile,
        p.position,
        p.seniority,
        p.status,
        p.contract_type,
        clientName,
        formatDate(p.date_start),
        formatDate(p.date_end),
        formatDate(p.contract_start),
        formatDate(p.contract_end),
        formatDate(p.renewal_deadline),
        formatCurrency(p.hourly_rate),
        formatCurrency(p.value_clt),
        formatCurrency(p.value_strategic),
        p.hours_worked,
        formatCurrency(p.payment_value),
        formatCurrency(p.other_values),
        formatCurrency(p.billing_rate),
        formatCurrency(p.renewal_billing),
        formatCurrency(p.total_billing),
      ])
    )
  }

  const csvContent = BOM + rows.join('\r\n')

  // Nome do arquivo com data atual
  const hoje = new Date().toISOString().slice(0, 10)
  const filename = `profissionais_elopar_${hoje}.csv`

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  })
}
