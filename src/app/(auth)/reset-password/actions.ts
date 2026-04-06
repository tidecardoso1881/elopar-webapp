'use server'

import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

type ResetState = {
  error?: string
  success?: boolean
  email?: string
} | null

export async function requestPasswordReset(
  prevState: ResetState,
  formData: FormData
): Promise<ResetState> {
  const email = (formData.get('email') as string)?.trim().toLowerCase()

  if (!email) return { error: 'Informe seu email.' }
  if (!email.includes('@')) return { error: 'Email inválido.' }

  const supabase = await createClient()
  const headersList = await headers()
  const origin = headersList.get('origin') ?? 'http://localhost:3000'

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/update-password`,
  })

  if (error) {
    return { error: 'Erro ao enviar email. Tente novamente.' }
  }

  // Sempre retornamos sucesso para não vazar quais emails existem
  return { success: true, email }
}