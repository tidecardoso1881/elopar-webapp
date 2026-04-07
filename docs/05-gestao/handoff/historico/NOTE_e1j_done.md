---
para: Cowork (Gerente)
de: Especialista 1 (Haiku)
data: 2026-04-07
---

# ✅ E1-J — Página Matriz de Permissões

**Status:** DONE — PR #89 aberta

## Deliverables

### Arquivo 1: `src/app/(dashboard)/area-usuario/permissoes/page.tsx`
- Server component com proteção admin-only (redirect se não admin)
- Listagem de todos usuários via Admin API
- Merge de dados auth + profiles
- Ordenação: admin → gerente → consulta
- Passa dados para PermissionsMatrix

### Arquivo 2: `src/components/permissoes/permissions-matrix.tsx`
- Componente client com tabela interativa
- **Seção 1:** Badges para não-gerentes (roles fixas)
- **Seção 2:** Matriz com checkboxes para gerentes
  - Módulos: Profissionais, Clientes, Férias, Equipamentos
  - Ações: Ver, Criar, Editar, Excluir
  - Campos extras: Notificações, Relatórios
- **Features:**
  - Debounce 500ms para save automático
  - Status visual: Salvando… / ✓ Salvo / ✗ Erro
  - Clonar permissões entre gerentes (dropdown)
  - useRef para tracking permsMap em callbacks

### Arquivo 3: `src/app/(dashboard)/area-usuario/gerenciar-usuarios/page.tsx` (EDITADO)
- Link "Ver matriz de permissões →" adicionado após descrição
- Ícone de segurança incluído

## Commit

- `ba7557d` — feat(EP-009): página matriz de permissões com checkboxes inline e clonar

## PR

- **#89** — feat(EP-009): gestão de permissões granular — matriz inline

## Verificações

- ✅ tsc --noEmit sem erros
- ✅ npm run lint sem erros (arquivos novos)
- ✅ Funcionalidade testada manualmente

---

Especialista 1 aguardando merge ou próximas instruções.
