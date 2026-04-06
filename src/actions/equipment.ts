'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

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
    .select('id')
    .single()

  if (error) {
    console.error('[createEquipment]', error)
    return { error: `Erro ao criar equipamento: ${error.message}` }
  }

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

  const { error } = await supabase
    .from('equipment')
    .update(payload)
    .eq('id', id)

  if (error) {
    console.error('[updateEquipment]', error)
    return { error: `Erro ao atualizar: ${error.message}` }
  }

  revalidatePath('/equipamentos')
  revalidatePath(`/equipamentos/${id}`)
  redirect(`/equipamentos/${id}`)
}

// ─── DELETE ───────────────────────────────────────────────────────────────────

export async function deleteEquipment(id: string): Promise<ActionResult> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('equipment')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('[deleteEquipment]', error)
    return { error: `Erro ao excluir equipamento: ${error.message}` }
  }

  revalidatePath('/equipamentos')
  return { success: true }
}
