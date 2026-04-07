---
id: TICKET-E2-C
para: Especialista 2
branch: feat/ep-020-actions-rbac
arquivos:
  - src/components/profissionais/professional-actions.tsx
  - src/app/(dashboard)/profissionais/[id]/page.tsx
status: pending
---

# E2-C — Esconder botões Editar/Desligar para role consulta

```bash
git checkout main && git pull origin main
git checkout -b feat/ep-020-actions-rbac
```

---

## Arquivo 1 — `src/components/profissionais/professional-actions.tsx`

Alterar a interface adicionando a prop `canEdit`:

```tsx
// ANTES:
interface ProfessionalActionsProps {
  id: string
  name: string
  status: string
}

// DEPOIS:
interface ProfessionalActionsProps {
  id: string
  name: string
  status: string
  canEdit: boolean
}
```

Alterar a assinatura da função:

```tsx
// ANTES:
export function ProfessionalActions({ id, name, status }: ProfessionalActionsProps) {

// DEPOIS:
export function ProfessionalActions({ id, name, status, canEdit }: ProfessionalActionsProps) {
```

Envolver o bloco `{/* Botões de ação */}` com condicional:

```tsx
// ANTES:
      {/* Botões de ação */}
      <div className="flex items-center gap-2">
        <a ...>Editar</a>
        {isActive && (<button ...>Desligar</button>)}
      </div>

// DEPOIS:
      {/* Botões de ação */}
      {canEdit && (
        <div className="flex items-center gap-2">
          <a
            href={`/profissionais/${id}/editar`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
            </svg>
            Editar
          </a>
          {isActive && (
            <button
              onClick={() => setShowConfirm(true)}
              disabled={isPending}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
              </svg>
              Desligar
            </button>
          )}
        </div>
      )}
```

---

## Arquivo 2 — `src/app/(dashboard)/profissionais/[id]/page.tsx`

Localizar onde `<ProfessionalActions` é chamado (linha ~190).

```tsx
// ANTES:
<ProfessionalActions
  id={professional.id}
  name={professional.name}
  status={professional.status}
/>

// DEPOIS:
<ProfessionalActions
  id={professional.id}
  name={professional.name}
  status={professional.status}
  canEdit={currentRole === 'admin' || currentRole === 'gerente'}
/>
```

> ℹ️ `currentRole` já está disponível na linha 110 do arquivo. Não precisa buscar de novo.

---

```bash
npx tsc --noEmit
git add src/components/profissionais/professional-actions.tsx
git add src/app/\(dashboard\)/profissionais/\[id\]/page.tsx
git commit -m "feat(EP-020): esconde botões de edição para role consulta"
git push origin feat/ep-020-actions-rbac
# Abrir PR: "feat(EP-020): RBAC — controle de acesso em ações do profissional"
```

**DoD:** tsc ok + PR aberto
**Após concluir:** criar `NOTE_e2c_done.md` com número do PR
