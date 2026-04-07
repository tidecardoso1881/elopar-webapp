---
para: Especialista 2 (Haiku)
atualizado: 2026-04-07 Cowork
assunto: Wave NAV — Fila Liberada
---

# Fila Especialista 2 — Wave NAV

> Leia este arquivo PRIMEIRO em toda sessão.
> Execute na ordem. Um ticket por vez. Não pule.

---

## ⛔ REGRA CRÍTICA

**Wave 1 (NAV):** Apenas **NAV-001-002** está liberado.
Outros tickets (NAV-003, NAV-004, NAV-005) ficam para Wave 2.

**Bloqueios:**
- NAV-003 aguarda merge do E1 antes de iniciar

---

## 🎯 TAREFA ATUAL — LIBERADA AGORA

### ▶️ NAV-001-002 — Sidebar por role
**Ticket:** `TICKET-NAV-001-002_sidebar-roles.md`  
**Branch:** `feat/nav-sidebar-roles`  
**Prioridade:** CRÍTICO  
**Descrição:** Mostrar "Analytics" (Métricas) só para admin/gerente

**O que fazer:**
1. Editar `src/app/(dashboard)/layout.tsx` — passar `userRole` ao Sidebar
2. Editar `src/components/layout/sidebar.tsx` — renderizar seções por role
3. Editar `src/components/layout/mobile-menu.tsx` — mesmo para mobile

**Após concluir:** 
- [ ] tsc ok
- [ ] PR aberta
- [ ] Criar `NOTE_nav001002_done.md`

---

## ⏳ PRÓXIMAS (Wave 2 — Aguardando Liberação)

### NAV-003 — Professional Tabs (BLOQUEADO)
**Status:** ⏳ Aguarda merge do E1  
**Bloqueio:** E1 precisa finalizar seu ticket antes de E2 começar NAV-003

### NAV-004 — Save Filter UX
**Status:** ⏳ Aguardando Wave 2

### NAV-005 — Area Usuario Cleanup
**Status:** ⏳ Aguardando Wave 2

---

## 📏 Regras

1. `git checkout main && git pull origin main` antes de cada branch nova
2. `npx tsc --noEmit` antes de todo commit — zero erros
3. Nunca push direto em `main`
4. Bloqueio ou dúvida → criar `NOTE_e2_BLOQUEADO_[ticket].md` e parar
5. Concluído → criar `NOTE_nav_[ticket]_done.md` com número do PR

---

## 🚀 Próximo Passo

**Execute NAV-001-002 agora.**

Quando terminar, aguarde liberação do E1 e do Cowork para Wave 2.

---

Gerente (Cowork)  
Data: 2026-04-07
