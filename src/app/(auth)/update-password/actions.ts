'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

type UpdateState = {
  error?: string
} | null

export async function updatePassword(
  prevState: UpdateState,
  formData: FormData
): Promise<UpdateState> {
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (!password || password.length < 8) {
    return { error: 'A senha deve ter pelo menos 8 caracteres.' }
  }

  if (password !== confirmPassword) {
    return { error: 'As senhas não coincidem.' }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    if (error.message.includes('same password')) {
      return { error: 'A nova senha não pode ser igual à senha atual.' }
    }
    return { error: 'Erro ao atualizar senha. O link pode ter expirado — solicite um novo.' }
  }

  redirect('/dashboard')
}
