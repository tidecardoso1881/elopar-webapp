# Documentação do Projeto Elopar

Bem-vindo à documentação do projeto **Elopar** - Sistema de Gestão de Profissionais para o Grupo Elopar.

## Estrutura da Documentação

A documentação está organizada em 6 categorias principais:

### 00-projeto - Especificação e Design
Contém a especificação completa do projeto, decisões de design e brainstorming inicial.

- **[ESPECIFICACAO_PROJETO_v2.md](./00-projeto/ESPECIFICACAO_PROJETO_v2.md)** - Especificação técnica e funcional completa do MVP
- **[DESIGN_REVIEW.md](./00-projeto/DESIGN_REVIEW.md)** - Documento de design review com UX/UI
- **[Spec_Brainstorm.md](./00-projeto/Spec_Brainstorm.md)** - Especificação legada v1 (referência histórica)

### 01-arquitetura - Arquitetura e Design System
Documentação técnica da arquitetura do sistema e guia de design.

- **[ARQUITETURA_SISTEMA.html](./01-arquitetura/ARQUITETURA_SISTEMA.html)** - Diagrama e descrição da arquitetura completa (Next.js, Supabase, shadcn/ui)
- **[DESIGN_SYSTEM.md](./01-arquitetura/DESIGN_SYSTEM.md)** - Guia de componentes, cores, tipografia e padrões

### 02-dados - Dados e Controle
Arquivos relacionados a dados brutos e controle.

- **[CONTROLE_PROFISSIONAIS_GRUPO_ELOPAR.xlsx](./02-dados/CONTROLE_PROFISSIONAIS_GRUPO_ELOPAR.xlsx)** - Planilha Excel com dados atuais de profissionais (dados de seed)

### 03-testes - Testes e QA
Documentação de estratégia e planos de teste.

- **[PLANO_TESTES.md](./03-testes/PLANO_TESTES.md)** - Plano abrangente de testes (unitários, integração, E2E, acessibilidade)

### 04-sprints - Planejamento de Sprints
Planejamento detalhado de cada sprint do projeto.

Cada sprint contém:
- **SPRINT_PLANNING.md** - Objetivo, cronograma, capacidade e riscos da sprint
- **SPRINT_BACKLOG.md** - User stories detalhadas com critérios de aceitação

**Sprints:**
- [Sprint 1 (Semanas 1-2)](./04-sprints/sprint-1/) - Fundação e Setup
  - Infraestrutura, autenticação, banco de dados, testes

- [Sprint 2 (Semanas 3-4)](./04-sprints/sprint-2/) - MVP Read-only
  - Dashboard, listagem de profissionais, gráficos

- [Sprint 3 (Semanas 5-6)](./04-sprints/sprint-3/) - Visões e Alertas
  - Visão por cliente, sistema de alertas de renovação

- [Sprint 4 (Semanas 7-8)](./04-sprints/sprint-4/) - Módulos Complementares
  - Equipamentos, férias, responsividade mobile, performance

- [Sprint 5 (Semanas 9-10)](./04-sprints/sprint-5/) - CRUD
  - Criar, editar, deletar profissionais e clientes

- [Sprint 6 (Semanas 11-12)](./04-sprints/sprint-6/) - Features Avançadas e Launch
  - Export, relatórios, email, documentação, produção

**Total:** 242 story points em 6 sprints (12 semanas)

### 05-gestao - Gestão do Projeto
Documentação de gestão, execução e decisões do projeto.

- **[STATUS_REPORT.md](./05-gestao/STATUS_REPORT.md)** - Relatório de status atual do projeto
- **[PLANO_EXECUCAO.md](./05-gestao/PLANO_EXECUCAO.md)** - Plano de execução com timeline, milestones e riscos
- **[DECISION_LOG.md](./05-gestao/DECISION_LOG.md)** - Registro de decisões arquiteturais e produtorias

---

## Informações do Projeto

**Nome:** Elopar - Sistema de Gestão de Profissionais
**Tipo:** Web App (MVP Read-only → CRUD completo)
**Duração:** 12 semanas (7 de abril - 29 de junho de 2026)
**Equipe:** Tide Cardoso (Dev Fullstack) + Orquestrador
**Status:** Planejamento Completo (Sprint 0)

### Stack Tecnológico

- **Frontend:** Next.js 14+ (App Router), React 18+, TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Backend:** Supabase (PostgreSQL, Auth, Edge Functions)
- **Testing:** Vitest, React Testing Library, Playwright
- **Deployment:** Vercel
- **Comunicação:** GitHub, Discord/Slack

---

## Como Usar Esta Documentação

1. **Para Desenvolvedores:**
   - Leia [ARQUITETURA_SISTEMA.html](./01-arquitetura/ARQUITETURA_SISTEMA.html) para entender a estrutura
   - Consulte [DESIGN_SYSTEM.md](./01-arquitetura/DESIGN_SYSTEM.md) para componentes e padrões
   - Acompanhe a sprint atual em `04-sprints/sprint-X/`
   - Veja [PLANO_TESTES.md](./03-testes/PLANO_TESTES.md) para estratégia de testes

2. **Para Gerentes/PMs:**
   - Leia [PLANO_EXECUCAO.md](./05-gestao/PLANO_EXECUCAO.md) para timeline e milestones
   - Verifique [STATUS_REPORT.md](./05-gestao/STATUS_REPORT.md) para status atual
   - Consulte [DECISION_LOG.md](./05-gestao/DECISION_LOG.md) para decisões passadas
   - Acompanhe sprints em `04-sprints/sprint-X/SPRINT_PLANNING.md`

3. **Para Usuários Finais:**
   - Consulte documentação de deploy (Sprint 6, EP-044)
   - Leia manual do usuário (Sprint 6, EP-044)
   - Entre em contato com suporte via email ou Discord

4. **Para QA/Testers:**
   - Leia [PLANO_TESTES.md](./03-testes/PLANO_TESTES.md) para estratégia completa
   - Acompanhe cenários de teste por sprint
   - Utilize dados de seed em `02-dados/`

---

## Decisões Principais

As seguintes decisões arquiteturais foram tomadas:

| Decisão | Justificativa | Documento |
|---|---|---|
| Next.js 14+ App Router | Melhor performance, SSR, API routes | ARQUITETURA_SISTEMA.html |
| Supabase + PostgreSQL | Backend escalável, auth integrado, open source | ARQUITETURA_SISTEMA.html |
| shadcn/ui + Tailwind | Componentes acessíveis, customizáveis, lightweight | DESIGN_SYSTEM.md |
| Vitest + Testing Library | Setup rápido, bom para React, ótima performance | PLANO_TESTES.md |
| Vercel para deployment | Deploy automático, zero-config, CI/CD integrado | PLANO_EXECUCAO.md |

Para decisões adicionais, veja [DECISION_LOG.md](./05-gestao/DECISION_LOG.md).

---

## Contatos e Comunicação

- **Product Manager/Orchestrator:** Responsável por aprovações
- **Lead Developer:** Tide Cardoso (@tide)
- **Comunicação:** Discord #elopar-dev, GitHub Issues
- **Daily Standup:** 09:30 UTC-3 (todos os dias úteis)
- **Sprint Meetings:** Conforme PLANO_EXECUCAO.md

---

## Histórico de Atualizações

- **5 de abril de 2026** - Documentação inicial criada, planejamento completo de 6 sprints
- **Próxima atualização:** 20 de abril de 2026 (Sprint 1 Review)

---

## Links Úteis

- **GitHub:** [elopar-webapp](https://github.com/user/elopar-webapp)
- **Supabase Dashboard:** [Link do projeto Supabase]
- **Vercel Dashboard:** [Link do deployment Vercel]
- **Design Figma:** [Link do ar