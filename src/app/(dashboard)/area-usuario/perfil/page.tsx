import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ProfileForm } from '@/components/user/profile-form'

export default async function PerfilPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role')
    .eq('id', user.id)
    .single()

  return (
    <div className="max-w-lg mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Meu Perfil</h1>
        <p className="text-sm text-gray-500 mt-1">Atualize seus dados pessoais.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {/* Avatar placeholder */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
          <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
            <span className="text-2xl font-semibold text-indigo-700">
              {(profile?.full_name ?? user.email ?? 'U').charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{profile?.full_name ?? '—'}</p>
            <p className="text-xs text-gray-500 capitalize">{profile?.role ?? 'usuário'}</p>
          </div>
        </div>

        <ProfileForm
          initialName={profile?.full_name ?? ''}
          email={user.email ?? ''}
        />
      </div>
    </div>
  )
}
