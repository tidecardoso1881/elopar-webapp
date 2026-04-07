TASK: EP-NAV-005 — Limpeza da Área do Usuário (remover cards admin duplicados)
BRANCH: feat/nav-area-usuario-cleanup
BASE: main
PRIORIDADE: BAIXO · Wave 3 — só iniciar após feat/nav-sidebar-roles merged em main

---

ARQUIVOS:
- EDITAR: src/app/(dashboard)/area-usuario/page.tsx

---

## CONTEXTO

Após EP-NAV-002, as ferramentas admin (Métricas, Saúde dos Testes, Gerenciar Usuários, Audit Log)
estão na sidebar. A Área do Usuário ainda lista esses cards, criando duplicidade confusa.
Este EP remove os cards duplicados e foca a página em conta pessoal.

## MUDANÇA

No arquivo `src/app/(dashboard)/area-usuario/page.tsx`:

### 1. Remover os ToolCards que duplicam itens da sidebar

Remover os ToolCard com os hrefs:
- `/area-usuario/metricas`
- `/area-usuario/saude-testes`
- `/area-usuario/gerenciar-usuarios`
- `/area-usuario/audit-log`

### 2. Manter apenas os cards de conta pessoal

Manter os ToolCards:
- `/area-usuario/perfil`
- `/area-usuario/permissoes`
- Qualquer outro card relacionado a configurações pessoais

### 3. Atualizar o título/descrição da seção

Localizar o título da página (provavelmente "Área do Usuário" ou similar) e atualizar o subtítulo/descrição para:

```
"Gerencie seu perfil e configurações pessoais"
```

Não alterar o título principal `<h1>`.

---

COMANDOS:
1. npx tsc --noEmit
2. npm run lint
3. npm run build

DOD:
1. Cards de Métricas, Saúde dos Testes, Gerenciar Usuários e Audit Log removidos da página /area-usuario · cards de Perfil e Permissões mantidos
2. tsc + lint + build sem erros
