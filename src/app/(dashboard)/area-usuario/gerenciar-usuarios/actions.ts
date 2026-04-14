'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import type { UserPermissions } from '@/types/permissions'
import { logAudit } from '@/lib/audit'
import { insertNotification } from '@/lib/notifications'

type ActionResult = { success: boolean; error?: string }

async function requireAdmin(): Promise<string | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  return profile?.role === 'admin' ? user.id : null
}

function getAdminClient() {
  try {
    return { client: createAdminClient(), error: null }
  } catch {
    return {
      client: null,
      error: 'Chave de administrador não configurada no servidor. Contate o suporte técnico.',
    }
  }
}

export async function createUserAction(formData: FormData): Promise<ActionResult> {
  const adminId = await requireAdmin()
  if (!adminId) return { success: false, error: 'Acesso negado' }

  const email = (formData.get('email') as string)?.trim().toLowerCase()
  const fullName = (formData.get('full_name') as string)?.trim()
  const role = formData.get('role') as string

  if (!email || !fullName || !role) return { success: false, error: 'Preencha todos os campos' }
  if (!['admin', 'manager', 'consulta'].includes(role)) return { success: false, error: 'Perfil inválido' }

  const { client: admin, error: clientError } = getAdminClient()
  if (!admin) return { success: false, error: clientError! }

  // Verificar se e-mail já existe
  const { data: { users: allUsers } } = await admin.auth.admin.listUsers()
  const emailJaExiste = allUsers.some(u => u.email?.toLowerCase() === email)
  if (emailJaExiste) return { success: false, error: 'Este e-mail já está cadastrado no sistema.' }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://elopar-webapp.vercel.app'
  const { data, error } = await admin.auth.admin.inviteUserByEmail(email, {
    data: { full_name: fullName, role },
    redirectTo: `${appUrl}/update-password`,
  })

  if (error) return { success: false, error: error.message }

  if (data.user) {
    await admin
      .from('profiles')
      .upsert({ id: data.user.id, full_name: fullName, role, updated_at: new Date().toISOString() })
  }

  await logAudit({
    entidade: 'user',
    entidade_id: data.user?.id ?? email,
    acao: 'CREATE',
    dados_depois: { email, full_name: fullName, role },
  })

  // Notificar todos os admins sobre novo convite
  const { data: admins } = await admin.from('profiles').select('id').eq('role', 'admin')
  for (const a of admins ?? []) {
    await insertNotification({
      user_id: a.id,
      tipo: 'user_invited',
      mensagem: `Novo usuário convidado: ${fullName} (${email})`,
      link: '/area-usuario/gerenciar-usuarios',
    })
  }

  revalidatePath('/area-usuario/gerenciar-usuarios')
  return { success: true }
}

export async function deactivateUserAction(userId: string): Promise<ActionResult> {
  const adminId = await requireAdmin()
  if (!adminId) return { success: false, error: 'Acesso negado' }
  if (adminId === userId) return { success: false, error: 'Não é possível desativar o próprio usuário' }

  const { client: admin, error: clientError } = getAdminClient()
  if (!admin) return { success: false, error: clientError! }

  const { error } = await admin.auth.admin.updateUserById(userId, { ban_duration: '876600h' })
  if (error) return { success: false, error: error.message }

  await logAudit({
    entidade: 'user',
    entidade_id: userId,
    acao: 'UPDATE',
    dados_antes: { status: 'ativo' },
    dados_depois: { status: 'desativado' },
  })

  // Notificar todos os admins sobre desativação
  const { data: admins } = await admin.from('profiles').select('id').eq('role', 'admin')
  for (const a of admins ?? []) {
    await insertNotification({
      user_id: a.id,
      tipo: 'user_deactivated',
      mensagem: `Usuário ${userId} foi desativado.`,
      link: '/area-usuario/gerenciar-usuarios',
    })
  }

  revalidatePath('/area-usuario/gerenciar-usuarios')
  return { success: true }
}

export async function reactivateUserAction(userId: string): Promise<ActionResult> {
  const adminId = await requireAdmin()
  if (!adminId) return { success: false, error: 'Acesso negado' }

  const { client: admin, error: clientError } = getAdminClient()
  if (!admin) return { success: false, error: clientError! }

  const { error } = await admin.auth.admin.updateUserById(userId, { ban_duration: 'none' })
  if (error) return { success: false, error: error.message }

  await logAudit({
    entidade: 'user',
    entidade_id: userId,
    acao: 'UPDATE',
    dados_antes: { status: 'desativado' },
    dados_depois: { status: 'ativo' },
  })

  revalidatePath('/area-usuario/gerenciar-usuarios')
  return { success: true }
}

export async function resendInviteAction(email: string): Promise<ActionResult> {
  const adminId = await requireAdmin()
  if (!adminId) return { success: false, error: 'Acesso negado' }

  const { client: admin, error: clientError } = getAdminClient()
  if (!admin) return { success: false, error: clientError! }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://elopar-webapp.vercel.app'
  const { error } = await admin.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${appUrl}/update-password`,
  })
  if (error) return { success: false, error: error.message }

  await logAudit({
    entidade: 'user',
    entidade_id: email,
    acao: 'UPDATE',
    dados_depois: { acao: 'convite_reenviado', email },
  })

  revalidatePath('/area-usuario/gerenciar-usuarios')
  return { success: true }
}

export async function updateUserPermissionsAction(
  userId: string,
  role: string,
  permissions: UserPermissions
): Promise<ActionResult> {
  const adminId = await requireAdmin()
  if (!adminId) return { success: false, error: 'Acesso negado' }

  if (adminId === userId && role !== 'admin') {
    return { success: false, error: 'Não é possível remover seu próprio acesso admin' }
  }

  const validRoles = ['admin', 'manager', 'consulta']
  if (!validRoles.includes(role)) return { success: false, error: 'Perfil inválido' }

  const supabase = await createClient()
  const { error } = await supabase
    .from('profiles')
    .update({
      role,
      permissions: role === 'admin' ? {} : permissions,
      updated_at: new Date().toISOString(),
    } as never)
    .eq('id', userId)

  if (error) return { success: false, error: error.message }

  await logAudit({
    entidade: 'user',
    entidade_id: userId,
    acao: 'UPDATE',
    dados_depois: { role, permissions: role === 'admin' ? {} : permissions },
  })

  revalidatePath('/area-usuario/gerenciar-usuarios')
  return { success: true }
}

export async function deleteUserAction(userId: string): Promise<ActionResult> {
  const adminId = await requireAdmin()
  if (!adminId) return { success: false, error: 'Acesso negado' }
  if (adminId === userId) return { success: false, error: 'Não é possível excluir o próprio usuário' }

  const { client: admin, error: clientError } = getAdminClient()
  if (!admin) return { success: false, error: clientError! }

  const { error } = await admin.auth.admin.deleteUser(userId)
  if (error) return { success: false, error: error.message }

  await logAudit({
    entidade: 'user',
    entidade_id: userId,
    acao: 'DELETE',
    dados_antes: { id: userId },
  })

  // profiles é deletado automaticamente via CASCADE DELETE
  revalidatePath('/area-usuario/gerenciar-usuarios')
  return { success: true }
}
