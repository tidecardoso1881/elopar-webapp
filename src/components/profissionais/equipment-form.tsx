'use client'

import { useActionState } from 'react'
import { type ActionResult } from '@/actions/equipment'
import { Database } from '@/lib/types/database'

type Equipment = Database['public']['Tables']['equipment']['Row']

interface EquipmentFormProps {
  action: (prevState: ActionResult, formData: FormData) => Promise<ActionResult>
  defaultValues?: Partial<Equipment>
  submitLabel?: string
  cancelHref?: string
}

const MACHINE_TYPE_OPTIONS = [
  { value: 'Notebook', label: 'Notebook' },
  { value: 'Desktop', label: 'Desktop' },
  { value: 'Tablet', label: 'Tablet' },
  { value: 'Celular', label: 'Celular' },
  { value: 'Outro', label: 'Outro' },
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

function CheckboxField({
  label,
  name,
  defaultValue,
}: {
  label: string
  name: string
  defaultValue?: boolean
}) {
  return (
    <div className="flex items-center gap-3">
      <input
        id={name}
        name={name}
        type="checkbox"
        defaultChecked={defaultValue}
        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-colors cursor-pointer"
      />
      <label htmlFor={name} className="text-sm font-medium text-gray-700 cursor-pointer">
        {label}
      </label>
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

export function EquipmentForm({
  action,
  defaultValues,
  submitLabel = 'Salvar',
  cancelHref = '/equipamentos',
}: EquipmentFormProps) {
  const [state, formAction, isPending] = useActionState(action, {})

  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

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
            label="Empresa"
            name="company"
            defaultValue={defaultValues?.company}
            placeholder="Ex: Acme Corp"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-5">Equipamento</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectField
            label="Tipo de Máquina"
            name="machine_type"
            defaultValue={defaultValues?.machine_type}
            placeholder="Selecione um tipo..."
            options={MACHINE_TYPE_OPTIONS}
          />
          <FormField
            label="Modelo da Máquina"
            name="machine_model"
            defaultValue={defaultValues?.machine_model}
            placeholder="Ex: MacBook Pro 14"
          />
          <div className="md:col-span-2">
            <CheckboxField
              label="Pacote Office instalado"
              name="office_package"
              defaultValue={defaultValues?.office_package ?? false}
            />
          </div>
          <div className="md:col-span-2">
            <TextAreaField
              label="Detalhes de Softwares"
              name="software_details"
              defaultValue={defaultValues?.software_details}
              placeholder="Ex: VS Code, Node.js 18, Docker..."
            />
          </div>
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
