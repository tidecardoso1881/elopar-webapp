'use client'

import { useState, useRef, useEffect } from 'react'
import { useActionState } from 'react'
import { type ActionResult } from '@/actions/equipment'
import { Database } from '@/lib/types/database'

type EquipmentRow = Database['public']['Tables']['equipment']['Row']
// professional_id será adicionado via migration — extendido aqui até tipos serem regenerados
type Equipment = EquipmentRow & { professional_id?: string | null }

interface ProfOption {
  id: string
  name: string
  clientName: string
}

interface EquipmentFormProps {
  action: (prevState: ActionResult, formData: FormData) => Promise<ActionResult>
  defaultValues?: Partial<Equipment>
  professionals: ProfOption[]
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

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(n => n[0].toUpperCase())
    .join('')
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

function ProfessionalAutocomplete({
  professionals,
  defaultProfessionalId,
  defaultProfessionalName,
}: {
  professionals: ProfOption[]
  defaultProfessionalId?: string | null
  defaultProfessionalName?: string | null
}) {
  const [selected, setSelected] = useState<ProfOption | null>(() => {
    if (defaultProfessionalId) {
      return professionals.find(p => p.id === defaultProfessionalId) ?? null
    }
    return null
  })
  const [query, setQuery] = useState(
    !defaultProfessionalId && defaultProfessionalName ? defaultProfessionalName : ''
  )
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const isOldRecord = !defaultProfessionalId && !!defaultProfessionalName

  const filtered = query.trim()
    ? professionals.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.clientName.toLowerCase().includes(query.toLowerCase())
      )
    : professionals

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className="md:col-span-2 space-y-4">
      {/* Aviso para registros antigos sem FK */}
      {isOldRecord && !selected && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 flex items-start gap-2.5">
          <svg className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <p className="text-xs text-yellow-800">
            Este registro não tem profissional vinculado. Selecione um profissional na lista abaixo para associar corretamente.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Campo Profissional */}
        <div className="space-y-1.5" ref={containerRef}>
          <label className="block text-xs font-medium text-gray-600">
            Nome do Profissional <span className="text-red-500">*</span>
          </label>

          {selected ? (
            /* Badge selecionado */
            <div className="flex items-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2">
              <span className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-indigo-600 text-white text-xs font-bold">
                {getInitials(selected.name)}
              </span>
              <span className="flex-1 text-sm font-medium text-indigo-900 truncate">{selected.name}</span>
              <button
                type="button"
                onClick={() => { setSelected(null); setQuery('') }}
                className="text-xs text-indigo-600 hover:text-indigo-800 flex-shrink-0 transition-colors"
              >
                Trocar
              </button>
              <input type="hidden" name="professional_id" value={selected.id} />
              <input type="hidden" name="professional_name" value={selected.name} />
              <input type="hidden" name="company" value={selected.clientName} />
            </div>
          ) : (
            /* Input de busca */
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
              <input
                type="text"
                value={query}
                onChange={e => { setQuery(e.target.value); setOpen(true) }}
                onFocus={() => setOpen(true)}
                placeholder="Buscar profissional..."
                className="w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-colors"
              />
              {open && filtered.length > 0 && (
                <ul className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg max-h-56 overflow-auto">
                  {filtered.map(p => (
                    <li key={p.id}>
                      <button
                        type="button"
                        onMouseDown={() => { setSelected(p); setOpen(false); setQuery('') }}
                        className="flex items-center gap-2.5 w-full px-3 py-2.5 text-left hover:bg-indigo-50 transition-colors"
                      >
                        <span className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-indigo-600 text-white text-xs font-bold">
                          {getInitials(p.name)}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                          {p.clientName && (
                            <p className="text-xs text-gray-500 truncate">{p.clientName}</p>
                          )}
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {open && filtered.length === 0 && query.trim() && (
                <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg px-3 py-3 text-sm text-gray-400 text-center">
                  Nenhum profissional encontrado
                </div>
              )}
            </div>
          )}
        </div>

        {/* Campo Cliente (read-only) */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-gray-600">Cliente</label>
          <input
            type="text"
            value={selected?.clientName ?? ''}
            readOnly
            placeholder="Preenchido ao selecionar o profissional"
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 cursor-not-allowed"
          />
        </div>
      </div>
    </div>
  )
}

export function EquipmentForm({
  action,
  defaultValues,
  professionals,
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
          <ProfessionalAutocomplete
            professionals={professionals}
            defaultProfessionalId={defaultValues?.professional_id}
            defaultProfessionalName={defaultValues?.professional_name}
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
          <div className="space-y-1.5">
            <label htmlFor="machine_model" className="block text-xs font-medium text-gray-600">
              Modelo da Máquina
            </label>
            <input
              id="machine_model"
              name="machine_model"
              type="text"
              defaultValue={defaultValues?.machine_model ?? ''}
              placeholder="Ex: MacBook Pro 14"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-colors"
            />
          </div>
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
