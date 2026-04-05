'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export type SignInState = {
  error?: string
  message?: string
} | null

export async function signIn(
  prevState: SignInState,
  formData: FormData
): Promise<SignInState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email e senha são obrigatórios.' }
  }

  if (!email.includes('@')) {
    return { error: 'Informe um email válido.' }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  })

  if (error) {
    switch (true) {
      case error.message.includes('Invalid login credentials'):
        return { error: 'Email ou senha inválidos. Verifique seus dados.' }
      case error.message.includes('Email not confirmed'):
        return { error: 'Confirme seu email antes de acessar o sistema.' }
      case error.message.includes('Too many requests'):
        return { error: 'Muitas tentativas. Aguarde alguns minutos e tente novamente.' }
      default:
        return { error: 'Erro ao fazer login. Tente novamente.' }
    }
  }

  redirect('/dashboard')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}