'use server'

import { createClient } from '@/lib/supabase/server'
import { requireWriteAccess } from '@/lib/auth-check'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { logAudit } from '@/lib/audit'

// ─── Types ───────────────────────────────────────────────────────────────────

export interface EquipmentFormData {
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

  const data: EquipmentFormData = {
    professional_name: formData.get('professional_name') as string,
    company: formData.get('company') as string,
    machine_type: formData.get('machine_type') as string,
    machine_model: formData.get('machine_model') as string,
    office_package: formData.get('office_package') as string,
    software_details: formData.get('software_details') as string,
  }

  if (!data.professional_name?.trim()) {
    return { error: 'Nome do profissional é obrigatório.' }
  }

  const payload = {
    professional_name: data.professional_name.trim(),
    company: data.company?.trim() || null,
    machine_type: data.machine_type || null,
    machine_model: data.machine_model?.trim() || null,
    office_package: data.office_package === 'on' || data.office_package === 'true',
    software_details: data.software_details?.trim() || null,
  }

  const { data: created, error } = await supabase
    .from('equipment')
    .insert(payload)
    .select()
    .single()

  if (error) {
    console.error('[createEquipment]', error)
    return { error: `Erro ao criar equipamento: ${error.message}` }
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

  const data: EquipmentFormData = {
    professional_name: formData.get('professional_name') as string,
    company: formData.get('company') as string,
    machine_type: formData.get('machine_type') as string,
    machine_model: formData.get('machine_model') as string,
    office_package: formData.get('office_package') as string,
    software_details: formData.get('software_details') as string,
  }

  if (!data.professional_name?.trim()) {
    return { error: 'Nome do profissional é obrigatório.' }
  }

  const payload = {
    professional_name: data.professional_name.trim(),
    company: data.company?.trim() || null,
    machine_type: data.machine_type || null,
    machine_model: data.machine_model?.trim() || null,
    office_package: data.office_package === 'on' || data.office_package === 'true',
    software_details: data.software_details?.trim() || null,
  }

  const { data: antes } = await supabase
    .from('equipment')
    .select()
    .eq('id', id)
    .single()

  const { error } = await supabase
    .from('equipment')
    .update(payload)
    .eq('id', id)

  if (error) {
    console.error('[updateEquipment]', error)
    return { error: `Erro ao atualizar: ${error.message}` }
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
    return { error: `Erro ao excluir equipamento: ${error.message}` }
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
