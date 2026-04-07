import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { formatDate, formatCurrency } from '@/lib/utils/formatting'
import { exportToCSV, exportToXLSX, exportToPDF, type ExportField } from '@/lib/exporters'

// ─── Allowed fields whitelist ─────────────────────────────────────────────────

const ALLOWED_FIELDS: ExportField[] = [
  { key: 'nome', label: 'Nome' },
  { key: 'cpf', label: 'CPF' },
  { key: 'email', label: 'E-mail' },
  { key: 'cliente', label: 'Cliente' },
  { key: 'posicao', label: 'Posição' },
  { key: 'senioridade', label: 'Senioridade' },
  { key: 'status', label: 'Status' },
  { key: 'contrato_inicio', label: 'Início Contrato' },
  { key: 'contrato_fim', label: 'Fim Contrato' },
  { key: 'renovacao', label: 'Data de Renovação' },
]

const FIELD_KEYS = new Set(ALLOWED_FIELDS.map((f) => f.key))

const DEFAULT_FIELDS = ['nome', 'email', 'cliente', 'posicao', 'senioridade', 'status']

// ─── Route Handler ────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const supabase = await createClient()

  // Verifica autenticação com validação no servidor (getUser é mais seguro que getSession)
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)

  // Format param
  const format = searchParams.get('format') ?? 'csv'
  if (!['csv', 'xlsx', 'pdf'].includes(format)) {
    return NextResponse.json({ error: 'Invalid format. Use csv, xlsx or pdf.' }, { status: 400 })
  }

  // Fields param — validate against whitelist
  const rawFields = searchParams.get('fields')
  const requestedKeys = rawFields
    ? rawFields.split(',').map((f) => f.trim()).filter(Boolean)
    : DEFAULT_FIELDS
  const validKeys = requestedKeys.filter((k) => FIELD_KEYS.has(k))
  if (validKeys.length === 0) {
    return NextResponse.json({ error: 'No valid fields requested.' }, { status: 400 })
  }
  const selectedFields = ALLOWED_FIELDS.filter((f) => validKeys.includes(f.key))

  // Status filter (legacy 'status' param also accepted)
  const exportStatus = searchParams.get('status') ?? 'all'
  // Legacy filters (same as list page)
  const search = searchParams.get('q')?.trim() ?? ''
  const clienteId = searchParams.get('cliente') ?? ''

  // Query
  let query = supabase
    .from('professionals')
    .select(
      `os, name, email, contact, manager, profile, position, seniority, status,
       contract_type, client:clients(name), date_start, date_end,
       contract_start, contract_end, renewal_deadline,
       hourly_rate, value_clt, value_strategic, hours_worked,
       payment_value, other_values, billing_rate, renewal_billing, total_billing`
    )
    .order('name')

  if (search) query = query.ilike('name', `%${search}%`)
  if (clienteId) query = query.eq('client_id', clienteId)
  if (exportStatus === 'active') query = query.eq('status', 'active')
  else if (exportStatus === 'inactive') query = query.eq('status', 'inactive')

  const { data: professionals, error } = await query
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const rows = (professionals ?? []).map((p) => {
    const clientName = (p.client as { name: string } | null)?.name ?? ''
    return {
      nome: p.name ?? '',
      cpf: '',              // CPF not in professionals table — placeholder
      email: p.email ?? '',
      cliente: clientName,
      posicao: p.position ?? '',
      senioridade: p.seniority ?? '',
      status: p.status ?? '',
      contrato_inicio: formatDate(p.contract_start),
      contrato_fim: formatDate(p.contract_end),
      renovacao: formatDate(p.renewal_deadline),
      // Extra fields for legacy CSV (not exposed via new modal but kept for backwards compat)
      os: p.os,
      contato: p.contact,
      gestor: p.manager,
      perfil: p.profile,
      tipo_contrato: p.contract_type,
      data_inicio: formatDate(p.date_start),
      data_fim: formatDate(p.date_end),
      prazo_renovacao: formatDate(p.renewal_deadline),
      taxa_hora: formatCurrency(p.hourly_rate),
      valor_clt: formatCurrency(p.value_clt),
      valor_estrategico: formatCurrency(p.value_strategic),
      horas_trabalhadas: p.hours_worked,
      valor_pagamento: formatCurrency(p.payment_value),
      outros_valores: formatCurrency(p.other_values),
      taxa_cobranca: formatCurrency(p.billing_rate),
      cobranca_renovacao: formatCurrency(p.renewal_billing),
      total_faturamento: formatCurrency(p.total_billing),
    }
  })

  const hoje = new Date().toISOString().slice(0, 10)
  const filename = `profissionais_elopar_${hoje}`

  // ── Generate file ─────────────────────────────────────────────────────────

  if (format === 'xlsx') {
    const buf = exportToXLSX({ fields: selectedFields, rows, filename: `${filename}.xlsx` })
    return new NextResponse(new Uint8Array(buf), {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}.xlsx"`,
        'Cache-Control': 'no-store',
      },
    })
  }

  if (format === 'pdf') {
    const statusLabel =
      exportStatus === 'active'
        ? 'Ativos'
        : exportStatus === 'inactive'
        ? 'Inativos'
        : 'Todos'

    const generatedAt = new Date().toLocaleString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

    // Get user profile name
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .single()
    const userName = profile?.full_name ?? user.email ?? 'Usuário'

    const buf = await exportToPDF({
      fields: selectedFields,
      rows,
      filename: `${filename}.pdf`,
      meta: {
        generatedAt,
        userName,
        statusFilter: statusLabel,
        totalCount: rows.length,
      },
    })
    return new NextResponse(new Uint8Array(buf), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}.pdf"`,
        'Cache-Control': 'no-store',
      },
    })
  }

  // Default: CSV
  const buf = exportToCSV({ fields: selectedFields, rows, filename: `${filename}.csv` })
  return new NextResponse(new Uint8Array(buf), {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}.csv"`,
      'Cache-Control': 'no-store',
    },
  })
}
