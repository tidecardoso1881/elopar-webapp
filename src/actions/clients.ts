'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export interface ClientActionResult {
  error?: string
  success?: boolean
}

// ─── CREATE ──────────────────────────────────────────────────────────────────

export async function createClientAction(
  _prevState: ClientActionResult,
  formData: FormData
): Promise<ClientActionResult> {
  const supabase = await createClient()

  const name = (formData.get('name') as string)?.trim()

  if (!name) {
    return { error: 'Nome do cliente é obrigatório.' }
  }

  const { error } = await supabase
    .from('clients')
    .insert({ name })

  if (error) {
    if (error.code === '23505') {
      return { error: 'Já existe um cliente com esse nome.' }
    }
    return { error: `Erro ao criar cliente: ${error.message}` }
  }

  revalidatePath('/clientes')
  redirect('/clientes')
}

// ─── UPDATE ───────────────────────────────────────────────────────────────────

export async function updateClientAction(
  id: string,
  _prevState: ClientActionResult,
  formData: FormData
): Promise<ClientActionResult> {
  const supabase = await createClient()

  const name = (formData.get('name') as string)?.trim()

  if (!name) {
    return { error: 'Nome do cliente é obrigatório.' }
  }

  const { error } = await supabase
    .from('clients')
    .update({ name, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) {
    if (error.code === '23505') {
      return { error: 'Já existe um cliente com esse nome.' }
    }
    return { error: `Erro ao atualizar cliente: ${error.message}` }
  }

  revalidatePath('/clientes')
  redirect('/clientes')
}

// ─── DELETE ───────────────────────────────────────────────────────────────────

export async function deleteClientAction(id: string): Promise<ClientActionResult> {
  const supabase = await createClient()

  // Verifica se há profissionais vinculados
  const { count } = await supabase
    .from('professionals')
    .select('id', { count: 'exact', head: true })
    .eq('client_id', id)

  if ((count ?? 0) > 0) {
    return {
      error: `Não é possível excluir: existem ${count} profissional(is) vinculado(s) a este cliente.`,
    }
  }

  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: `Erro ao excluir cliente: ${error.message}` }
  }

  revalidatePath('/clientes')
  return { success: true }
}
