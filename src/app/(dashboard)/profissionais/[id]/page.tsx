import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'
import { formatDate, formatCurrency, getRenewalStatus, daysUntil } from '@/lib/utils/formatting'
import { ProfessionalActions } from '@/components/profissionais/professional-actions'
import { ProfessionalHistorico } from '@/components/profissionais/ProfessionalHistorico'
import { ProfessionalNotes } from '@/components/profissionais/ProfessionalNotes'
import type { Metadata } from 'next'

interface ProfissionalDetailPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: ProfissionalDetailPageProps): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('professionals').select('name').eq('id', id).single()
  return {
    title: data?.name ? `${data.name} — Elopar` : 'Profissional — Elopar',
  }
}

const STATUS_STYLES: Record<string, string> = {
  ATIVO: 'bg-green-100 text-green-700',
  DESLIGADO: 'bg-gray-100 text-gray-500',
}

const RENEWAL_STYLES: Record<string, { bg: string; label: string }> = {
  expired:   { bg: 'bg-red-100 text-red-700',       label: 'Vencido' },
  critical:  { bg: 'bg-red-50 text-red-600',        label: 'Crítico (≤30d)' },
  warning:   { bg: 'bg-orange-100 text-orange-700', label: 'Atenção (≤60d)' },
  attention: { bg: 'bg-yellow-100 text-yellow-700', label: 'Próximo (≤90d)' },
  ok:        { bg: 'bg-green-50 text-green-600',    label: 'OK' },
  none:      { bg: 'bg-gray-100 text-gray-400',     label: '—' },
  invalid:   { bg: 'bg-gray-100 text-gray-400',     label: 'Data não informada' },
}

const CONTRACT_LABELS: Record<string, string> = {
  CLT_ESTRATEGICO: 'CLT Estratégico',
  CLT_ILATI: 'CLT ILATI',
  PJ: 'PJ',
}

const SENIORITY_LABELS: Record<string, string> = {
  JUNIOR: 'Júnior',
  PLENO: 'Pleno',
  SENIOR: 'Sênior',
  ESPECIALISTA: 'Especialista',
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

export default async function ProfissionalDetailPage({ params }: ProfissionalDetailPageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Busca profissional com cliente
  const { data: professional, error } = await supabase
    .from('professionals')
    .select('*, client:clients(id, name)')
    .eq('id', id)
    .single()

  if (error || !professional) {
    notFound()
  }

  // Busca equipamento pelo nome (FK por nome no schema atual)
  const { data: equipment } = await supabase
    .from('equipment')
    .select('*')
    .eq('professional_name', professional.name)
    .maybeSingle()

  // Busca férias pelo nome
  const { data: vacations } = await supabase
    .from('vacations')
    .select('*')
    .eq('professional_name', professional.name)
    .order('vacation_start', { ascending: false })

  // Busca usuário atual e perfil para controle de permissões
  const { data: { user } } = await supabase.auth.getUser()
  const { data: currentProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user?.id ?? '')
    .single()
  const currentUserId = user?.id ?? ''
  const currentRole = currentProfile?.role ?? 'consulta'

  // Busca notas internas (apenas gerente/admin via RLS)
  type NoteRow = {
    id: string
    content: string
    created_at: string
    updated_at: string
    author_id: string
    author: { full_name: string | null } | null
  }
  const canReadNotes = currentRole === 'admin' || currentRole === 'gerente'
  let notes: NoteRow[] = []
  if (canReadNotes) {
    const { data: notesData } = await supabase
      .from('professional_notes')
      .select('id, content, created_at, updated_at, author_id, author:profiles(full_name)')
      .eq('professional_id', professional.id)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
    notes = (notesData ?? []) as NoteRow[]
  }

  const renewalStatus = getRenewalStatus(professional.renewal_deadline)
  const renewalStyle = RENEWAL_STYLES[renewalStatus]
  const daysLeft = daysUntil(professional.renewal_deadline)

  return (
    <div className="space-y-6 max-w-5xl">

      {/* Breadcrumb + Header */}
      <div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
          <Link href="/profissionais" className="hover:text-gray-600 transition-colors">
            Profissionais
          </Link>
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-600">{professional.name}</span>
        </div>

        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="flex-shrink-0 h-14 w-14 rounded-full bg-indigo-100 flex items-center justify-center">
              <span className="text-xl font-semibold text-indigo-600">
                {professional.name.charAt(0).toUpperCase()}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-semibold text-gray-900">{professional.name}</h1>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[professional.status] ?? 'bg-gray-100 text-gray-500'}`}>
                  {professional.status}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-0.5">
                {professional.position ?? '—'}
                {professional.seniority && (
                  <span className="mx-1.5 text-gray-300">·</span>
                )}
                {professional.seniority ? (SENIORITY_LABELS[professional.seniority] ?? professional.seniority) : null}
                {professional.client && (
                  <>
                    <span className="mx-1.5 text-gray-300">·</span>
                    <Link
                      href={`/clientes/${professional.client.id}`}
                      className="text-indigo-600 hover:text-indigo-700 transition-colors"
                    >
                      {professional.client.name}
                    </Link>
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ProfessionalActions
              id={professional.id}
              name={professional.name}
              status={professional.status}
              canEdit={currentRole === 'admin' || currentRole === 'gerente'}
              isAdmin={currentRole === 'admin'}
            />
            <Link
              href="/profissionais"
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

      {/* Alerta de renovação */}
      {(renewalStatus === 'expired' || renewalStatus === 'critical' || renewalStatus === 'warning') && (
        <div className={`rounded-xl border px-4 py-3 flex items-start gap-3 ${
          renewalStatus === 'expired' ? 'bg-red-50 border-red-200' :
          renewalStatus === 'critical' ? 'bg-red-50 border-red-200' :
          'bg-orange-50 border-orange-200'
        }`}>
          <svg className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
            renewalStatus === 'expired' || renewalStatus === 'critical' ? 'text-red-500' : 'text-orange-500'
          }`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <div>
            <p className={`text-sm font-medium ${
              renewalStatus === 'expired' || renewalStatus === 'critical' ? 'text-red-700' : 'text-orange-700'
            }`}>
              {renewalStatus === 'expired'
                ? `Renovação vencida há ${Math.abs(daysLeft ?? 0)} dia${Math.abs(daysLeft ?? 0) !== 1 ? 's' : ''}`
                : `Renovação em ${daysLeft} dia${daysLeft !== 1 ? 's' : ''} — ${formatDate(professional.renewal_deadline)}`
              }
            </p>
            <p className={`text-xs mt-0.5 ${
              renewalStatus === 'expired' || renewalStatus === 'critical' ? 'text-red-500' : 'text-orange-500'
            }`}>
              Ação recomendada: verificar renovação de contrato com o gestor responsável.
            </p>
          </div>
        </div>
      )}

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
            {!equipment ? (
              <p className="text-sm text-gray-400 text-center py-3">Nenhum equipamento vinculado.</p>
            ) : (
              <div className="space-y-4">
                <InfoField label="Empresa" value={equipment.company} />
                <InfoField label="Modelo" value={equipment.machine_model} />
                <InfoField label="Tipo" value={equipment.machine_type} />
                <InfoField
                  label="Pacote Office"
                  value={
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${equipment.office_package ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {equipment.office_package ? 'Sim' : 'Não'}
                    </span>
                  }
                />
                {equipment.software_details && (
                  <InfoField label="Softwares" value={equipment.software_details} />
                )}
              </div>
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

      {/* Notas Internas (apenas gerente/admin) */}
      {canReadNotes && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100">
            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            <h2 className="text-sm font-semibold text-gray-700">Notas Internas</h2>
            <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">Visível apenas para gerentes e admins</span>
          </div>
          <div className="p-5">
            <ProfessionalNotes
              professionalId={professional.id}
              initialNotes={notes}
              currentUserId={currentUserId}
              currentRole={currentRole}
            />
          </div>
        </div>
      )}

      {/* Histórico de Alterações */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100">
          <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-sm font-semibold text-gray-700">Histórico de Alterações</h2>
        </div>
        <div className="p-5">
          <Suspense fallback={<p className="text-sm text-gray-400 text-center py-6">Carregando histórico...</p>}>
            <ProfessionalHistorico profissionalId={professional.id} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
