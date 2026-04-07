---
id: TICKET-015B
ep: EP-NEW-011
status: pending
prioridade: iniciar APENAS após PR #68 mergeado em main
especialista: 1 (Haiku)
branch_a_criar: feat/ep-new-011-user-dropdown
arquivo_alvo: src/components/layout/header.tsx
criado_em: 2026-04-07
---

# Tarefa — Dropdown de Usuário no Header (EP-NEW-011)

> ⚠️ **NÃO INICIAR** antes do PR #68 ser mergeado em main.
> O `header.tsx` da main está incompleto até o merge. Após o merge ele estará correto.

---

## Contexto

O `header.tsx` já tem:
- Prop `user: { email: string }` e `profile: { full_name: string | null; role: string } | null`
- Lógica `displayName` e `initials` calculados
- `detailsRef` com `useRef<HTMLDetailsElement>` para controle de dropdown
- `useEffect` que fecha o dropdown ao clicar fora
- `import { SignOutButton }` importado

**Objetivo:** garantir que o dropdown de usuário está visível e funcional no canto direito do header.

---

## Passo 1 — Verificar o arquivo após o merge do PR #68

```bash
git checkout main
git pull origin main
```

Abra `src/components/layout/header.tsx` e verifique:

**Cenário A — Dropdown JÁ existe** (procure por `<details` ou `initials` no JSX):
- Se encontrar o elemento `<details ref={detailsRef}` com `displayName` e `SignOutButton` → o header está completo.
- Escreva `NOTE_e1_ep011_ja_implementado.md` informando o Cowork.
- **Não faça nada mais. Tarefa concluída.**

**Cenário B — Dropdown NÃO existe** (o `displayName` e `initials` estão calculados mas não aparece no JSX):
- Siga o Passo 2 abaixo.

---

## Passo 2 — Implementar dropdown (só se Cenário B)

Crie uma branch:
```bash
git checkout -b feat/ep-new-011-user-dropdown
git fetch origin
git merge origin/main
```

No arquivo `src/components/layout/header.tsx`, localize o bloco final do `<header>` (antes do fechamento `</header>`).

Adicione o dropdown de usuário substituindo qualquer bloco de usuário existente pelo código abaixo, logo antes do `</header>`:

```tsx
{/* Right: User Dropdown */}
{notificationBell && (
  <div className="flex-shrink-0">{notificationBell}</div>
)}
<details ref={detailsRef} className="relative flex-shrink-0">
  <summary className="flex items-center gap-2 cursor-pointer list-none rounded-lg px-2 py-1.5 hover:bg-gray-100 transition-colors">
    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
      <span className="text-sm font-semibold text-indigo-600">{initials}</span>
    </div>
    <div className="hidden sm:block text-left">
      <p className="text-sm font-medium text-gray-900 leading-tight truncate max-w-[120px]">{displayName}</p>
      <p className="text-xs text-gray-500 leading-tight capitalize">{profile?.role ?? 'usuário'}</p>
    </div>
    <svg className="h-4 w-4 text-gray-400 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  </summary>
  <div className="absolute right-0 top-full mt-1 w-48 rounded-xl border border-gray-200 bg-white shadow-lg z-50 overflow-hidden">
    <div className="px-4 py-3 border-b border-gray-100">
      <p className="text-sm font-medium text-gray-900 truncate">{displayName}</p>
      <p className="text-xs text-gray-500 truncate">{user.email}</p>
    </div>
    <div className="py-1">
      <SignOutButton />
    </div>
  </div>
</details>
```

---

## Passo 3 — Verificar e commitar

```bash
npx tsc --noEmit
# Deve passar sem erros

npm run build
# Deve passar sem erros
```

```bash
git add src/components/layout/header.tsx
git commit -m "feat(EP-NEW-011): dropdown de usuário no header"
git push origin feat/ep-new-011-user-dropdown
```

Abrir PR: `feat(EP-NEW-011): área de usuário — dropdown no header`

---

## DoD

- [ ] Verificação feita (Cenário A ou B confirmado)
- [ ] Se Cenário B: dropdown implementado e visível no header
- [ ] `npx tsc --noEmit` sem erros
- [ ] PR aberto (ou NOTE informando que já estava implementado)

---

## Após concluir

Escreva em `docs/05-gestao/handoff/`:
```
NOTE_e1_ep011_done_2026-04-07.md
```
Com: "EP-NEW-011 header dropdown — [Cenário A: já implementado | Cenário B: implementado, PR #XX aberto]"
