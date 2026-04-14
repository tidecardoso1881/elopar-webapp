'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function markAsRead(id: string) {
  const supabase = await createClient()
  await supabase
    .from('contract_notifications')
    .update({ read_at: new Date().toISOString() })
    .eq('id', id)
  revalidatePath('/notificacoes')
}

export async function markAllAsRead() {
  const supabase = await createClient()
  await supabase
    .from('contract_notifications')
    .update({ read_at: new Date().toISOString() })
    .is('read_at', null)
  revalidatePath('/notificacoes')
}

export async function markSistemaAsRead() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  await supabase
    .from('notifications')
    .update({ lida: true })
    .eq('user_id', user.id)
    .eq('lida', false)
  revalidatePath('/notificacoes')
}
