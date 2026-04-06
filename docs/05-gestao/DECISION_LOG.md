# Decision Log - Elopar

Registro de todas as decisões arquiteturais, técnicas e de produto tomadas durante o projeto Elopar.

---

## D-001: Stack Tecnológico Principal

**Data:** 15 de março de 2026
**Decisão:** Usar Next.js 14+ (App Router) + React 18 + TypeScript para frontend
**Alternativas Consideradas:**
- Nuxt 3 (Vue)
- Svelte + SvelteKit
- Remix

**Justificativa:**
- Next.js é padrão atual para React applications
- App Router oferece melhor performance com Server Components
- TypeScript garante type safety
- Ecossistema maduro e bem documentado
- Tide já tem experiência com Next.js
- Vercel (makers do Next.js) oferece deploy gratuito

**Status:** ✅ Aprovada e Implementada
**Impacto:** Alto (define toda a stack frontend)

---

## D-002: Backend - Supabase PostgreSQL

**Data:** 15 de março de 2026
**Decisão:** Usar Supabase como backend (PostgreSQL + Auth + Edge Functions)
**Alternativas Consideradas:**
- Firebase
- AWS Amplify
- Node.js custom com PlanetScale
- Prisma Cloud

**Justificativa:**
- PostgreSQL é mais robusto que Firebase
- Auth integrado (Supabase Auth)
- Edge Functions para serverless
- Row Level Security (RLS) nativa
- Open source (não vendor lock-in puro)
- Free tier adequado para MVP
- Melhor para dados estruturados e relatórios
- Suporte a migrations SQL versionadas

**Status:** ✅ Aprovada e Implementada
**Impacto:** Alto (define estrutura de dados)

---

## D-003: Styling - Tailwind CSS + shadcn/ui

**Data:** 20 de março de 2026
**Decisão:** Usar Tailwind CSS para estilos + shadcn/ui para componentes
**Alternativas Consideradas:**
- Material-UI (MUI)
- Chakra UI
- Styled Components + Custom CSS
- Bootstrap

**Justificativa:**
- Tailwind: utility-first, menor bundle, rápido de desenvolver
- shadcn/ui: componentes acessíveis (Radix UI), customizáveis
- Ambos funcionam bem em produção
- Design System pode ser customizado facilmente
- Comunidade ativa

**Status:** ✅ Aprovada e Implementada
**Impacto:** Alto (define visual da aplicação)

---

## D-004: Testing Framework - Vitest

**Data:** 20 de março de 2026
**Decisão:** Usar Vitest para unit/integration tests em vez de Jest
**Alternativas Consideradas:**
- Jest
- Mocha + Chai
- Native Node.js test runner

**Justificativa:**
- Vitest é mais rápido (built-in ESM, threads)
- Melhor integração com Vite/Next.js
- Drop-in replacement para Jest (sintaxe compatível)
- Menos configuração
- UI dashboard integrada

**Status:** ✅ Aprovada e Implementada
**Impacto:** Médio (afeta processo de teste)

---

## D-005: E2E Testing - Playwright

**Data:** 25 de março de 2026
**Decisão:** Usar Playwright para testes E2E
**Alternativas Consideradas:**
- Cypress
- Selenium
- Puppeteer

**Justificativa:**
- Suporte a múltiplos browsers (Chrome, Firefox, Safari)
- Melhor performance que Cypress
- Comunidade crescente
- Bom para CI/CD
- Fixture system robusto

**Status:** ✅ Aprovada e Implementada
**Impacto:** Médio (afeta testes E2E)

---

## D-006: Deployment - Vercel

**Data:** 25 de março de 2026
**Decisão:** Usar Vercel para deployment de produção
**Alternativas Consideradas:**
- AWS Amplify
- Netlify
- DigitalOcean App Platform
- Railway
- Heroku

**Justificativa:**
- Feito pelos criadores do Next.js
- Zero-config deployment
- CI/CD integrado (GitHub Actions automático)
- Instant rollback
- Preview deployments
- Monitoramento integrado
- Free tier adequado para MVP
- Melhor performance em Edge

**Status:** ✅ Aprovada e Implementada
**Impacto:** Alto (define operações)

---

## D-007: Database Migrations - SQL Versionado

**Data:** 1 de abril de 2026
**Decisão:** Usar migrations SQL versionadas em vez de ORM migrations
**Alternativas Consideradas:**
- Prisma migrations
- TypeORM migrations
- Manual SQL + version control

**Justificativa:**
- Mais controle sobre schema
- Funciona melhor com Supabase
- Facilita data migrations complexas
- SQL é agnóstico
- Melhor para auditoria

**Status:** ✅ Aprovada e Implementada
**Impacto:** Alto (afeta estrutura de dados)

---

## D-008: Armazenamento de Sessão - Supabase Auth

**Data:** 1 de abril de 2026
**Decisão:** Usar Supabase Auth com Auth Helpers para gerenciar sessões
**Alternativas Consideradas:**
- next-auth (NextAuth.js)
- JWT puro + refresh token manual
- Firebase Auth

**Justificativa:**
- Integrado com Supabase (mesma DB)
- Auth Helpers para Next.js
- Suporta social login (futuro)
- RLS usa same user_id
- Simples de implementar

**Status:** ✅ Aprovada e Implementada
**Impacto:** Alto (afeta segurança)

---

## D-009: Soft Delete vs Hard Delete

**Data:** 2 de abril de 2026
**Decisão:** Usar soft delete (marcar como inativo/deleted_at) em tabelas de profissionais e clientes
**Alternativas Consideradas:**
- Hard delete (remover totalmente)
- Manter ambas opções

**Justificativa:**
- Melhor para auditoria (histórico)
- Evita erro de deleção acidental
- Mantém integridade de relatórios históricos
- Permite "undelete"
- Padrão em sistemas de gestão

**Status:** ✅ Aprovada e Implementada
**Impacto:** Médio (afeta integridade)

---

## D-010: Architeture - Client vs Server Components

**Data:** 3 de abril de 2026
**Decisão:** Usar Server Components do Next.js 14 como padrão, Client Components apenas onde necessário
**Alternativas Consideradas:**
- Client Components em tudo
- Server Components para tudo (impossível)
- Separar frontend/backend

**Justificativa:**
- Melhor performance (menos JS no cliente)
- Segurança (não expõe dados sensíveis)
- Dados já renderizados no servidor
- Client Components apenas para interatividade

**Status:** ✅ Aprovada e Implementada
**Impacto:** Alto (afeta arquitetura)

---

## D-011: State Management - Sem Redux, apenas Context/Hooks

**Data:** 3 de abril de 2026
**Decisão:** Não usar Redux/Zustand, apenas React Context + hooks para estado local
**Alternativas Consideradas:**
- Redux
- Zustand
- Jotai
- Recoil

**Justificativa:**
- MVP começa simples
- Context + hooks suficiente
- Menos dependências
- Easier debugging
- Pode migrar para Zustand se necessário

**Status:** ✅ Aprovada e Implementada
**Impacto:** Médio (afeta gerenciamento de estado)

---

## D-012: Data Validation - Zod + React Hook Form

**Data:** 3 de abril de 2026
**Decisão:** Usar Zod para schema validation + React Hook Form para form state
**Alternativas Consideradas:**
- Yup
- Joi
- Valibot
- Form library nativa

**Justificativa:**
- Zod: TypeScript-first, validação runtime
- React Hook Form: Lightweight, performance
- Ótima integração (RHF tem hook para Zod)
- Comunidade ativa

**Status:** ✅ Aprovada e Implementada
**Impacto:** Médio (afeta validação)

---

## D-013: Database Naming - Singular vs Plural

**Data:** 4 de abril de 2026
**Decisão:** Usar nomes plurais para tabelas (profissionais, clientes, contratos)
**Alternativas Consideradas:**
- Singular (profissional, cliente, contrato)
- Snake case vs camelCase

**Justificativa:**
- Padrão mais comum em português
- Facilita leitura
- Seguir conveção do Supabase

**Status:** ✅ Aprovada e Implementada
**Impacto:** Baixo (apenas convenção)

---

## D-014: API Route Design - Server Actions vs API Routes

**Data:** 4 de abril de 2026
**Decisão:** Usar Server Actions do Next.js 14 para operações de dados (CRUD)
**Alternativas Consideradas:**
- API Routes tradicionais
- GraphQL
- REST API separada

**Justificativa:**
- Server Actions: Tipo-safe, simples, menos boilerplate
- Funciona bem com formulários (Supabase via RPC)
- Pode ser migrado para API Routes depois se necessário
- Type-safe sem geração de tipos

**Status:** ✅ Aprovada e Implementada
**Impacto:** Médio (afeta como dados são gerenciados)

---

## D-015: Caching Strategy - Usar Supabase Real-time (futuro)

**Data:** 4 de abril de 2026
**Decisão:** MVP sem real-time, preparar para futuro com Supabase Realtime
**Alternativas Consideradas:**
- Implementar real-time desde início
- Polling simples
- WebSockets custom

**Justificativa:**
- Supabase Realtime integrado
- MVP pode começar com polling ou manual refresh
- Implementar quando scale aumentar
- Menos complexidade inicial

**Status:** ⏳ Planejada para Sprint 2+
**Impacto:** Médio (afeta UX em tempo real)

---

## D-016: Logging Strategy - Supabase Audit + Sentry

**Data:** 4 de abril de 2026
**Decisão:** Implementar audit log em tabela SQL + Sentry para error tracking
**Alternativas Consideradas:**
- Apenas logs em console
- Datadog
- CloudWatch
- Logtail

**Justificativa:**
- Audit log: compliance, rastreabilidade
- Sentry: error tracking em produção
- Ambos têm tier free adequado

**Status:** ✅ Aprovada (Audit em Sprint 6, Sentry setup em Sprint 1)
**Impacto:** Médio (afeta observabilidade)

---

## D-017: Date/Time Handling - UTC no banco, local no frontend

**Data:** 4 de abril de 2026
**Decisão:** Armazenar todas as datas em UTC no Supabase, converter para timezone local (America/Sao_Paulo) no frontend
**Alternativas Consideradas:**
- Armazenar timezone junto com data
- Usar datas locais no banco

**Justificativa:**
- Padrão internacional (UTC)
- Evita problemas de DST
- Frontend pode ajustar conforme locale
- Fácil para analytics

**Status:** ✅ Aprovada e Implementada
**Impacto:** Médio (afeta integridade de dados)

---

## D-018: Email Provider - Decidir em Sprint 6

**Data:** 4 de abril de 2026
**Decisão:** Adiar seleção de email provider até Sprint 6
**Alternativas Consideradas:**
- SendGrid
- Resend
- AWS SES
- Brevo (ex-Sendinblue)

**Justificativa:**
- Não é crítico para MVP inicial
- Mais dados sobre volume ao final
- Pode escolher com melhor informação

**Status:** ⏳ Adiada para Sprint 6 (EP-042)
**Impacto:** Baixo (feature opcional)

---

## D-019: PDF Generation - jsPDF + html2canvas

**Data:** 4 de abril de 2026
**Decisão:** Usar jsPDF com html2canvas para gerar PDFs de relatórios
**Alternativas Consideradas:**
- Puppeteer
- ReportLab (Python backend)
- Serverless PDF service (CloudConvert, etc)

**Justificativa:**
- Funciona no browser (client-side)
- Sem dependência de servidor
- Rápido para MVP
- Pode melhorar em futuro

**Status:** ✅ Aprovada (implementar em Sprint 6)
**Impacto:** Baixo (apenas relatórios)

---

## D-020: Mobile-First Design

**Data:** 4 de abril de 2026
**Decisão:** Implementar design mobile-first, depois otimizar para desktop
**Alternativas Consideradas:**
- Desktop-first
- Desktop e mobile em paralelo

**Justificativa:**
- Sprint 4 foca em mobile responsividade
- Usuários podem estar em campo
- Tailwind facilita mobile-first
- Melhor para performance

**Status:** ✅ Aprovada e Implementada
**Impacto:** Alto (afeta todo design)

---

## D-021: Role-Based Access Control (RBAC) - Não usar em MVP

**Data:** 4 de abril de 2026
**Decisão:** MVP não terá RBAC, apenas autenticação básica (admin only)
**Alternativas Consideradas:**
- Implementar desde início
- Usar Supabase RLS policies

**Justificativa:**
- Simplifica MVP
- Um único gerenciador por enquanto
- Pode implementar em Fase 2
- Supabase RLS pronto para quando necessário

**Status:** ✅ Aprovada (adiada para Fase 2)
**Impacto:** Médio (segurança)

---

## D-022: Data Seed Source - Excel original

**Data:** 4 de abril de 2026
**Decisão:** Usar arquivo Excel original (CONTROLE_PROFISSIONAIS_GRUPO_ELOPAR.xlsx) como source de seed
**Alternativas Consideradas:**
- Manual data entry
- Database import de outro sistema
- Mock data

**Justificativa:**
- Dados já existem em Excel
- Mais rápido que manual entry
- Dados reais para testes
- Valida processo de importação

**Status:** ✅ Aprovada e Implementada
**Impacto:** Médio (afeta qualidade de dados)

---

## D-023: Search - Full-Text Search vs LIKE

**Data:** 4 de abril de 2026
**Decisão:** Começar com ILIKE simples em Sprint 2, pode evoluir para full-text search se necessário
**Alternativas Consideradas:**
- Full-text search Supabase desde início
- Elasticsearch
- Algoritmo customizado

**Justificativa:**
- ILIKE suficiente para MVP
- Implementação rápida
- Performance adequada para 10k registros
- Pode escalar depois

**Status:** ✅ Aprovada (implementar simples em Sprint 2)
**Impacto:** Baixo (feature UX)

---

## D-024: Graph/Chart Library - Recharts (decisão adiada para Sprint 2)

**Data:** 4 de abril de 2026
**Decisão:** Avaliar e escolher Recharts OU Chart.js na primeira daily de Sprint 2
**Alternativas Consideradas:**
- Recharts (React, bem mantido)
- Chart.js (leve, popular)
- Victory (Formidable)
- Nivo (mais completo)

**Justificativa:**
- Decisão não é crítica agora
- Implementação é semelhante
- Pode decidir com mais informação em Sprint 2

**Status:** ⏳ Adiada para Sprint 2 (Daily de planejamento)
**Impacto:** Médio (afeta gráficos)

---

## D-025: Pagination - Server-side pagination

**Data:** 4 de abril de 2026
**Decisão:** Implementar server-side pagination com offset/limit no Supabase
**Alternativas Consideradas:**
- Cursor-based pagination
- Cliente-side pagination (load all)
- Virtual scrolling

**Justificativa:**
- Simples de implementar
- Funciona bem para MVP
- Pode escalar
- Melhor que load-all para performance

**Status:** ✅ Aprovada (implementar em Sprint 2)
**Impacto:** Médio (performance)

---

## D-026: Calendar Library - Decidir em Sprint 4

**Data:** 4 de abril de 2026
**Decisão:** Adiar seleção de library de calendário até Sprint 4
**Alternativas Consideradas:**
- react-big-calendar
- react-calendar
- full-calendar.io
- date-fns + custom

**Justificativa:**
- Não é crítico para Sprints 1-3
- Pode escolher com melhor informação

**Status:** ⏳ Adiada para Sprint 4 (EP-026)
**Impacto:** Médio (feature específica)

---

## D-027: Monitoring e Observability

**Data:** 4 de abril de 2026
**Decisão:** Usar Vercel built-in monitoring + Sentry para errors, adicionar mais em Fase 2
**Alternativas Consideradas:**
- DataDog
- New Relic
- Self-hosted ELK

**Justificativa:**
- Vercel já fornece métricas básicas
- Sentry para error tracking gratuito
- Suficiente para MVP
- Pode expandir se necessário

**Status:** ✅ Aprovada (setup em Sprint 1)
**Impacto:** Médio (observabilidade)

---

## D-028: Documentation Tool

**Data:** 4 de abril de 2026
**Decisão:** Usar Markdown + GitHub Wiki para documentação
**Alternativas Consideradas:**
- Confluence
- Notion
- MkDocs
- GitBook

**Justificativa:**
- Markdown é universal
- Versionável no GitHub
- Sem custo
- Fácil de manter

**Status:** ✅ Aprovada e Implementada
**Impacto:** Baixo (apenas processo)

---

## D-029: Version Control - Trunk-Based Development

**Data:** 4 de abril de 2026
**Decisão:** Usar branching simples: main (production) + develop (staging) + feature branches
**Alternativas Consideradas:**
- Git Flow (complexo demais para MVP)
- Trunk-based (commit direto a main)

**Justificativa:**
- Simples para equipe pequena
- main sempre production-ready
- develop para testing
- Feature branches para trabalho em progresso

**Status:** ✅ Aprovada e Implementada
**Impacto:** Médio (processo de desenvolvimento)

---

## D-030: Type Safety - TypeScript Strict Mode

**Data:** 4 de abril de 2026
**Decisão:** Usar TypeScript strict: true para máxima type safety
**Alternativas Consideradas:**
- TypeScript strict: false
- Sem TypeScript

**Justificativa:**
- Mais erros caught no compile time
- Menos bugs em runtime
- Melhor documentação
- MVP pequeno, pode ser strict

**Status:** ✅ Aprovada e Implementada
**Impacto:** Médio (qualidade de código)

---

## Sumário de Decisões

### Status das Decisões

- ✅ Aprovadas e Implementadas: 20
- ⏳ Planejadas (futuro): 5
- 🔄 Em Discussão: 0

### Decisões por Categoria

**Arquitetura (7)**
- D-001: Stack Tecnológico
- D-002: Backend (Supabase)
- D-010: Client vs Server Components
- D-011: State Management
- D-014: API Route Design
- D-028: Documentation Tool
- D-029: Version Control

**Frontend (8)**
- D-003: Tailwind CSS + shadcn/ui
- D-012: Zod + React Hook Form
- D-013: Database Naming
- D-020: Mobile-First Design
- D-024: Chart Library (adiada)
- D-026: Calendar Library (adiada)
- D-027: Monitoring (parcial)

**Testing & Quality (3)**
- D-004: Vitest
- D-005: Playwright
- D-030: TypeScript Strict

**Data & Operations (7)**
- D-006: Vercel Deployment
- D-007: SQL Migrations
- D-008: Supabase Auth
- D-009: Soft Delete
- D-015: Caching (adiada)
- D-016: Logging
- D-017: Date/Time Handling
- D-018: Email Provider (adiada)
- D-019: PDF Gene