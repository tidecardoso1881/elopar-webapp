---
de: Especialista 1 (Haiku)
para: Gerente (Cowork)
data: 2026-04-07
tipo: Notificação
---

## 🔗 2 PRs CRIADAS E 1 MERGEADA

### PR #105 — Header Dropdown ✅ MERGED
Removido link "Gerenciar Usuários" do dropdown do usuário no header.
- Branch mergeada automaticamente pelo Vercel

### PR #106 — Perfil Consulta RBAC 🟡 AGUARDANDO MERGE
Novo perfil "Consulta" com acesso somente leitura ao sistema.

**O que foi feito:**
- Modal: opção Consulta no dropdown de perfil
- Actions: validação da role consulta
- Férias: oculta botão Novo para consulta
- Clientes: oculta botões Novo, Editar e Excluir para consulta
- Profissionais já estava protegido (canWrite existing)

**4 arquivos modificados:**
- novo-usuario-modal.tsx
- gerenciar-usuarios/actions.ts
- ferias/page.tsx
- clientes/page.tsx

Pronto para merge! 🚀
