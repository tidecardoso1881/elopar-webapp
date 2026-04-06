# Sprint 1 - Backlog Detalhado

**Sprint:** 1 | **Período:** 7-20 de abril de 2026 | **Velocidade:** 40 story points

---

## EP-001: Criar projeto Supabase e configurar ambiente

**Tipo:** Task
**Story Points:** 3
**Prioridade:** P0 (Must Have)
**Status:** TODO
**Atribuído a:** Tide Cardoso

### Descrição

Como desenvolvedor, quero criar e configurar um projeto Supabase com todas as variáveis de ambiente necessárias para que o aplicativo possa se conectar ao banco de dados e aos serviços de autenticação.

### Critérios de Aceitação

- [ ] Projeto Supabase criado na região correta (us-east-1 ou eu-west-1)
- [ ] Arquivo `.env.local` configurado com variáveis corretas:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Conexão testada e validada
- [ ] Documentação de como replicar ambiente adicionada
- [ ] Backup de chaves seguras em local aprovado
- [ ] RLS (Row Level Security) desabilitado temporariamente para desenvolvimento

### Tarefas Técnicas

- [ ] Criar conta/organização Supabase
- [ ] Configurar projeto com PostgreSQL 15+
- [ ] Habilitar extensões necessárias (uuid-ossp, pgcrypto)
- [ ] Copiar variáveis de ambiente
- [ ] Validar conexão com CLI do Supabase
- [ ] Documentar procedimento de replicação

### Notas

- Usar free tier do Supabase inicialmente
- Documentar credenciais de forma segura
- Preparar plano de upgrade caso necessário

---

## EP-002: Configurar estrutura Next.js com App Router e shadcn/ui

**Tipo:** Task
**Story Points:** 5
**Prioridade:** P0 (Must Have)
**Status:** TODO
**Atribuído a:** Tide Cardoso

### Descrição

Como desenvolvedor, quero ter uma estrutura Next.js 14+ com App Router configurada, TypeScript, Tailwind CSS e componentes iniciais de shadcn/ui para que possa iniciar o desenvolvimento de features.

### Critérios de Aceitação

- [ ] Projeto Next.js 14+ criado com App Router
- [ ] TypeScript configurado e validando corretamente
- [ ] Tailwind CSS integrado com config personalizado
- [ ] shadcn/ui instalado e ao menos 3 componentes base adicionados
- [ ] Estrutura de pastas padrão criada:
  - `app/` (routes)
  - `components/` (componentes reutilizáveis)
  - `lib/` (utilitários)
  - `types/` (tipos TypeScript)
  - `hooks/` (custom hooks)
  - `styles/` (estilos globais)
- [ ] `.eslintrc.json` e `prettier.config.js` configurados
- [ ] Ambiente de desenvolvimento rodando sem warnings

### Tarefas Técnicas

- [ ] Executar `npx create-next-app@latest`
- [ ] Instalar e configurar Tailwind CSS
- [ ] Instalar shadcn/ui CLI
- [ ] Adicionar componentes base (Button, Card, Input, Select)
- [ ] Configurar ESLint com regras strict
- [ ] Configurar Prettier para formatação automática
- [ ] Testar build production `next build`

### Notas

- Usar versão LTS estável do Next.js
- Versão do Node.js: 18+ ou 20+
- Considerar usar monorepo structure se necessário later

---

## EP-003: Implementar schema do banco de dados com migrations

**Tipo:** Task
**Story Points:** 5
**Prioridade:** P0 (Must Have)
**Status:** TODO
**Atribuído a:** Tide Cardoso

### Descrição

Como desenvolvedor, quero ter um schema de banco de dados completo com todas as tabelas, relacionamentos e índices necessários para o MVP, usando migrations SQL para controle de versão.

### Critérios de Aceitação

- [ ] Tabelas criadas:
  - `users` (perfil de usuário do sistema)
  - `profissionais` (dados dos profissionais)
  - `clientes` (dados dos clientes)
  - `contratos` (relacionamento profissional-cliente)
  - `equipamentos` (equipamentos atribuídos)
  - `ferias` (períodos de férias)
  - `auditoria` (log de mudanças)
- [ ] Relacionamentos estabelecidos com Foreign Keys
- [ ] Índices criados para consultas frequentes
- [ ] Constraints de integridade referencial
- [ ] Campos de auditoria em todas as tabelas (created_at, updated_at)
- [ ] Migration SQL versionada e reversível
- [ ] Schema validado sem erros

### Tarefas Técnicas

- [ ] Criar arquivo `001_initial_schema.sql`
- [ ] Definir tipos de dados apropriados para cada coluna
- [ ] Adicionar UUIDs como primary keys
- [ ] Criar índices em foreign keys e campos de busca
- [ ] Adicionar triggers para updated_at
- [ ] Executar migration e validar
- [ ] Documentar diagrama ER

### Notas

- Usar UUIDs v4 como primary keys
- Incluir campos de auditoria em todas as tabelas
- Planejar para extensões futuras
- Documentar cardinality de relacionamentos

---

## EP-004: Implementar autenticação Supabase Auth

**Tipo:** Task
**Story Points:** 8
**Prioridade:** P0 (Must Have)
**Status:** TODO
**Atribuído a:** Tide Cardoso

### Descrição

Como usuário, quero poder fazer login e logout no aplicativo usando email/senha, para que possa acessar meus dados de forma segura.

### Critérios de Aceitação

- [ ] Página de login implementada com formulário
- [ ] Validação de email e senha no frontend
- [ ] Integração com Supabase Auth funcionando
- [ ] Mensagens de erro informativas (email inválido, senha incorreta, etc.)
- [ ] Página de logout funcional
- [ ] Session persistence funcionando (usuário permanece logado ao refresh)
- [ ] Redirect automático para login se não autenticado
- [ ] Testes de autenticação implementados
- [ ] Variables de ambiente Supabase configuradas corretamente

### Tarefas Técnicas

- [ ] Instalar `@supabase/auth-helpers-nextjs` e dependências
- [ ] Criar componente `LoginForm` com validação Zod
- [ ] Implementar `AuthContext` ou usar Supabase provider
- [ ] Criar rota POST `/api/auth/login`
- [ ] Criar rota POST `/api/auth/logout`
- [ ] Implementar middleware de autenticação
- [ ] Criar página `/login` e `/` com redirect
- [ ] Configurar session storage no cliente
- [ ] Adicionar testes unitários e integração

### Notas

- Usar next-auth OU Supabase Auth Helpers (escolher um)
- Implementar refresh token logic
- Considerar 2FA para futuro
- Documentar fluxo de auth para referência

---

## EP-005: Criar script de seed (Excel → Supabase)

**Tipo:** Task
**Story Points:** 8
**Prioridade:** P0 (Must Have)
**Status:** TODO
**Atribuído a:** Tide Cardoso

### Descrição

Como desenvolvedor, quero ter um script que importe dados do arquivo Excel (`CONTROLE_PROFISSIONAIS_GRUPO_ELOPAR.xlsx`) para o Supabase, para que o banco de dados seja populado com dados reais de teste.

### Critérios de Aceitação

- [ ] Script Node.js criado para leitura do Excel
- [ ] Parsing correto das abas (Profissionais, Clientes, Contratos, etc.)
- [ ] Validação de dados antes de inserir
- [ ] Transformação de dados para formato correto
- [ ] Inserção em Supabase com tratamento de erros
- [ ] Modo de execução:
  - [ ] Dry-run (listar o que seria inserido)
  - [ ] Execução real com rollback em caso de erro
- [ ] Log detalhado do processo
- [ ] Relatório final (X registros inseridos, Y erros)
- [ ] Idempotente (pode rodar múltiplas vezes sem duplicatas)

### Tarefas Técnicas

- [ ] Instalar `xlsx` e `node-postgres` (ou `@supabase/supabase-js`)
- [ ] Criar arquivo `scripts/seed.ts` ou `scripts/seed.js`
- [ ] Implementar parsing de Excel com validação
- [ ] Implementar transformação de dados (tipos, datas, etc.)
- [ ] Implementar batch insert para performance
- [ ] Adicionar tratamento de transações
- [ ] Criar arquivo `.env.local` com variáveis necessárias
- [ ] Testar com dados de exemplo

### Notas

- Levantar issues de inconsistência de dados durante seed
- Documentar mapeamento entre Excel e banco
- Criar rollback procedure em caso de problema
- Preservar dados históricos se necessário

---

## EP-006: Implementar layout base (Sidebar, Header, Theme)

**Tipo:** Task
**Story Points:** 5
**Prioridade:** P0 (Must Have)
**Status:** TODO
**Atribuído a:** Tide Cardoso

### Descrição

Como usuário, quero ter um layout visual consistente com sidebar de navegação, header e sistema de temas, para que a aplicação tenha uma identidade visual profissional e seja fácil navegar.

### Critérios de Aceitação

- [ ] Layout principal criado com:
  - [ ] Sidebar com navegação (6-8 itens principais)
  - [ ] Header responsivo com logo e menu do usuário
  - [ ] Footer com informações
  - [ ] Sistema de temas (light/dark mode)
- [ ] Sidebar colapsável em mobile
- [ ] Navegação com active state visual
- [ ] Breadcrumb na página principal
- [ ] Responsividade em devices diferentes
- [ ] Temas aplicados com Tailwind CSS
- [ ] Animações suaves de transição
- [ ] Componentes reutilizáveis criados

### Tarefas Técnicas

- [ ] Criar layout component em `components/Layout.tsx`
- [ ] Implementar Sidebar com links de navegação
- [ ] Criar Header com menu dropdown
- [ ] Implementar theme toggle (light/dark)
- [ ] Usar `next-themes` para persistência de tema
- [ ] Criar componentes: NavLink, Breadcrumb, UserMenu
- [ ] Adicionar ícones com Lucide React
- [ ] Testar responsividade em breakpoints

### Notas

- Coordenar com Design System
- Usar cores do DESIGN_SYSTEM.md
- Preparar para internacionalização (i18n)

---

## EP-007: Configurar Vitest e estrutura de testes

**Tipo:** Task
**Story Points:** 3
**Prioridade:** P0 (Must Have)
**Status:** TODO
**Atribuído a:** Tide Cardoso

### Descrição

Como desenvolvedor, quero ter um framework de testes (Vitest) configurado com estrutura padrão, para que possa escrever testes automatizados desde o início do projeto.

### Critérios de Aceitação

- [ ] Vitest instalado e configurado
- [ ] `vitest.config.ts` criado com configurações corretas
- [ ] Testing library instalado (@testing-library/react)
- [ ] Coverage reporter configurado (mínimo 80%)
- [ ] Testes podem rodar com comando `npm test`
- [ ] Watch mode funcionando
- [ ] CI integration ready (GitHub Actions)
- [ ] Estrutura de pastas padrão para testes criada:
  - `__tests__/` ou `.test.ts` colocado ao lado de cada arquivo

### Tarefas Técnicas

- [ ] Instalar vitest, @testing-library/react, @testing-library/dom
- [ ] Criar `vitest.config.ts` com setup
- [ ] Configurar coverage com nyc ou vitest built-in
- [ ] Criar `tests/setup.ts` para global setup
- [ ] Adicionar scripts no `package.json`:
  - `npm test` - rodar testes
  - `npm run test:watch` - watch mode
  - `npm run test:coverage` - gerar coverage
- [ ] Criar um teste exemplo
- [ ] Documentar estrutura de testes

### Notas

- Usar Vitest em vez de Jest para melhor performance com Vite
- Considerar mocking library para APIs
- Documentar padrões de teste

---

## EP-008: Configurar CI/CD básico (GitHub Actions)

**Tipo:** Task
**Story Points:** 3
**Prioridade:** P1 (Should Have)
**Status:** TODO
**Atribuído a:** Tide Cardoso

### Descrição

Como desenvolvedor, quero ter um pipeline de CI/CD básico com GitHub Actions, para que o código seja automaticamente testado e validado em cada push.

### Critérios de Aceitação

- [ ] Workflow GitHub Actions criado
- [ ] Pipeline executa em cada push para `develop` e PRs
- [ ] Etapas do pipeline:
  - [ ] Checkout do código
  - [ ] Setup Node.js
  - [ ] Install dependencies
  - [ ] Lint (ESLint)
  - [ ] Type check (TypeScript)
  - [ ] Run tests
  - [ ] Build (next build)
- [ ] Notificação de status em PRs
- [ ] Artifacts salvos se necessário
- [ ] Tempo total de execução < 10 minutos
- [ ] Pipeline configurado para rodar em schedule (opcional)

### Tarefas Técnicas

- [ ] Criar arquivo `.github/workflows/ci.yml`
- [ ] Definir trigger events (push, pull_request)
- [ ] Configurar job matrix (opcional para múltiplas versões Node)
- [ ] Usar ações da GitHub community (setup-node, etc.)
- [ ] Adicionar caching para npm packages
- [ ] Configurar status checks em PRs
- [ ] Testar workflow localmente com act (opcional)

### Notas

- Começar com pipeline simples
- Adicionar deploy automation em sprint posterior
- Documentar how to debug CI failures

---

## Resumo da Sprint

| ID | Story | Pts | P | Status |
|---|---|---|---|---|
| EP-001 | Criar projeto Supabase e configurar ambiente | 3 | P0 | TODO |
| EP-002 | Configurar estrutura Next.js com App Router e shadcn/ui | 5 | P0 | TODO |
| EP-003 | Implementar schema do banco de dados com migrations | 5 | P0 | TODO |
| EP-004 | Implementar autenticação Supabase Auth | 8 | P0 | TODO |
| EP-005 | Criar script de seed 