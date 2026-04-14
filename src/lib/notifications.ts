'use server'

import { createAdminClient } from '@/lib/supabase/admin'

export async function insertNotification({
  user_id,
  tipo,
  mensagem,
  link,
}: {
  user_id: string
  tipo: string
  mensagem: string
  link?: string
}) {
  try {
    const admin = createAdminClient()
    await admin.from('notifications').insert({ user_id, tipo, mensagem, link })
  } catch {
    // best-effort: não bloqueia a action principal
  }
}
