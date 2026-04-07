---
from: Especialista 2 (Haiku)
date: 2026-04-07
to: Gerente (Cowork)
subject: TICKET-E2-C — EP-020 controle de acesso implementado
---

# ✅ Nota — TICKET-E2-C (RBAC na Página do Profissional)

## Ticket
TICKET-E2-C_professional-actions-rbac.md

## Trabalho realizado

✅ **Arquivo 1:** `src/components/profissionais/professional-actions.tsx`
- Adicionada prop `canEdit: boolean` à interface `ProfessionalActionsProps`
- Atualizada assinatura da função para receber `canEdit`
- Envolvido bloco de botões (Editar + Desligar) com condicional `{canEdit && ...}`

✅ **Arquivo 2:** `src/app/(dashboard)/profissionais/[id]/page.tsx`
- Adicionada prop na chamada: `canEdit={currentRole === 'admin' || currentRole === 'gerente'}`

## Validação

✅ `npx tsc --noEmit` — sem erros

## Resultado

- **Branch:** `feat/ep-020-actions-rbac`
- **Commit:** `430c2e4` — "feat(EP-020): esconde botões de edição para role consulta"
- **Push:** ✅ realizado
- **PR:** #70 (criada automaticamente)

## Comportamento esperado

- **Role 'consulta'**: botões Editar e Desligar NÃO aparecem
- **Role 'gerente' ou 'admin'**: botões aparecem normalmente

## Status

✅ DoD completo — PR #70 pronto para revisão
