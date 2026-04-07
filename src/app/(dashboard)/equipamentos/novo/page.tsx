import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { canWrite } from '@/types/roles'
import { EquipmentForm } from '@/components/profissionais/equipment-form'
import { createEquipment } from '@/actions/equipment'

export default async function NovoEquipamentoPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!canWrite(profile?.role)) redirect('/equipamentos')
  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
          <Link href="/equipamentos" className="hover:text-gray-600 transition-colors">
            Equipamentos
          </Link>
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-600">Novo Equipamento</span>
        </div>
        <h1 className="text-2xl font-semibold text-gray-900">Novo Equipamento</h1>
        <p className="text-sm text-gray-500 mt-0.5">Preencha os dados para cadastrar um novo equipamento.</p>
      </div>

      <EquipmentForm
        action={createEquipment}
        submitLabel="Criar Equipamento"
        cancelHref="/equipamentos"
      />
    </div>
  )
}
