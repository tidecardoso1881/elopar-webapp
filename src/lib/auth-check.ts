'use server'

import { createClient } from '@/lib/supabase/server'
import { canWrite } from '@/types/roles'

interface AuthCheckResult {
  userId: string
  error?: never
}

interface AuthCheckError {
  error: string
  userId?: never
}

/**
 * Verifica autenticação + role de escrita (admin ou gerente).
 * Retorna userId em caso de sucesso, ou error string em caso de falha.
 */
export async function requireWriteAccess(): Promise<AuthCheckResult | AuthCheckError> {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (!user || authError) return { error: 'Não autorizado.' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!canWrite(profile?.role)) {
    return { error: 'Permissão insuficiente para esta operação.' }
  }

  return { userId: user.id }
}
