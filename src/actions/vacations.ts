'use server'

import { createClient } from '@/lib/supabase/server'
import { requireWriteAccess } from '@/lib/auth-check'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { logAudit } from '@/lib/audit'

// ─── Types ───────────────────────────────────────────────────────────────────

export interface VacationFormData {
  professional_name: string
  admission_date?: string
  acquisition_start?: string
  acquisition_end?: string
  concession_start?: string
  concession_end?: string
  vacation_start?: string
  vacation_end?: string
  total_days?: string
  bonus_days?: string
  days_balance?: string
  leadership?: string
  client_area?: string
}

export interface ActionResult {
  error?: string
  success?: boolean
}

// ─── CREATE ───────────────────────────────────────────────────────────────────

export async function createVacation(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (!user || authError) return { error: 'Não autorizado.' }

  const data: VacationFormData = {
    professional_name: formData.get('professional_name') as string,
    admission_date: formData.get('admission_date') as string,
    acquisition_start: formData.get('acquisition_start') as string,
    acquisition_end: formData.get('acquisition_end') as string,
    concession_start: formData.get('concession_start') as string,
    concession_end: formData.get('concession_end') as string,
    vacation_start: formData.get('vacation_start') as string,
    vacation_end: formData.get('vacation_end') as string,
    total_days: formData.get('total_days') as string,
    bonus_days: formData.get('bonus_days') as string,
    days_balance: formData.get('days_balance') as string,
    leadership: formData.get('leadership') as string,
    client_area: formData.get('client_area') as string,
  }

  if (!data.professional_name?.trim()) {
    return { error: 'Nome do profissional é obrigatório.' }
  }

  const payload = {
    professional_name: data.professional_name.trim(),
    admission_date: data.admission_date?.trim() || null,
    acquisition_start: data.acquisition_start?.trim() || null,
    acquisition_end: data.acquisition_end?.trim() || null,
    concession_start: data.concession_start?.trim() || null,
    concession_end: data.concession_end?.trim() || null,
    vacation_start: data.vacation_start?.trim() || null,
    vacation_end: data.vacation_end?.trim() || null,
    total_days: data.total_days ? parseInt(data.total_days, 10) : null,
    bonus_days: data.bonus_days ? parseInt(data.bonus_days, 10) : null,
    days_balance: data.days_balance ? parseInt(data.days_balance, 10) : null,
    leadership: data.leadership?.trim() || null,
    client_area: data.client_area?.trim() || null,
  }

  const { data: created, error } = await supabase
    .from('vacations')
    .insert(payload)
    .select()
    .single()

  if (error) {
    console.error('[createVacation]', error)
    return { error: `Erro ao criar férias: ${error.message}` }
  }

  await logAudit({
    entidade: 'vacation',
    entidade_id: created.id,
    acao: 'CREATE',
    dados_antes: null,
    dados_depois: created as Record<string, unknown>,
  })

  revalidatePath('/ferias')
  redirect(`/ferias/${created.id}`)
}

// ─── UPDATE ───────────────────────────────────────────────────────────────────

export async function updateVacation(id: string) {
  return async function (_prevState: ActionResult, formData: FormData): Promise<ActionResult> {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (!user || authError) return { error: 'Não autorizado.' }

    const data: VacationFormData = {
      professional_name: formData.get('professional_name') as string,
      admission_date: formData.get('admission_date') as string,
      acquisition_start: formData.get('acquisition_start') as string,
      acquisition_end: formData.get('acquisition_end') as string,
      concession_start: formData.get('concession_start') as string,
      concession_end: formData.get('concession_end') as string,
      vacation_start: formData.get('vacation_start') as string,
      vacation_end: formData.get('vacation_end') as string,
      total_days: formData.get('total_days') as string,
      bonus_days: formData.get('bonus_days') as string,
      days_balance: formData.get('days_balance') as string,
      leadership: formData.get('leadership') as string,
      client_area: formData.get('client_area') as string,
    }

    if (!data.professional_name?.trim()) {
      return { error: 'Nome do profissional é obrigatório.' }
    }

    const payload = {
      professional_name: data.professional_name.trim(),
      admission_date: data.admission_date?.trim() || null,
      acquisition_start: data.acquisition_start?.trim() || null,
      acquisition_end: data.acquisition_end?.trim() || null,
      concession_start: data.concession_start?.trim() || null,
      concession_end: data.concession_end?.trim() || null,
      vacation_start: data.vacation_start?.trim() || null,
      vacation_end: data.vacation_end?.trim() || null,
      total_days: data.total_days ? parseInt(data.total_days, 10) : null,
      bonus_days: data.bonus_days ? parseInt(data.bonus_days, 10) : null,
      days_balance: data.days_balance ? parseInt(data.days_balance, 10) : null,
      leadership: data.leadership?.trim() || null,
      client_area: data.client_area?.trim() || null,
    }

    const { data: antes } = await supabase
      .from('vacations')
      .select()
      .eq('id', id)
      .single()

    const { error } = await supabase
      .from('vacations')
      .update(payload)
      .eq('id', id)

    if (error) {
      console.error('[updateVacation]', error)
      return { error: `Erro ao atualizar: ${error.message}` }
    }

    await logAudit({
      entidade: 'vacation',
      entidade_id: id,
      acao: 'UPDATE',
      dados_antes: antes as Record<string, unknown> | null,
      dados_depois: { ...payload, id } as Record<string, unknown>,
    })

    revalidatePath('/ferias')
    revalidatePath(`/ferias/${id}`)
    redirect(`/ferias/${id}`)
  }
}

// ─── DELETE ───────────────────────────────────────────────────────────────────

export async function deleteVacation(id: string): Promise<ActionResult> {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (!user || authError) return { error: 'Não autorizado.' }

  const { data: antes } = await supabase
    .from('vacations')
    .select()
    .eq('id', id)
    .single()

  const { error } = await supabase
    .from('vacations')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('[deleteVacation]', error)
    return { error: `Erro ao excluir férias: ${error.message}` }
  }

  await logAudit({
    entidade: 'vacation',
    entidade_id: id,
    acao: 'DELETE',
    dados_antes: antes as Record<string, unknown> | null,
    dados_depois: null,
  })

  revalidatePath('/ferias')
  return { success: true }
}
