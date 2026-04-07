---
id: TICKET-E1-I
ep: EP-NEW-011
para: Especialista 1
branch: feat/ep-011-toolbar-unica
---

# E1-I — Remover logo duplicado do Header (EP-011)

**Problema:** No desktop, a Sidebar já exibe "Grupo Elopar / Gestão de Profissionais" no topo.
O Header repete o mesmo logo à esquerda (`hidden md:flex`). São dois logos idênticos visíveis ao mesmo tempo.
**Solução:** Remover o bloco de logo do Header. Manter apenas o da Sidebar.

```bash
git checkout main && git pull origin main
git checkout -b feat/ep-011-toolbar-unica
```

---

## Arquivo — `src/components/layout/header.tsx`

Localizar e **remover** este bloco inteiro (linhas ~38–46):

```tsx
{/* Left: Logo + Elopar (desktop only) */}
<div className="hidden md:flex items-center gap-3 flex-shrink-0">
  <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
    <span className="text-white font-bold text-sm" aria-hidden="true">E</span>
  </div>
  <div>
    <p className="font-semibold text-gray-900 text-sm leading-tight">Grupo Elopar</p>
    <p className="text-xs text-gray-500 leading-tight">Gestão de Profissionais</p>
  </div>
</div>
```

> ℹ️ O `<header>` continua renderizando normalmente — só remove este `<div>` filho.
> ℹ️ O `MobileMenu` (mobile) não é afetado.
> ℹ️ Não alterar `sidebar.tsx` — o logo da sidebar permanece.

---

```bash
npx tsc --noEmit
git add src/components/layout/header.tsx
git commit -m "feat(EP-011): remover logo duplicado do Header — mantém só o da Sidebar"
git push origin feat/ep-011-toolbar-unica
# Abrir PR: "feat(EP-011): toolbar única — remover logo duplicado do Header"
```

**DoD:** tsc ok + logo aparece 1x no desktop (sidebar) + PR aberto
**Após concluir:** criar `NOTE_e1i_done.md` com número do PR
