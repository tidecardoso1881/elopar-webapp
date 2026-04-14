'use client'

import { useState, Suspense } from 'react'
import { formatDate, formatCurrency } from '@/lib/utils/formatting'

interface Professional {
  id: string
  name: string
  status: string
  position?: string | null
  seniority?: string | null
  client?: { id: string; name: string } | null
  os?: string | null
  profile?: string | null
  date_start?: string | null
  date_end?: string | null
  contract_start?: string | null
  contract_end?: string | null
  renewal_deadline?: string | null
  hourly_rate?: number | null
  value_clt?: number | null
  value_strategic?: number | null
  hours_worked?: number | null
  payment_value?: number | null
  other_values?: number | null
  billing_rate?: number | null
  renewal_billing?: number | null
  total_billing?: number | null
  email?: string | null
  contact?: string | null
  manager?: string | null
  created_at: string
  updated_at: string
  contract_type?: string | null
}

interface Equipment {
  id: string
  company?: string | null
  machine_model?: string | null
  machine_type?: string | null
  office_package: boolean | null
  software_details?: string | null
}

type EquipmentList = Equipment[]

interface Vacation {
  id: string
  acquisition_start: string | null
  acquisition_end: string | null
  vacation_start: string | null
  vacation_end: string | null
  total_days: number | null
  bonus_days: number | null
}

interface Note {
  id: string
  content: string
  created_at: string
  updated_at: string
  author_id: string
  author: { full_name: string | null } | null
}

interface ProfessionalTabsProps {
  professional: Professional
  equipment: EquipmentList
  vacations: Vacation[]
  notes: Note[]
  canReadNotes: boolean
  currentUserId: string
  currentRole: string
  renewalStyle: { bg: string; label: string }
  daysLeft: number | null
  historicoComponent: React.ReactNode
  notesComponent: React.ReactNode
}

const SENIORITY_LABELS: Record<string, string> = {
  JUNIOR: 'Júnior',
  PLENO: 'Pleno',
  SENIOR: 'Sênior',
  ESPECIALISTA: 'Especialista',
}

const CONTRACT_LABELS: Record<string, string> = {
  CLT_ESTRATEGICO: 'CLT Estratégico',
  CLT_ILATI: 'CLT ILATI',
  PJ: 'PJ',
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

function DadosTab({
  professional,
  equipment,
  vacations,
  currentRole,
  renewalStyle,
}: {
  professional: Professional
  equipment: EquipmentList
  vacations: Vacation[]
  currentRole: string
  renewalStyle: { bg: string; label: string }
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna principal (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Dados do Contrato */}
          <SectionCard
            title="Dados do Contrato"
            icon={
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
              </svg>
            }
          >
            <div className="grid grid-cols-2 gap-x-8 gap-y-5">
              <InfoField label="OS" value={professional.os ?? '—'} />
              <InfoField label="Cliente" value={professional.client?.name} />
              <InfoField label="Cargo" value={professional.position} />
              <InfoField label="Senioridade" value={professional.seniority ? (SENIORITY_LABELS[professional.seniority] ?? professional.seniority) : null} />
              <InfoField
                label="Tipo de Contrato"
                value={professional.contract_type ? (CONTRACT_LABELS[professional.contract_type] ?? professional.contract_type) : null}
              />
              <InfoField label="Perfil / Área" value={professional.profile} />
              <InfoField label="Data Início" value={formatDate(professional.date_start)} />
              <InfoField label="Data Fim" value={formatDate(professional.date_end)} />
              <InfoField label="Início Contrato" value={formatDate(professional.contract_start)} />
              <InfoField label="Fim Contrato" value={formatDate(professional.contract_end)} />
              <div className="col-span-2">
                <InfoField
                  label="Renovação"
                  value={
                    <span className="flex items-center gap-2">
                      {formatDate(professional.renewal_deadline)}
                      {professional.renewal_deadline && (
                        <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium ${renewalStyle.bg}`}>
                          {renewalStyle.label}
                        </span>
                      )}
                    </span>
                  }
                />
              </div>
            </div>
          </SectionCard>

          {/* Dados Financeiros */}
          <SectionCard
            title="Dados Financeiros"
            icon={
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          >
            <div className="grid grid-cols-2 gap-x-8 gap-y-5">
              <InfoField label="Taxa Hora" value={formatCurrency(professional.hourly_rate)} />
              <InfoField label="Valor CLT" value={formatCurrency(professional.value_clt)} />
              <InfoField label="Valor Estratégico" value={formatCurrency(professional.value_strategic)} />
              <InfoField label="Horas Trabalhadas" value={professional.hours_worked ? `${professional.hours_worked}h` : null} />
              <InfoField label="Valor Pagamento" value={formatCurrency(professional.payment_value)} />
              <InfoField label="Outros Valores" value={formatCurrency(professional.other_values)} />
              <InfoField label="Taxa de Cobrança" value={formatCurrency(professional.billing_rate)} />
              <InfoField label="Cobrança Renovação" value={formatCurrency(professional.renewal_billing)} />
              <div className="col-span-2 pt-2 border-t border-gray-100">
                <InfoField
                  label="Total Faturamento"
                  value={
                    <span className="text-base font-semibold text-gray-900">
                      {formatCurrency(professional.total_billing)}
                    </span>
                  }
                />
              </div>
            </div>
          </SectionCard>

          {/* Férias */}
          <SectionCard
            title="Férias"
            icon={
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
            }
          >
            {!vacations || vacations.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">Nenhum registro de férias encontrado.</p>
            ) : (
              <div className="overflow-x-auto -mx-5">
                <table className="min-w-full divide-y divide-gray-100">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-5 py-2.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Aquisição</th>
                      <th className="px-5 py-2.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Início</th>
                      <th className="px-5 py-2.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Fim</th>
                      <th className="px-5 py-2.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Dias</th>
                      <th className="px-5 py-2.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Abono</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {vacations.map((v) => (
                      <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3 text-sm text-gray-600">
                          {formatDate(v.acquisition_start)} — {formatDate(v.acquisition_end)}
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-600">{formatDate(v.vacation_start)}</td>
                        <td className="px-5 py-3 text-sm text-gray-600">{formatDate(v.vacation_end)}</td>
                        <td className="px-5 py-3 text-sm text-gray-900 font-medium">{v.total_days}d</td>
                        <td className="px-5 py-3 text-sm text-gray-600">{v.bonus_days}d</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </SectionCard>
        </div>

        {/* Coluna lateral (1/3) */}
        <div className="space-y-6">
          {/* Contato */}
          <SectionCard
            title="Contato"
            icon={
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            }
          >
            <div className="space-y-4">
              <InfoField
                label="E-mail"
                value={
                  professional.email ? (
                    <a href={`mailto:${professional.email}`} className="text-indigo-600 hover:text-indigo-700 transition-colors break-all">
                      {professional.email}
                    </a>
                  ) : null
                }
              />
              <InfoField label="Telefone / WhatsApp" value={professional.contact} />
              <InfoField label="Gestor" value={professional.manager} />
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
            {equipment.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-3">Nenhum equipamento vinculado.</p>
            ) : (
              <ul className="divide-y divide-gray-100 -mx-5">
                {equipment.map(eq => (
                  <li key={eq.id} className="px-5 py-3 hover:bg-gray-50 transition-colors">
                    <a href={`/equipamentos/${eq.id}`} className="flex items-center justify-between gap-3 group">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-indigo-600 group-hover:text-indigo-800 truncate">
                          {eq.machine_model ?? '—'} · {eq.machine_type ?? '—'}
                        </p>
                        {eq.company && (
                          <p className="text-xs text-gray-500 truncate">{eq.company}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {eq.office_package && (
                          <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700">
                            Office
                          </span>
                        )}
                        <svg className="h-4 w-4 text-gray-400 group-hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>

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
              <InfoField label="ID" value={<span className="font-mono text-xs text-gray-500">{professional.id}</span>} />
              <InfoField label="Criado em" value={formatDate(professional.created_at)} />
              <InfoField label="Atualizado em" value={formatDate(professional.updated_at)} />
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  )
}

export function ProfessionalTabs({
  professional,
  equipment,
  vacations,
  notes,
  canReadNotes,
  currentUserId,
  currentRole,
  renewalStyle,
  daysLeft,
  historicoComponent,
  notesComponent,
}: ProfessionalTabsProps) {
  const [activeTab, setActiveTab] = useState<'dados' | 'historico' | 'notas'>('dados')

  return (
    <div className="space-y-6">
      {/* TabBar */}
      <div className="flex border-b border-gray-200 gap-0">
        {(['dados', 'historico'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors capitalize ${
              activeTab === tab
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab === 'dados' ? 'Dados' : 'Histórico'}
          </button>
        ))}
        {canReadNotes && (
          <button
            onClick={() => setActiveTab('notas')}
            className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'notas'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Notas
            {notes.length > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">
                {notes.length}
              </span>
            )}
          </button>
        )}
      </div>

      {/* Aba Dados */}
      {activeTab === 'dados' && (
        <DadosTab
          professional={professional}
          equipment={equipment}
          vacations={vacations}
          currentRole={currentRole}
          renewalStyle={renewalStyle}
        />
      )}

      {/* Aba Histórico */}
      {activeTab === 'historico' && (
        <Suspense fallback={<p className="text-sm text-gray-400 text-center py-6">Carregando histórico...</p>}>
          {historicoComponent}
        </Suspense>
      )}

      {/* Aba Notas */}
      {canReadNotes && activeTab === 'notas' && (
        notesComponent
      )}
    </div>
  )
}
