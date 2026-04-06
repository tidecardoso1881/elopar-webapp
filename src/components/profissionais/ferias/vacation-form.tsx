'use client'

import { useActionState } from 'react'
import { type ActionResult } from '@/actions/vacations'
import { Database } from '@/lib/types/database'

type Vacation = Database['public']['Tables']['vacations']['Row']

interface VacationFormProps {
  action: (prevState: ActionResult, formData: FormData) => Promise<ActionResult>
  defaultValues?: Partial<Vacation>
  submitLabel?: string
  cancelHref?: string
}

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

function TextAreaField({
  label,
  name,
  defaultValue,
  placeholder,
}: {
  label: string
  name: string
  defaultValue?: string | null
  placeholder?: string
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className="block text-xs font-medium text-gray-600">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        defaultValue={defaultValue ?? ''}
        placeholder={placeholder}
        rows={3}
        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-colors resize-none"
      />
    </div>
  )
}

export function VacationForm({
  action,
  defaultValues,
  submitLabel = 'Salvar',
  cancelHref = '/ferias',
}: VacationFormProps) {
  const [state, formAction, isPending] = useActionState(action, {})

  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      {/* Identificação */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-5">Identificação</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <FormField
              label="Nome do Profissional"
              name="professional_name"
              required
              defaultValue={defaultValues?.professional_name}
              placeholder="Ex: João da Silva"
            />
          </div>
          <FormField
            label="Data de Admissão"
            name="admission_date"
            type="date"
            defaultValue={defaultValues?.admission_date}
          />
        </div>
      </div>

      {/* Período Aquisitivo */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-5">Período Aquisitivo</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Data de Início"
            name="acquisition_start"
            type="date"
            defaultValue={defaultValues?.acquisition_start}
          />
          <FormField
            label="Data de Fim"
            name="acquisition_end"
            type="date"
            defaultValue={defaultValues?.acquisition_end}
          />
        </div>
      </div>

      {/* Período de Gozo */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-5">Período de Gozo</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Data de Concessão Início"
            name="concession_start"
            type="date"
            defaultValue={defaultValues?.concession_start}
          />
          <FormField
            label="Data de Concessão Fim"
            name="concession_end"
            type="date"
            defaultValue={defaultValues?.concession_end}
          />
          <FormField
            label="Data de Férias Início"
            name="vacation_start"
            type="date"
            defaultValue={defaultValues?.vacation_start}
          />
          <FormField
            label="Data de Férias Fim"
            name="vacation_end"
            type="date"
            defaultValue={defaultValues?.vacation_end}
          />
        </div>
      </div>

      {/* Dados Complementares */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-5">Dados Complementares</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            label="Total de Dias"
            name="total_days"
            type="number"
            defaultValue={defaultValues?.total_days}
            placeholder="Ex: 30"
          />
          <FormField
            label="Dias Bônus"
            name="bonus_days"
            type="number"
            defaultValue={defaultValues?.bonus_days}
            placeholder="Ex: 5"
          />
          <FormField
            label="Saldo de Dias"
            name="days_balance"
            type="number"
            defaultValue={defaultValues?.days_balance}
            placeholder="Ex: 25"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <FormField
            label="Liderança"
            name="leadership"
            defaultValue={defaultValues?.leadership}
            placeholder="Ex: Gerente de Projetos"
          />
          <FormField
            label="Área / Cliente"
            name="client_area"
            defaultValue={defaultValues?.client_area}
            placeholder="Ex: E-commerce"
          />
        </div>
      </div>

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
