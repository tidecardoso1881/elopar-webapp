'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type ActionResult = { success?: true; error?: string }

export async function updateProfile(data: {
  full_name: string
}): Promise<ActionResult> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autorizado.' }

  const { error } = await supabase
    .from('profiles')
    .update({ full_name: data.full_name.trim() })
    .eq('id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/area-usuario/perfil')
  revalidatePath('/', 'layout')
  return { success: true }
}

export async function uploadAvatar(formData: FormData): Promise<ActionResult & { avatarUrl?: string }> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autorizado.' }

  const file = formData.get('avatar') as File | null
  if (!file || file.size === 0) return { error: 'Nenhum arquivo selecionado.' }
  if (!file.type.startsWith('image/')) return { error: 'Apenas imagens são permitidas.' }
  if (file.size > 2 * 1024 * 1024) return { error: 'Imagem deve ter no máximo 2MB.' }

  const ext = file.name.split('.').pop() ?? 'jpg'
  const path = `${user.id}/avatar.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(path, file, { upsert: true, contentType: file.type })

  if (uploadError) return { error: uploadError.message }

  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(path)

  // TODO: avatar_url será atualizado quando coluna for criada no schema
  // const { error: updateError } = await supabase
  //   .from('profiles')
  //   .update({ avatar_url: publicUrl })
  //   .eq('id', user.id)

  revalidatePath('/area-usuario/perfil')
  revalidatePath('/', 'layout')
  return { success: true, avatarUrl: publicUrl }
}
