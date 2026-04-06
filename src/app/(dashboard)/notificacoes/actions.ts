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
