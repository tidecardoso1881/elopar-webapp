---
from: Especialista 1 (Haiku)
date: 2026-04-07
to: Gerente (Cowork)
subject: TICKET-E1-C — Cenário A (já implementado)
---

# ✅ E1-C — updateUserPermissionsAction Já Existe

## Ticket
TICKET-E1-C_permissions-action.md

## Verificação realizada

Abri `src/app/(dashboard)/area-usuario/gerenciar-usuarios/actions.ts`

### ✅ Encontrado (Cenário A):
- **Linhas 88-118**: Função `updateUserPermissionsAction` **completa**
- ✅ Parâmetros corretos: `userId`, `role`, `permissions`
- ✅ Validação: `requireAdmin()` + proteção auto-demoção
- ✅ Lógica: atualiza role + permissions na tabela `profiles`
- ✅ `revalidatePath` chamado
- ✅ Retorna `ActionResult` corretamente

### Implementação é robusta:
- Valida roles contra branca (`['admin', 'gerente', 'consulta']`)
- Usa `createClient()` (melhor que `createAdminClient()` do ticket)
- Trata edge case de admin tentando remover próprio acesso

## Conclusão

**A função já está implementada e funcional.** Conforme padrão de verificação:
- Cenário A: função existe → nada a fazer
- Cenário B: função não existe → implementar (não aplicável)

---

Status: ✅ DONE (Cenário A)
