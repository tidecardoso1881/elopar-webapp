# DoR — EP-NEW-009: Gestão de Permissões Granular (UI)

> Criado em: 07/04/2026
> Status: ✅ Pronto para Dev
> Prioridade: Should Have

---

## Contexto

O EP-020 (RBAC) entregou a camada de lógica e guards:
- 3 roles: `admin`, `gerente`, `consulta`
- Hook `hasPermission()` em `src/lib/permissions.ts`
- `PermissionsModal` já existe em `src/components/gerenciar-usuarios/permissions-modal.tsx`
- O modal edita permissões granulares por módulo (ver/criar/editar/excluir) para o role `gerente`

**O que falta:** a página `/area-usuario/gerenciar-usuarios` mostra o modal por usuário, mas não existe uma **visão consolidada de permissões** — o admin não consegue ver rapidamente quem tem acesso a quê sem clicar em cada usuário.

EP-009 entrega uma **matriz de permissões** (página dedicada, somente leitura + edição inline) e a possibilidade de **clonar permissões** entre gerentes.

---

## Telas afetadas

| Tela | Caminho | Tipo de mudança |
|---|---|---|
| Nova página — Matriz de Permissões | `/area-usuario/permissoes/` | Criar |
| Gerenciar Usuários | `/area-usuario/gerenciar-usuarios/` | Adicionar link para nova página |

---

## Comportamento esperado

### Página `/area-usuario/permissoes/`

1. **Acessível somente para `admin`** — redireciona para `/area-usuario` se não for admin.
2. **Tabela-matriz** com linhas = usuários com role `gerente` e colunas = módulos × ações.
3. **Checkboxes inline** — admin altera permissão diretamente na célula (sem abrir modal).
4. **Salvar automático** ao desmarcar/marcar cada checkbox (debounce 500ms + feedback visual).
5. **Botão "Clonar permissões"** em cada linha — abre seletor para escolher outro gerente como origem.
6. **Badge de role** em cada usuário — `Administrador`, `Gerente`, `Consulta`.
7. Usuários `admin` e `consulta` aparecem na lista mas sem checkboxes (permissões não configuráveis).
8. Link "← Gerenciar Usuários" no breadcrumb.

### Colunas da matriz

| Módulo | Ações exibidas |
|---|---|
| Profissionais | Ver · Criar · Editar · Excluir |
| Clientes | Ver · Criar · Editar · Excluir |
| Férias | Ver · Criar · Editar · Excluir |
| Equipamentos | Ver · Criar · Editar · Excluir |
| Notificações | Ver |
| Relatórios | Exportar |

---

## Critérios de aceite

- [ ] Página `/area-usuario/permissoes/` acessível somente para admin
- [ ] Matriz exibe todos os usuários com seus roles
- [ ] Checkbox inline salva via `updateUserPermissionsAction` (já existente em `actions.ts`)
- [ ] Feedback visual ao salvar: spinner na célula → ✓ verde ou ✗ vermelho
- [ ] "Clonar permissões" copia `permissions` de um gerente para outro e salva
- [ ] Usuários admin/consulta aparecem na lista mas sem checkboxes editáveis
- [ ] Link na página de Gerenciar Usuários apontando para `/area-usuario/permissoes/`
- [ ] `npx tsc --noEmit` sem erros
- [ ] `npm run lint` sem erros

---

## Dependências

- ✅ `updateUserPermissionsAction` — já existe em `area-usuario/gerenciar-usuarios/actions.ts`
- ✅ `hasPermission()` — já existe em `src/lib/permissions.ts`
- ✅ `PermissionsModal` — pode ser reaproveitado para fallback ou "Clonar"
- ✅ `getDefaultManagerPermissions()` — já existe
- Supabase: coluna `permissions` (jsonb) já existe na tabela `profiles`

---

## Fora do escopo

- ❌ Criar novos roles além de admin / gerente / consulta
- ❌ Permissões por cliente específico (ex: gerente só ver clientes X e Y)
- ❌ Histórico de alterações de permissões (isso é o Audit Log, já entregue)
- ❌ Notificação por e-mail ao alterar permissões
- ❌ Alterar role pelo `PermissionsModal` (mantém comportamento atual)

---

## Arquivos relevantes (referência para o agente)

```
src/
  app/(dashboard)/area-usuario/
    gerenciar-usuarios/
      page.tsx          ← adicionar link para /permissoes
      actions.ts        ← reusar updateUserPermissionsAction
    permissoes/         ← CRIAR
      page.tsx          ← nova página (Server Component)
  components/
    gerenciar-usuarios/
      permissions-modal.tsx   ← referência de UI (não alterar)
  lib/
    permissions.ts      ← hasPermission, getDefaultManagerPermissions
  types/
    permissions.ts      ← UserPermissions, PermissionModule, PermissionAction
    roles.ts            ← UserRole, ROLE_LABELS
```

---

## Ticket para o agente (formato Haiku)

**Arquivo:** `TICKET-EP009-A_matriz-permissoes.md`

```
TASK: Criar página /area-usuario/permissoes/ com matriz de permissões inline
BRANCH: feat/ep-009-permissoes-ui
BASE: main

ARQUIVOS:
- CRIAR: src/app/(dashboard)/area-usuario/permissoes/page.tsx
- EDITAR: src/app/(dashboard)/area-usuario/gerenciar-usuarios/page.tsx (adicionar link)

COMANDOS:
1. npx tsc --noEmit
2. npm run lint
3. npm run build

DOD:
1. Matriz renderiza todos os usuários com checkboxes funcionais para gerentes
2. tsc + lint + build sem erros
```
