# Sprint 1 — Critérios de Aceite para Validação

**Data:** 05/04/2026 | **Branch:** sprint-1 | **Status:** Implementada — aguardando validação do Tide

---

## Como usar este documento

Para cada EP, execute os testes na ordem indicada com a aplicação rodando (`npm run dev`).
Marque ✅ quando passar, ❌ quando falhar (anote o erro).

---

## EP-001 — Repositório e Git Flow

**Pré-condição:** acesso ao GitHub e terminal com git.

| # | Teste | Como testar | Esperado |
|---|-------|-------------|----------|
| 1 | Repositório existe no GitHub | Acesse https://github.com/tidecardoso1881/elopar-webapp | Repositório público/privado visível |
| 2 | Branches corretas existem | `git branch -a` | Branches: `main`, `develop`, `sprint-1` |
| 3 | Branch ativa é sprint-1 | `git status` | `On branch sprint-1` |
| 4 | .gitignore exclui .env | `cat .gitignore \| grep env` | `.env*` listado |
| 5 | .gitignore exclui xlsx | `cat .gitignore \| grep xlsx` | `*.xlsx` listado |
| 6 | Histórico de commits existe | `git log --oneline` | Mínimo 5 commits descritivos |

---

## EP-002 — Next.js App Router

**Pré-condição:** `npm run dev` rodando em http://localhost:3000.

| # | Teste | Como testar | Esperado |
|---|-------|-------------|----------|
| 1 | App inicia sem erros | `npm run dev` | Sem erros no terminal |
| 2 | Rota raiz redireciona | Acesse http://localhost:3000 | Redireciona para `/login` |
| 3 | Route groups funcionam | Acesse `/login` | Página de login renderiza (sem sidebar) |
| 4 | Rota protegida bloqueia | Acesse http://localhost:3000/dashboard sem login | Redireciona para `/login` |
| 5 | TypeScript sem erros | `npx tsc --noEmit` | Sem erros de tipo |
| 6 | Build funciona | `npm run build` | Build finaliza sem erros |
| 7 | Lint sem erros críticos | `npm run lint` | Sem erros (warnings OK) |

---

## EP-003 — Banco de Dados (Supabase)

**Pré-condição:** acesso ao painel Supabase (https://supabase.com/dashboard/project/pzqxbiutlnssnlthlyay).

| # | Teste | Como testar | Esperado |
|---|-------|-------------|----------|
| 1 | Tabela `profiles` existe | Table Editor → profiles | Tabela visível com colunas: id, full_name, role, created_at |
| 2 | Tabela `clients` existe | Table Editor → clients | 6 registros (Alelo, Livelo, Veloe, Pede Pronto, Idea Maker, Zamp) |
| 3 | Tabela `professionals` existe | Table Editor → professionals | Registros importados pelo seed |
| 4 | Tabela `equipment` existe | Table Editor → equipment | Tabela visível |
| 5 | Tabela `vacations` existe | Table Editor → vacations | Tabela visível |
| 6 | View `v_dashboard_kpis` existe | SQL Editor → `SELECT * FROM v_dashboard_kpis LIMIT 1` | Retorna dados sem erro |
| 7 | View `v_renewal_alerts` existe | SQL Editor → `SELECT * FROM v_renewal_alerts LIMIT 5` | Retorna dados sem erro |
| 8 | View `v_client_summary` existe | SQL Editor → `SELECT * FROM v_client_summary` | Retorna 6 clientes |
| 9 | RLS está ativo | Authentication → Policies | Políticas visíveis nas tabelas |
| 10 | Trigger auto-profile funciona | Criar novo usuário via auth → verificar em profiles | Registro criado automaticamente em profiles |

---

## EP-004 — Autenticação

**Pré-condição:** `npm run dev` rodando. Credenciais: tidebatera@gmail.com / [sua senha].

| # | Teste | Como testar | Esperado |
|---|-------|-------------|----------|
| 1 | Página de login renderiza | Acesse http://localhost:3000/login | Formulário com campos Email e Senha visíveis |
| 2 | Logo e branding corretos | Visualize a página de login | Logo Grupo Elopar com ícone azul |
| 3 | Toggle mostrar/ocultar senha | Clique no ícone de olho no campo Senha | Senha alterna entre `••••` e texto visível |
| 4 | Validação de email vazio | Submeta o form sem preencher | Mensagem "Email e senha são obrigatórios" |
| 5 | Validação de email inválido | Digite "naoeumemail" e submeta | Mensagem "Informe um email válido" |
| 6 | Credenciais erradas | Email válido + senha errada | Mensagem "Email ou senha inválidos. Verifique seus dados." |
| 7 | Login com sucesso | tidebatera@gmail.com + senha correta | Redireciona para `/dashboard` |
| 8 | Sessão persiste após refresh | Faça login, pressione F5 | Continua no dashboard sem pedir login |
| 9 | Middleware protege rotas | Abra aba anônima → acesse /profissionais | Redireciona para /login |
| 10 | Usuário logado não acessa login | Estando logado, acesse /login | Redireciona para /dashboard |
| 11 | Link "Esqueceu a senha" existe | Visualize o rodapé do formulário | Link visível e clicável |
| 12 | Logout funciona | Clique em "Sair" na sidebar | Redireciona para /login, sessão encerrada |

### EP-004b — Reset de Senha

| # | Teste | Como testar | Esperado |
|---|-------|-------------|----------|
| 13 | Página reset-password renderiza | Acesse /reset-password | Formulário "Definir senha" visível |
| 14 | Email não cadastrado | Digite email inexistente | Mensagem de erro clara |
| 15 | Email válido | Digite tidebatera@gmail.com | Mensagem "Email enviado!" com checkmark verde |
| 16 | Email contém o endereço digitado | Após envio com sucesso | Mensagem mostra o email digitado em negrito |

---

## EP-005 — Seed Script (Excel → Supabase)

**Pré-condição:** arquivo Excel em `docs/02-dados/` disponível localmente.

| # | Teste | Como testar | Esperado |
|---|-------|-------------|----------|
| 1 | Dry-run executa sem erros | `npm run seed:dry` | Lista o que seria inserido, sem erros |
| 2 | Dados foram importados | Supabase → Table Editor → professionals | Registros presentes (28+ profissionais) |
| 3 | Clientes importados | Supabase → Table Editor → clients | 6 clientes com nomes corretos |
| 4 | Script é idempotente | `npm run seed` duas vezes | Sem duplicatas (upsert funciona) |
| 5 | Excel está no .gitignore | `git status` após adicionar o xlsx | Arquivo não aparece como untracked |

---

## EP-006 — Layout (Sidebar + Header)

**Pré-condição:** logado no sistema.

| # | Teste | Como testar | Esperado |
|---|-------|-------------|----------|
| 1 | Sidebar renderiza | Acesse /dashboard | Sidebar à esquerda com logo "Grupo Elopar" |
| 2 | 6 itens de navegação | Conte os itens na sidebar | Dashboard, Profissionais, Clientes, Renovações, Equipamentos, Férias |
| 3 | Item ativo destacado (Dashboard) | Acesse /dashboard | "Dashboard" com fundo azul claro e texto azul |
| 4 | Item ativo muda ao navegar | Clique em "Clientes" | "Clientes" fica destacado, Dashboard volta ao normal |
| 5 | Header renderiza | Visualize o topo da página | Header com título da página e info do usuário |
| 6 | Nome do usuário na sidebar | Veja rodapé da sidebar | Nome "Tide Cardoso" exibido |
| 7 | Role exibida na sidebar | Veja rodapé da sidebar | "Administrador" exibido abaixo do nome |
| 8 | Inicial do avatar | Veja o avatar circular | Letra "T" visível |
| 9 | Botão Sair visível | Rodapé da sidebar | Botão "Sair" com ícone visível |
| 10 | Logout via sidebar | Clique em "Sair" | Redireciona para /login |

---

## EP-007 — Vitest + React Testing Library

**Pré-condição:** `npm install` executado, dependências instaladas.

| # | Teste | Como testar | Esperado |
|---|-------|-------------|----------|
| 1 | Testes rodam sem erros | `npm test` | `3 passed` (3 suítes) |
| 2 | 18 casos passam | `npm test` | Todos os testes ✓ |
| 3 | Watch mode funciona | `npm run test:watch` | Terminal entra em modo watch |
| 4 | Coverage gera relatório | `npm run test:coverage` | Relatório em `coverage/` |
| 5 | Suíte formatting | `npm test -- formatting` | 18 testes passando em formatting.test.ts |
| 6 | Suíte sign-out-button | `npm test -- sign-out-button` | 6 testes passando |
| 7 | Suíte sidebar | `npm test -- sidebar` | 12 testes passando |

---

## EP-008 — GitHub Actions CI/CD

**Pré-condição:** branch `sprint-1` enviada para o GitHub (`git push origin sprint-1`).

| # | Teste | Como testar | Esperado |
|---|-------|-------------|----------|
| 1 | Workflow file existe | Veja `.github/workflows/ci.yml` | Arquivo presente |
| 2 | Pipeline dispara no push | Após `git push`, acesse https://github.com/tidecardoso1881/elopar-webapp/actions | Pipeline rodando ou concluído |
| 3 | Etapa TypeCheck passa | Veja detalhes do run no GitHub Actions | Step "Type check" ✅ |
| 4 | Etapa Lint passa | Veja detalhes do run | Step "Lint" ✅ |
| 5 | Etapa Tests passa | Veja detalhes do run | Step "Run tests" ✅ |
| 6 | Etapa Build passa | Veja detalhes do run | Step "Build" ✅ |
| 7 | Tempo total < 10 min | Veja duração do run | Pipeline completo em < 10 minutos |

> **Atenção:** se a etapa Build falhar por falta de secrets, configure em:
> GitHub → repo → Settings → Secrets and variables → Actions → New repository secret
> Adicione: `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## Resumo dos Testes

| EP | Descrição | Total de Testes |
|----|-----------|-----------------|
| EP-001 | Git Flow | 6 |
| EP-002 | Next.js App Router | 7 |
| EP-003 | Banco de dados | 10 |
| EP-004 | Autenticação + Reset | 16 |
| EP-005 | Seed Script | 5 |
| EP-006 | Layout Sidebar/Header | 10 |
| 