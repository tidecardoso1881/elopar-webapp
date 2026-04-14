import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'
import { formatDate, getRenewalStatus, daysUntil } from '@/lib/utils/formatting'
import { ProfessionalActions } from '@/components/profissionais/professional-actions'
import { ProfessionalTabs } from '@/components/profissionais/professional-tabs'
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

const SENIORITY_LABELS: Record<string, string> = {
  JUNIOR: 'Júnior',
  PLENO: 'Pleno',
  SENIOR: 'Sênior',
  ESPECIALISTA: 'Especialista',
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

  // Busca equipamentos via professional_id (FK adicionada via migration)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: equipmentList } = await (supabase.from('equipment') as any)
    .select('id, machine_type, machine_model, office_package, software_details, company')
    .eq('professional_id', professional.id)
    .order('created_at', { ascending: false })

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

      {/* eslint-disable @typescript-eslint/no-explicit-any */}
      <ProfessionalTabs
        professional={professional as unknown as any}
        equipment={(equipmentList ?? []) as unknown as any}
        vacations={(vacations ?? []) as unknown as any}
        notes={notes}
        canReadNotes={canReadNotes}
        currentUserId={currentUserId}
        currentRole={currentRole}
        renewalStyle={renewalStyle}
        daysLeft={daysLeft}
        historicoComponent={<ProfessionalHistorico profissionalId={professional.id} />}
        notesComponent={
          <ProfessionalNotes
            professionalId={professional.id}
            initialNotes={notes}
            currentUserId={currentUserId}
            currentRole={currentRole}
          />
        }
      />
    </div>
  )
}
