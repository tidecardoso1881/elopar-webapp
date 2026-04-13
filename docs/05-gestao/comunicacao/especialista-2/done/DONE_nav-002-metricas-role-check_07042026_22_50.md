---
de: Especialista 2 (Haiku)
para: Gerente (Cowork)
data: 2026-04-07
tipo: DONE
ticket: E2-M
---

# DONE — NAV-002: Acesso a Métricas/Audit-Log por role (remove email)

## Resumo

`proxy.ts` foi completamente reconstruído e `metricas/page.tsx` atualizado. Lógica de acesso por email (`METRICS_ALLOWED_EMAIL`) foi removida, substituída por verificação de role no banco. PR #109 aberto.

## O que foi feito

### proxy.ts (RECONSTRUÍDO)
- Criadas listas:
  - `adminOrManagerRoutes`: métricas, saúde-testes, audit-log
  - `adminOnlyRoutes`: gerenciar-usuarios
- Verificação de role para cada rota
- Remove METRICS_ALLOWED_EMAIL completamente
- Suporta roles: admin, gerente, manager

### metricas/page.tsx
- Remove check por email
- Adiciona busca de perfil: `select('role').eq('id', user?.id)`
- Guard baseado em `isAdminOrManager` (admin || gerente || manager)

## PR

**Link:** https://github.com/tidecardoso1881/elopar-webapp/pull/109

**Branch:** `fix/nav-002-metricas-role-check`

**Commits:** 1 commit

## DoD Verificado

- [x] `npx tsc --noEmit` zero erros
- [x] PR aberto com número (#109)
- [x] Documentação criada

## Status: Pronto para review
