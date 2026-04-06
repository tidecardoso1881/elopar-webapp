import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { formatDate } from '@/lib/utils/formatting'
import { EquipmentActions } from '@/components/profissionais/equipment-actions'

interface EquipmentDetailPageProps {
  params: Promise<{ id: string }>
}

function InfoField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</p>
      <p className="text-sm text-gray-900">{value || <span className="text-gray-400">—</span>}</p>
    </div>
  )
}

function SectionCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100">
        <span className="text-gray-400">{icon}</span>
        <h2 className="text-sm font-semibold text-gray-700">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

export default async function EquipmentDetailPage({ params }: EquipmentDetailPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: equipment, error } = await supabase
    .from('equipment')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !equipment) {
    notFound()
  }

  return (
    <div className="space-y-6 max-w-4xl">

      {/* Breadcrumb + Header */}
      <div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
          <Link href="/equipamentos" className="hover:text-gray-600 transition-colors">
            Equipamentos
          </Link>
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-600">{equipment.professional_name}</span>
        </div>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{equipment.professional_name}</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {equipment.company && (
                <>
                  <span>{equipment.company}</span>
                  {equipment.machine_type && <span className="mx-1.5 text-gray-300">·</span>}
                </>
              )}
              {equipment.machine_type && <span>{equipment.machine_type}</span>}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <EquipmentActions id={equipment.id} name={equipment.professional_name} />
            <Link
              href="/equipamentos"
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Voltar
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Coluna principal (2/3) */}
        <div className="lg:col-span-2 space-y-6">

          {/* Identificação */}
          <SectionCard
            title="Identificação"
            icon={
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          >
            <div className="grid grid-cols-2 gap-x-8 gap-y-5">
              <InfoField label="Profissional" value={equipment.professional_name} />
              <InfoField label="Empresa" value={equipment.company} />
            </div>
          </SectionCard>

          {/* Equipamento */}
          <SectionCard
            title="Equipamento"
            icon={
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" />
              </svg>
            }
          >
            <div className="grid grid-cols-2 gap-x-8 gap-y-5">
              <InfoField label="Tipo de Máquina" value={equipment.machine_type} />
              <InfoField label="Modelo" value={equipment.machine_model} />
              <div className="col-span-2">
                <InfoField
                  label="Pacote Office"
                  value={
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${equipment.office_package ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {equipment.office_package ? 'Sim' : 'Não'}
                    </span>
                  }
                />
              </div>
              {equipment.software_details && (
                <div className="col-span-2">
                  <InfoField label="Detalhes de Softwares" value={<div className="text-sm text-gray-700 whitespace-pre-wrap">{equipment.software_details}</div>} />
                </div>
              )}
            </div>
          </SectionCard>
        </div>

        {/* Coluna lateral (1/3) */}
        <div className="space-y-6">

          {/* Metadados */}
          <SectionCard
            title="Registro"
            icon={
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          >
            <div className="space-y-4">
              <InfoField label="ID" value={<span className="font-mono text-xs text-gray-500">{equipment.id}</span>} />
              <InfoField label="Criado em" value={formatDate(equipment.created_at)} />
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  )
}
