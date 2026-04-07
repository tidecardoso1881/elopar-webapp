---
id: TICKET-E2-F
ep: EP-NEW-005
para: Especialista 2
branch: feat/ep-005-dropdown-links
arquivos:
  - src/components/layout/header.tsx
status: pending
---

# E2-F — Links de perfil no dropdown do header

```bash
git checkout main && git pull origin main
git checkout -b feat/ep-005-dropdown-links
```

---

## Arquivo — `src/components/layout/header.tsx`

Localizar o bloco `<div className="py-1">` que contém `<SignOutButton />`.

Substituir **todo o bloco** `<div className="py-1">...</div>` por:

```tsx
          <div className="py-1">
            <Link
              href="/area-usuario/perfil"
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => { if (detailsRef.current) detailsRef.current.open = false }}
            >
              <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
              Meu Perfil
            </Link>
            {profile?.role === 'admin' && (
              <Link
                href="/gerenciar-usuarios"
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => { if (detailsRef.current) detailsRef.current.open = false }}
              >
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.038 9.038 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                </svg>
                Gerenciar Usuários
              </Link>
            )}
            <div className="border-t border-gray-100 mt-1 pt-1">
              <SignOutButton />
            </div>
          </div>
```

> ℹ️ `Link` e `profile` já estão disponíveis no componente. `detailsRef` também.

---

```bash
npx tsc --noEmit
git add src/components/layout/header.tsx
git commit -m "feat(EP-005): links Meu Perfil e Gerenciar Usuários no dropdown do header"
git push origin feat/ep-005-dropdown-links
# Abrir PR: "feat(EP-005): links de perfil no dropdown do header"
```

**DoD:** tsc ok + PR aberto
**Após concluir:** criar `NOTE_e2f_done.md` com número do PR
