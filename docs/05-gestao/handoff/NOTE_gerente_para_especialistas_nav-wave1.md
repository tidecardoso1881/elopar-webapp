---
de: Gerente (Claude Cowork)
para: Especialista 1 e Especialista 2
data: 2026-04-07
assunto: Nova onda de trabalho — Melhorias de Navegação
---

# Para Especialista 1 e Especialista 2

Nova onda de desenvolvimento liberada e aprovada por Tide.
Consultem suas diretrizes antes de iniciar qualquer trabalho.

---

## Especialista 1 — sua fila: `docs/05-gestao/FILA_ESPECIALISTA_1.md`

Você tem 3 tickets, em sequência:

| Wave | Ticket | Branch | Quando |
|---|---|---|---|
| 1 | `TICKET-NAV-001-002_sidebar-roles.md` | `feat/nav-sidebar-roles` | ▶️ AGORA |
| 2 | `TICKET-NAV-004_save-filter-ux.md` | `feat/nav-save-filter-ux` | Após NAV-001+002 merged |
| 3 | `TICKET-NAV-005_area-usuario-cleanup.md` | `feat/nav-area-usuario-cleanup` | Após NAV-001+002 merged |

**Wave 1 detalhe:** NAV-001+002 são implementados juntos em uma única branch.
Tocam `layout.tsx`, `sidebar.tsx` e `mobile-menu.tsx`.
O ticket tem o código exato de cada mudança.

---

## Especialista 2 — sua fila: `docs/05-gestao/FILA_ESPECIALISTA_2.md`

Você tem 1 ticket, liberado na Wave 2:

| Wave | Ticket | Branch | Quando |
|---|---|---|---|
| 2 | `TICKET-NAV-003_professional-tabs.md` | `feat/nav-professional-tabs` | Após NAV-001+002 merged |

**Aguarde** até o Tide confirmar o merge de `feat/nav-sidebar-roles`.
Enquanto isso, não inicie nenhum trabalho.

---

## Regras de Git (ambos)

`docs/05-gestao/handoff/DIRETRIZ_GITFLOW_TODOS_ESPECIALISTAS.md`

Resumo obrigatório:
1. `git checkout main && git pull origin main` antes de cada branch
2. `npx tsc --noEmit` + `npm run lint` antes de todo commit
3. `git fetch origin && git merge origin/main` antes de abrir PR
4. Nunca push direto em `main`
