---
id: TICKET-E1-B
para: Especialista 1
branch: feat/ep-011-header-dropdown
arquivo: src/components/layout/header.tsx
status: pending
bloqueio: iniciar SOMENTE após PR #68 mergeado em main
---

# E1-B — Verificar e completar dropdown de usuário no header

```bash
git checkout main && git pull origin main
grep -n "details\|initials\|SignOut" src/components/layout/header.tsx
```

**Se encontrar `<details` no JSX:** dropdown já está implementado.
→ Criar `NOTE_e1b_ja_existe.md` e parar.

**Se NÃO encontrar `<details` no JSX:** adicionar antes do `</header>`:

```bash
git checkout -b feat/ep-011-header-dropdown
```

Localizar o fechamento `</header>` em `src/components/layout/header.tsx`.
Inserir imediatamente antes dele:

```tsx
      {/* Right: User Dropdown */}
      {notificationBell && <div className="flex-shrink-0">{notificationBell}</div>}
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

```bash
npx tsc --noEmit
git add src/components/layout/header.tsx
git commit -m "feat(EP-011): dropdown de usuário no header"
git push origin feat/ep-011-header-dropdown
# Abrir PR: "feat(EP-011): dropdown de usuário no header"
```

**DoD:** tsc ok + push + PR aberto
**Após concluir:** criar `NOTE_e1b_done.md` com número do PR
