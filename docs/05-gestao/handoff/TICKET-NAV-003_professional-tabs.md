TASK: EP-NAV-003 — Abas no Detalhe do Profissional (Histórico + Notas)
BRANCH: feat/nav-professional-tabs
BASE: main
PRIORIDADE: MÉDIO · Wave 2 — só iniciar após feat/nav-sidebar-roles merged

---

ARQUIVOS:
- EDITAR: src/app/(dashboard)/profissionais/[id]/page.tsx

---

## CONTEXTO

A página /profissionais/[id] renderiza tudo em scroll vertical contínuo.
ProfessionalHistorico e ProfessionalNotes ficam no final da página (após 5 outras seções).
Precisamos de um TabBar com 3 abas: Dados · Histórico · Notas.

## MUDANÇA

### Passo 1 — Criar componente ProfessionalTabs (Client Component)

Adicionar no TOPO do arquivo page.tsx (antes do export default), marcado com 'use client':

```typescript
'use client'
import { useState } from 'react'

function ProfessionalTabs({
  professional,
  equipment,
  vacations,
  notes,
  canReadNotes,
  currentUserId,
  currentRole,
  renewalStyle,
  daysLeft,
}: {
  professional: any
  equipment: any
  vacations: any[]
  notes: any[]
  canReadNotes: boolean
  currentUserId: string
  currentRole: string
  renewalStyle: { bg: string; label: string }
  daysLeft: number | null
}) {
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

      {/* Aba Dados — todo o conteúdo atual exceto Histórico e Notas */}
      {activeTab === 'dados' && (
        <DadosTab
          professional={professional}
          equipment={equipment}
          vacations={vacations}
          currentUserId={currentUserId}
          currentRole={currentRole}
          renewalStyle={renewalStyle}
          daysLeft={daysLeft}
        />
      )}

      {/* Aba Histórico */}
      {activeTab === 'historico' && (
        <ProfessionalHistorico professionalId={professional.id} />
      )}

      {/* Aba Notas */}
      {canReadNotes && activeTab === 'notas' && (
        <ProfessionalNotes
          professionalId={professional.id}
          notes={notes}
          currentUserId={currentUserId}
          currentRole={currentRole}
        />
      )}
    </div>
  )
}
```

### Passo 2 — Criar componente DadosTab

Extrair para DadosTab todo o JSX que hoje está dentro do `return` de ProfissionalDetailPage,
exceto o bloco de breadcrumb/header e o alerta de renovação (que ficam fora das abas).

O DadosTab recebe as mesmas props que o conteúdo atual usa.

### Passo 3 — Alterar o return de ProfissionalDetailPage

ANTES (estrutura simplificada do return atual):
```tsx
return (
  <div className="space-y-6 max-w-5xl">
    {/* breadcrumb + header */}
    {/* alerta renovação */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* coluna principal com Contrato, Financeiro, Férias */}
      {/* coluna lateral com Contato, Equipamento */}
    </div>
    <ProfessionalHistorico ... />   {/* ← mover para aba */}
    <ProfessionalNotes ... />        {/* ← mover para aba */}
  </div>
)
```

DEPOIS:
```tsx
return (
  <div className="space-y-6 max-w-5xl">
    {/* breadcrumb + header — permanecem fora das abas */}
    {/* alerta renovação — permanece fora das abas */}
    <ProfessionalTabs
      professional={professional}
      equipment={equipment}
      vacations={vacations ?? []}
      notes={notes}
      canReadNotes={canReadNotes}
      currentUserId={currentUserId}
      currentRole={currentRole}
      renewalStyle={renewalStyle}
      daysLeft={daysLeft}
    />
  </div>
)
```

---

COMANDOS:
1. npx tsc --noEmit
2. npm run lint
3. npm run build

DOD:
1. Página abre na aba Dados por padrão · aba Histórico funciona · aba Notas só aparece para admin/gerente com badge de contagem
2. tsc + lint + build sem erros · nenhuma prop existente removida ou quebrada
