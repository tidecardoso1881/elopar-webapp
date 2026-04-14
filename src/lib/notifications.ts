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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (admin as any).from('notifications').insert({ user_id, tipo, mensagem, link })
  } catch {
    // best-effort: não bloqueia a action principal
  }
}
