---
para: Especialista 2 (Haiku)
atualizado: 2026-04-07 v3
---

# Fila — Especialista 2

> Leia este arquivo PRIMEIRO em toda sessão.
> Execute na ordem. Um ticket por vez. Não pule.

---

## ⛔ REGRA CRÍTICA

**Você é Especialista 2. Só execute tickets desta fila.**
Nunca leia ou execute tickets da `FILA_ESPECIALISTA_1.md`.
Se sua fila estiver vazia: **pare e aguarde**. Não busque trabalho em outro lugar.

---

## 🎯 FILA ATUAL

### ▶️ E2-L — NAV-001: Sidebar + MobileMenu — expor seções Admin/Analytics
**Ticket:** `comunicacao/especialista-2/inbox/TICKET_nav-001-sidebar-refactor_07042026_20_00.md`
**Branch:** `feat/nav-001-sidebar-admin-sections`
**Por quê:** `sidebar.tsx` (150 linhas) e `mobile-menu.tsx` (184 linhas) estão TRUNCADOS no disco. O ticket contém o arquivo sidebar.tsx completo para reescrita. Mobile menu: mesmas mudanças (ler e completar o arquivo). Adiciona seção Analytics (Métricas + Saúde dos Testes) e Administração (Audit Log + Usuários) visíveis por role.

### ⏳ E2-M — NAV-002: Corrigir acesso a Métricas por role (remover METRICS_ALLOWED_EMAIL)
**Ticket:** `comunicacao/especialista-2/inbox/TICKET_nav-002-metricas-role-fix_07042026_20_30.md`
**Branch:** `fix/nav-002-metricas-role-check`
**Por quê:** `proxy.ts` está TRUNCADO. `/area-usuario/metricas` só abre para 1 email específico — todos os outros são bloqueados. O ticket tem o proxy.ts completo reconstruído + fix em metricas/page.tsx.

### ⏳ E2-N — NAV-004: Simplificar Área do Usuário
**Ticket:** `comunicacao/especialista-2/inbox/TICKET_nav-004-area-usuario-simplificada_07042026_22_00.md`
**Branch:** `fix/nav-004-area-usuario-simplificada`
**Dependência: E2-L deve estar merged antes.**
**Por quê:** `area-usuario/page.tsx` está TRUNCADO (60 linhas). Após E2-L adicionar Métricas, Saúde dos Testes, Audit Log e Gerenciar Usuários na sidebar, os cards admin ficam redundantes. O ticket tem o arquivo completo reescrito — apenas profile card + Meu Perfil + Permissões.

---

## ✅ Concluídas hoje (07/04/2026)

| # | Ticket | PR |
|---|---|---|
| E2-K | EP-015 — header.tsx + command-palette.tsx | ✅ PR #101 aguardando merge |

## ✅ Concluídas (sessão anterior)

| # | Ticket | PR |
|---|---|---|
| E2-A | Histórico integração | ✅ done |
| E2-B | Offline page | ✅ done |
| E2-C | Professional actions RBAC | ✅ PR #70 |
| E2-D | Guard clientes | ✅ PR #73 |
| E2-E | Guard equipamentos | ✅ PR #75 |
| E2-F | Perfil dropdown links (header) | ✅ PR #76 |
| E2-G | Perfil page + action updateProfile | ✅ PR #79 |
| E2-H | Avatar upload | ✅ PR #82 |
| E2-J | Consolida Perfil Completo | ✅ PR #84 |
| E2-I | Saved Filters UI | ✅ merged |

---

## 📏 Regras

1. `git checkout main && git pull origin main` antes de cada branch nova
2. `npx tsc --noEmit` antes de todo commit — zero erros
3. Nunca push direto em `main`
4. Bloqueio ou dúvida → criar `BLOCK_[assunto]_[ddmmaaaa]_[hh_mm].md` no inbox do gerente e parar
5. Concluído → criar `DONE_[assunto]_[ddmmaaaa]_[hh_mm].md` no inbox do gerente com número do PR
