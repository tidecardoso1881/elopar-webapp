'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// ─── Types ────────────────────────────────────────────────────────────────────

type Entidade = 'professional' | 'client' | 'equipment' | 'vacation'
type Acao = 'CREATE' | 'UPDATE' | 'DELETE'

interface LogAuditParams {
  entidade: Entidade
  entidade_id: string
  acao: Acao
  dados_antes?: Record<string, unknown> | null
  dados_depois?: Record<string, unknown> | null
}

interface LogAuditResult {
  error?: string
}

// ─── logAudit ─────────────────────────────────────────────────────────────────

/**
 * Registra uma operação no audit_log.
 * Usa service_role para contornar RLS (log é "best effort" — não desfaz operação principal).
 */
export async function logAudit({
  entidade,
  entidade_id,
  acao,
  dados_antes = null,
  dados_depois = null,
}: LogAuditParams): Promise<LogAuditResult> {
  try {
    // Recupera o user_id do contexto de autenticação
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'Usuário não autenticado — audit log não registrado.' }
    }

    const adminClient = createAdminClient()

    const { error } = await adminClient.from('audit_log').insert({
      user_id: user.id,
      entidade,
      entidade_id,
      acao,
      dados_antes: dados_antes ?? null,
      dados_depois: dados_depois ?? null,
    })

    if (error) {
      // Log silencioso — não propaga o erro para não afetar a operação principal
      console.error('[logAudit] Erro ao inserir audit log:', error.message)
      return { error: error.message }
    }

    return {}
  } catch (err) {
    console.error('[logAudit] Exceção inesperada:', err)
    return { error: String(err) }
  }
}
