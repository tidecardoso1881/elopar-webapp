import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ProfileForm } from '@/components/user/profile-form'
import { AvatarUpload } from '@/components/user/avatar-upload'

export default async function PerfilPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role')
    .eq('id', user.id)
    .single()

  // TODO: avatar_url será adicionado quando coluna for criada no schema

  return (
    <div className="max-w-lg mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Meu Perfil</h1>
        <p className="text-sm text-gray-500 mt-1">Atualize seus dados pessoais.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <AvatarUpload
          currentUrl={null}
          initials={(profile?.full_name ?? user.email ?? 'U').charAt(0).toUpperCase()}
        />

        <ProfileForm
          initialName={profile?.full_name ?? ''}
          email={user.email ?? ''}
        />
      </div>
    </div>
  )
}
