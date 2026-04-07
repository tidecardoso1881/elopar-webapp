'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

type ActionResult = { success: boolean; error?: string }

async function requireWriteRole(): Promise<{ userId: string } | { error: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autenticado' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || !['admin', 'gerente'].includes(profile.role)) {
    return { error: 'Acesso negado — apenas gerentes e administradores podem gerenciar notas' }
  }

  return { userId: user.id }
}

export async function createNoteAction(
  professionalId: string,
  content: string
): Promise<ActionResult> {
  const auth = await requireWriteRole()
  if ('error' in auth) return { success: false, error: auth.error }

  const trimmed = content.trim()
  if (!trimmed) return { success: false, error: 'Conteúdo não pode ser vazio' }
  if (trimmed.length > 1000) return { success: false, error: 'Conteúdo muito longo (máx. 1000 caracteres)' }

  const supabase = await createClient()
  const { error } = await supabase
    .from('professional_notes')
    .insert({
      professional_id: professionalId,
      author_id: auth.userId,
      content: trimmed,
    })

  if (error) return { success: false, error: error.message }

  revalidatePath(`/profissionais/${professionalId}`)
  return { success: true }
}

export async function updateNoteAction(
  noteId: string,
  professionalId: string,
  content: string
): Promise<ActionResult> {
  const auth = await requireWriteRole()
  if ('error' in auth) return { success: false, error: auth.error }

  const trimmed = content.trim()
  if (!trimmed) return { success: false, error: 'Conteúdo não pode ser vazio' }
  if (trimmed.length > 1000) return { success: false, error: 'Conteúdo muito longo (máx. 1000 caracteres)' }

  const supabase = await createClient()
  const { error } = await supabase
    .from('professional_notes')
    .update({ content: trimmed, updated_at: new Date().toISOString() })
    .eq('id', noteId)

  if (error) return { success: false, error: error.message }

  revalidatePath(`/profissionais/${professionalId}`)
  return { success: true }
}

export async function deleteNoteAction(
  noteId: string,
  professionalId: string
): Promise<ActionResult> {
  const auth = await requireWriteRole()
  if ('error' in auth) return { success: false, error: auth.error }

  const supabase = await createClient()
  const { error } = await supabase
    .from('professional_notes')
    .delete()
    .eq('id', noteId)

  if (error) return { success: false, error: error.message }

  revalidatePath(`/profissionais/${professionalId}`)
  return { success: true }
}
