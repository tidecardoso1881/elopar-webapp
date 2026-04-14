'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import type { UserPermissions } from '@/types/permissions'

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

  revalidatePath('/area-usuario/gerenciar-usuarios')
  return { success: true }
}
