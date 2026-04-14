'use server'

import { createClient } from '@/lib/supabase/server'
import { handleActionError } from '@/lib/errors'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { logAudit } from '@/lib/audit'

// ─── Types ───────────────────────────────────────────────────────────────────

export interface EquipmentFormData {
  professional_id: string
  professional_name: string
  company?: string
  machine_type?: string
  machine_model?: string
  office_package?: string
  software_details?: string
}

export interface ActionResult {
  error?: string
  success?: boolean
}

// ─── CREATE ───────────────────────────────────────────────────────────────────

export async function createEquipment(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (!user || authError) return { error: 'Não autorizado.' }

  const professionalId = formData.get('professional_id') as string
  const professionalName = formData.get('professional_name') as string

  if (!professionalId?.trim()) {
    return { error: 'Selecione um profissional cadastrado.' }
  }

  // professional_id adicionado via migration — cast até tipos serem regenerados
  const payload = {
    professional_id: professionalId,
    professional_name: professionalName?.trim() || '',
    company: (formData.get('company') as string)?.trim() || null,
    machine_type: (formData.get('machine_type') as string) || null,
    machine_model: (formData.get('machine_model') as string)?.trim() || null,
    office_package: formData.get('office_package') === 'on' || formData.get('office_package') === 'true',
    software_details: (formData.get('software_details') as string)?.trim() || null,
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: created, error } = await (supabase.from('equipment') as any)
    .insert(payload)
    .select()
    .single()

  if (error) {
    console.error('[createEquipment]', error)
    return { error: handleActionError(error) }
  }

  await logAudit({
    entidade: 'equipment',
    entidade_id: created.id,
    acao: 'CREATE',
    dados_antes: null,
    dados_depois: created as Record<string, unknown>,
  })

  revalidatePath('/equipamentos')
  redirect(`/equipamentos/${created.id}`)
}

// ─── UPDATE ───────────────────────────────────────────────────────────────────

export async function updateEquipment(
  id: string,
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (!user || authError) return { error: 'Não autorizado.' }

  const professionalId = formData.get('professional_id') as string
  const professionalName = formData.get('professional_name') as string

  if (!professionalId?.trim()) {
    return { error: 'Selecione um profissional cadastrado.' }
  }

  // professional_id adicionado via migration — cast até tipos serem regenerados
  const payload = {
    professional_id: professionalId,
    professional_name: professionalName?.trim() || '',
    company: (formData.get('company') as string)?.trim() || null,
    machine_type: (formData.get('machine_type') as string) || null,
    machine_model: (formData.get('machine_model') as string)?.trim() || null,
    office_package: formData.get('office_package') === 'on' || formData.get('office_package') === 'true',
    software_details: (formData.get('software_details') as string)?.trim() || null,
  }

  const { data: antes } = await supabase
    .from('equipment')
    .select()
    .eq('id', id)
    .single()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('equipment') as any)
    .update(payload)
    .eq('id', id)

  if (error) {
    console.error('[updateEquipment]', error)
    return { error: handleActionError(error) }
  }

  await logAudit({
    entidade: 'equipment',
    entidade_id: id,
    acao: 'UPDATE',
    dados_antes: antes as Record<string, unknown> | null,
    dados_depois: { ...payload, id } as Record<string, unknown>,
  })

  revalidatePath('/equipamentos')
  revalidatePath(`/equipamentos/${id}`)
  redirect(`/equipamentos/${id}`)
}

// ─── DELETE ───────────────────────────────────────────────────────────────────

export async function deleteEquipment(id: string): Promise<ActionResult> {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (!user || authError) return { error: 'Não autorizado.' }

  const { data: antes } = await supabase
    .from('equipment')
    .select()
    .eq('id', id)
    .single()

  const { error } = await supabase
    .from('equipment')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('[deleteEquipment]', error)
    return { error: handleActionError(error) }
  }

  await logAudit({
    entidade: 'equipment',
    entidade_id: id,
    acao: 'DELETE',
    dados_antes: antes as Record<string, unknown> | null,
    dados_depois: null,
  })

  revalidatePath('/equipamentos')
  return { success: true }
}
