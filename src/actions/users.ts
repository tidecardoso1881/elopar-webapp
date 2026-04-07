'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type ActionResult = { success?: true; error?: string }

export async function updateProfile(data: {
  full_name: string
}): Promise<ActionResult> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autorizado.' }

  const { error } = await supabase
    .from('profiles')
    .update({ full_name: data.full_name.trim() })
    .eq('id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/area-usuario/perfil')
  revalidatePath('/', 'layout')
  return { success: true }
}
