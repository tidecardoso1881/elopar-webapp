'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ProfessionalFormData {
  name: string
  os?: string
  email?: string
  manager?: string
  contact?: string
  profile?: string
  position?: string
  seniority?: string
  status: string
  contract_type?: string
  client_id: string
  date_start?: string
  date_end?: string
  contract_start?: string
  contract_end?: string
  renewal_deadline?: string
  hourly_rate?: string
  value_clt?: string
  value_strategic?: string
  hours_worked?: string
  payment_value?: string
  other_values?: string
  billing_rate?: string
  renewal_billing?: string
  total_billing?: string
}

export interface ActionResult {
  error?: string
  success?: boolean
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function parseOptionalNumber(val: string | undefined): number | null {
  if (!val || val.trim() === '') return null
  const n = parseFloat(val.replace(',', '.'))
  return isNaN(n) ? null : n
}

function parseOptionalInt(val: string | undefined): number | null {
  if (!val || val.trim() === '') return null
  const n = parseInt(val, 10)
  return isNaN(n) ? null : n
}

function parseOptionalDate(val: string | undefined): string | null {
  if (!val || val.trim() === '') return null
  return val
}

function buildProfessionalPayload(data: ProfessionalFormData) {
  return {
    name: data.name.trim(),
    os: parseOptionalInt(data.os),
    email: data.email?.trim() || null,
    manager: data.manager?.trim() || null,
    contact: data.contact?.trim() || null,
    profile: data.profile?.trim() || null,
    position: data.position?.trim() || null,
    seniority: data.seniority || null,
    status: data.status,
    contract_type: data.contract_type || null,
    client_id: data.client_id,
    date_start: parseOptionalDate(data.date_start),
    date_end: parseOptionalDate(data.date_end),
    contract_start: parseOptionalDate(data.contract_start),
    contract_end: parseOptionalDate(data.contract_end),
    renewal_deadline: parseOptionalDate(data.renewal_deadline),
    hourly_rate: parseOptionalNumber(data.hourly_rate),
    value_clt: parseOptionalNumber(data.value_clt) ?? 0,
    value_strategic: parseOptionalNumber(data.value_strategic) ?? 0,
    hours_worked: parseOptionalNumber(data.hours_worked) ?? 0,
    payment_value: parseOptionalNumber(data.payment_value) ?? 0,
    other_values: parseOptionalNumber(data.other_values) ?? 0,
    billing_rate: parseOptionalNumber(data.billing_rate) ?? 0,
    renewal_billing: parseOptionalNumber(data.renewal_billing) ?? 0,
    total_billing: parseOptionalNumber(data.total_billing) ?? 0,
  }
}

// ─── Validation Helper ───────────────────────────────────────────────────────

function validateProfessionalData(data: ProfessionalFormData): string | null {
  const nameTrimed = data.name?.trim() || ''

  // Validação: nome obrigatório com mínimo 3 caracteres
  if (!nameTrimed) {
    return 'Nome é obrigatório.'
  }
  if (nameTrimed.length < 3) {
    return 'Nome deve ter no mínimo 3 caracteres.'
  }

  // Validação: cliente obrigatório
  if (!data.client_id) {
    return 'Cliente é obrigatório.'
  }

  // Validação: status válido
  const validStatuses = ['ATIVO', 'DESLIGADO']
  if (data.status && !validStatuses.includes(data.status)) {
    return `Status inválido. Deve ser um de: ${validStatuses.join(', ')}.`
  }

  // Validação: renewal_deadline deve ser data válida se fornecida
  if (data.renewal_deadline?.trim()) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(data.renewal_deadline)) {
      return 'Prazo de Renovação deve estar no formato YYYY-MM-DD.'
    }
    const date = new Date(data.renewal_deadline)
    if (isNaN(date.getTime())) {
      return 'Prazo de Renovação é uma data inválida.'
    }
  }

  return null
}

// ─── CREATE ───────────────────────────────────────────────────────────────────

export async function createProfessional(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const supabase = await createClient()

  const data: ProfessionalFormData = {
    name: formData.get('name') as string,
    os: formData.get('os') as string,
    email: formData.get('email') as string,
    manager: formData.get('manager') as string,
    contact: formData.get('contact') as string,
    profile: formData.get('profile') as string,
    position: formData.get('position') as string,
    seniority: formData.get('seniority') as string,
    status: (formData.get('status') as string) || 'ATIVO',
    contract_type: formData.get('contract_type') as string,
    client_id: formData.get('client_id') as string,
    date_start: formData.get('date_start') as string,
    date_end: formData.get('date_end') as string,
    contract_start: formData.get('contract_start') as string,
    contract_end: formData.get('contract_end') as string,
    renewal_deadline: formData.get('renewal_deadline') as string,
    hourly_rate: formData.get('hourly_rate') as string,
    value_clt: formData.get('value_clt') as string,
    value_strategic: formData.get('value_strategic') as string,
    hours_worked: formData.get('hours_worked') as string,
    payment_value: formData.get('payment_value') as string,
    other_values: formData.get('other_values') as string,
    billing_rate: formData.get('billing_rate') as string,
    renewal_billing: formData.get('renewal_billing') as string,
    total_billing: formData.get('total_billing') as string,
  }

  // Validação completa
  const validationError = validateProfessionalData(data)
  if (validationError) {
    return { error: validationError }
  }

  const payload = buildProfessionalPayload(data)

  const { data: created, error } = await supabase
    .from('professionals')
    .insert(payload)
    .select('id')
    .single()

  if (error) {
    console.error('[createProfessional]', error)
    return { error: `Erro ao criar profissional: ${error.message}` }
  }

  revalidatePath('/profissionais')
  redirect(`/profissionais/${created.id}`)
}

// ─── UPDATE ───────────────────────────────────────────────────────────────────

export async function updateProfessional(
  id: string,
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const supabase = await createClient()

  const data: ProfessionalFormData = {
    name: formData.get('name') as string,
    os: formData.get('os') as string,
    email: formData.get('email') as string,
    manager: formData.get('manager') as string,
    contact: formData.get('contact') as string,
    profile: formData.get('profile') as string,
    position: formData.get('position') as string,
    seniority: formData.get('seniority') as string,
    status: (formData.get('status') as string) || 'ATIVO',
    contract_type: formData.get('contract_type') as string,
    client_id: formData.get('client_id') as string,
    date_start: formData.get('date_start') as string,
    date_end: formData.get('date_end') as string,
    contract_start: formData.get('contract_start') as string,
    contract_end: formData.get('contract_end') as string,
    renewal_deadline: formData.get('renewal_deadline') as string,
    hourly_rate: formData.get('hourly_rate') as string,
    value_clt: formData.get('value_clt') as string,
    value_strategic: formData.get('value_strategic') as string,
    hours_worked: formData.get('hours_worked') as string,
    payment_value: formData.get('payment_value') as string,
    other_values: formData.get('other_values') as string,
    billing_rate: formData.get('billing_rate') as string,
    renewal_billing: formData.get('renewal_billing') as string,
    total_billing: formData.get('total_billing') as string,
  }

  // Validação completa
  const validationError = validateProfessionalData(data)
  if (validationError) {
    return { error: validationError }
  }

  const payload = buildProfessionalPayload(data)

  const { error } = await supabase
    .from('professionals')
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) {
    console.error('[updateProfessional]', error)
    return { error: `Erro ao atualizar: ${error.message}` }
  }

  revalidatePath('/profissionais')
  revalidatePath(`/profissionais/${id}`)
  redirect(`/profissionais/${id}`)
}

// ─── SOFT DELETE (status → DESLIGADO) ─────────────────────────────────────────

export async function deleteProfessional(id: string): Promise<ActionResult> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('professionals')
    .update({ status: 'DESLIGADO', updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) {
    console.error('[deleteProfessional]', error)
    return { error: `Erro ao desligar profissional: ${error.message}` }
  }

  revalidatePath('/profissionais')
  revalidatePath(`/profissionais/${id}`)
  return { success: true }
}

// ─── RENEW PROFESSIONAL (EP-048) ──────────────────────────────────────────────

export async function renewProfessional(
  id: string,
  newDate: string
): Promise<ActionResult> {
  if (!id) return { error: 'ID do profissional é obrigatório.' }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!newDate || !dateRegex.test(newDate)) {
    return { error: 'Data de renovação inválida. Use o formato YYYY-MM-DD.' }
  }

  const supabase = await createClient()

  const { error } = await supabase
    .from('professionals')
    .update({
      renewal_deadline: newDate,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) {
    console.error('[renewProfessional]', error)
    return { error: `Erro ao renovar: ${error.message}` }
  }

  revalidatePath('/renovacoes')
  revalidatePath('/profissionais')
  revalidatePath(`/profissionais/${id}`)
  return { success: true }
}
