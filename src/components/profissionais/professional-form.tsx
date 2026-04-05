'use client'

import { useActionState } from 'react'
import { type ActionResult } from '@/actions/professionals'
import { Database } from '@/lib/types/database'

type Professional = Database['public']['Tables']['professionals']['Row']
type Client = Database['public']['Tables']['clients']['Row']

interface ProfessionalFormProps {
  action: (prevState: ActionResult, formData: FormData) => Promise<ActionResult>
  clients: Pick<Client, 'id' | 'name'>[]
  defaultValues?: Partial<Professional>
  submitLabel?: string
  cancelHref?: string
}

const SENIORITY_OPTIONS = [
  { value: 'JUNIOR', label: 'Júnior' },
  { value: 'PLENO', label: 'Pleno' },
  { value: 'SENIOR', label: 'Sênior' },
  { value: 'ESPECIALISTA', label: 'Especialista' },
]

const CONTRACT_OPTIONS = [
  { value: 'PJ', label: 'PJ' },
  { value: 'CLT_ESTRATEGICO', label: 'CLT Estratégico' },
  { value: 'CLT_ILATI', label: 'CLT ILATI' },
]

const STATUS_OPTIONS = [
  { value: 'ATIVO', label: 'Ativo' },
  { value: 'DESLIGADO', label: 'Desligado' },
]

function FormField({
  label,
  name,
  type = 'text',
  defaultValue,
  required,
  placeholder,
  children,
}: {
  label: string
  name: string
  type?: string
  defaultValue?: string | number | null
  required?: boolean
  placeholder?: string
  children?: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className="block text-xs font-medium text-gray-600">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children ?? (
        <input
          id={name}
          name={name}
          type={type}
          defaultValue={defaultValue ?? ''}
          required={required}
          placeholder={placeholder}
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-colors"
        />
      )}
    </div>
  )
}

function SelectField({
  label,
  name,
  defaultValue,
  required,
  options,
  placeholder,
}: {
  label: string
  name: string
  defaultValue?: string | null
  required?: boolean
  options: { value: string; label: string }[]
  placeholder?: string
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className="block text-xs font-medium text-gray-600">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        id={name}
        name={name}
        defaultValue={defaultValue ?? ''}
        required={required}
        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-colors"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="col-span-2 pt-2">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2">
        {title}
      </h3>
    </div>
  )
}

export function ProfessionalForm({
  action,
  clients,
  defaultValues,
  submitLabel = 'Salvar',
  cancelHref = '/profissionais',
}: ProfessionalFormProps) {
  const [state, formAction, isPending] = useActionState(action, {})

  return (
    <form action={formAction} className="space-y-6">
      {/* Erro global */}
      {state.error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      {/* ── Identificação ── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-5">Identificação</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Nome completo"
            name="name"
            required
            defaultValue={defaultValues?.name}
            placeholder="Ex: João da Silva"
          />
          <FormField
            label="OS (número)"
            name="os"
            type="number"
            defaultValue={defaultValues?.os ?? ''}
            placeholder="Ex: 1234"
          />
          <FormField
            label="E-mail"
            name="email"
            type="email"
            defaultValue={defaultValues?.email}
            placeholder="joao@empresa.com"
          />
          <FormField
            label="Telefone / WhatsApp"
            name="contact"
            defaultValue={defaultValues?.contact}
            placeholder="(11) 99999-9999"
          />
          <FormField
            label="Gestor"
            name="manager"
            defaultValue={defaultValues?.manager}
            placeholder="Nome do gestor"
          />
          <FormField
            label="Perfil / Área"
            name="profile"
            defaultValue={defaultValues?.profile}
            placeholder="Ex: Backend, Produto..."
          />
        </div>
      </div>

      {/* ── Contrato ── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-5">Contrato</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectField
            label="Cliente"
            name="client_id"
            required
            defaultValue={defaultValues?.client_id}
            placeholder="Selecione um cliente..."
            options={clients.map((c) => ({ value: c.id, label: c.name }))}
          />
          <FormField
            label="Cargo"
            name="position"
            defaultValue={defaultValues?.position}
            placeholder="Ex: Analista de Sistemas"
          />
          <SelectField
            label="Senioridade"
            name="seniority"
            defaultValue={defaultValues?.seniority}
            placeholder="Selecione..."
            options={SENIORITY_OPTIONS}
          />
          <SelectField
            label="Tipo de Contrato"
            name="contract_type"
            defaultValue={defaultValues?.contract_type}
            placeholder="Selecione..."
            options={CONTRACT_OPTIONS}
          />
          <SelectField
            label="Status"
            name="status"
            required
            defaultValue={defaultValues?.status ?? 'ATIVO'}
            options={STATUS_OPTIONS}
          />

          <SectionHeader title="Datas" />

          <FormField
            label="Data Início"
            name="date_start"
            type="date"
            defaultValue={defaultValues?.date_start?.substring(0, 10)}
          />
          <FormField
            label="Data Fim"
            name="date_end"
            type="date"
            defaultValue={defaultValues?.date_end?.substring(0, 10)}
          />
          <FormField
            label="Início Contrato"
            name="contract_start"
            type="date"
            defaultValue={defaultValues?.contract_start?.substring(0, 10)}
          />
          <FormField
            label="Fim Contrato"
            name="contract_end"
            type="date"
            defaultValue={defaultValues?.contract_end?.substring(0, 10)}
          />
          <FormField
            label="Prazo de Renovação"
            name="renewal_deadline"
            type="date"
            defaultValue={defaultValues?.renewal_deadline?.substring(0, 10)}
          />
        </div>
      </div>

      {/* ── Financeiro ── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-5">Dados Financeiros</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Taxa Hora (R$)"
            name="hourly_rate"
            type="number"
            defaultValue={defaultValues?.hourly_rate ?? ''}
            placeholder="0.00"
          />
          <FormField
            label="Valor CLT (R$)"
            name="value_clt"
            type="number"
            defaultValue={defaultValues?.value_clt || ''}
            placeholder="0.00"
          />
          <FormField
            label="Valor Estratégico (R$)"
            name="value_strategic"
            type="number"
            defaultValue={defaultValues?.value_strategic || ''}
            placeholder="0.00"
          />
          <FormField
            label="Horas Trabalhadas"
            name="hours_worked"
            type="number"
            defaultValue={defaultValues?.hours_worked || ''}
            placeholder="0"
          />
          <FormField
            label="Valor Pagamento (R$)"
            name="payment_value"
            type="number"
            defaultValue={defaultValues?.payment_value || ''}
            placeholder="0.00"
          />
          <FormField
            label="Outros Valores (R$)"
            name="other_values"
            type="number"
            defaultValue={defaultValues?.other_values || ''}
            placeholder="0.00"
          />
          <FormField
            label="Taxa de Cobrança (R$)"
            name="billing_rate"
            type="number"
            defaultValue={defaultValues?.billing_rate || ''}
            placeholder="0.00"
          />
          <FormField
            label="Cobrança Renovação (R$)"
            name="renewal_billing"
            type="number"
            defaultValue={defaultValues?.renewal_billing || ''}
            placeholder="0.00"
          />
          <FormField
            label="Total Faturamento (R$)"
            name="total_billing"
            type="number"
            defaultValue={defaultValues?.total_billing || ''}
            placeholder="0.00"
          />
        </div>
      </div>

      {/* ── Ações ── */}
      <div className="flex items-center justify-end gap-3">
        <a
          href={cancelHref}
          className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </a>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {isPending ? (
            <>
              <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Salvando...
            </>
          ) : (
            submitLabel
          )}
        </button>
      </div>
    </form>
  )
}
