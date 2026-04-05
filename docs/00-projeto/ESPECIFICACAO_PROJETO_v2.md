# Especificação de Projeto - Gestão de Profissionais Elopar

**Versão:** 2.0
**Data:** Abril 2026
**Status:** Documento Vivo (Em Desenvolvimento)
**Autor:** Time de Desenvolvimento

---

## Sumário Executivo

Este documento especifica a transformação do sistema de gerenciamento de profissionais do Grupo Elopar, migrando de uma base em planilhas Excel para uma aplicação web moderna e escalável. O projeto utilizará tecnologias de ponta (Next.js 16, TypeScript, Tailwind CSS, shadcn/ui e Supabase) para criar uma solução intuitiva que melhore a eficiência operacional dos gestores de projetos.

**Duração Estimada:** 12 semanas (6 sprints de 2 semanas)
**Equipe:** 1-2 desenvolvedores
**Usuários:** 1-5 gestores de projeto
**Investimento:** Moderado (stack de código aberto + SaaS)

---

## 1. VISÃO GERAL DO PROJETO

### 1.1 Sumário Executivo

O Grupo Elopar gerencia atualmente seu portfólio de profissionais através de planilhas Excel distribuídas entre múltiplos clientes (Alelo, Livelo, Veloe, Pede Pronto, Idea Maker, Zamp). Este processo manual gera:

- **Ineficiência:** Múltiplas versões de arquivos, sincronização manual
- **Falta de visibilidade:** Dificuldade em rastrear renovações de contratos
- **Risco de dados:** Perda de histórico, sem controle de acesso
- **Escalabilidade limitada:** Difícil adicionar novos clientes ou profissionais

A solução proposta é uma aplicação web centralizada que:
- Consolida dados de todos os clientes em uma única fonte de verdade
- Fornece alertas de renovação de contratos (30, 60, 90 dias)
- Oferece dashboards e relatórios em tempo real
- Implementa controle de acesso baseado em papéis (RLS)
- Permite futuros desenvolves de CRUD, exportação e integrações

### 1.2 Problema que Resolve

| Problema | Solução |
|----------|---------|
| Dados dispersos em múltiplas planilhas | Banco de dados centralizado (Supabase) |
| Sem rastreamento de renovações | Sistema de alertas + status de renovação |
| Sem histórico de alterações | Timestamps e potencial audit log |
| Acesso descontrolado | Autenticação + RLS por usuário |
| Relatórios manuais | Dashboards interativos com gráficos |
| Dificuldade em buscar informações | Search, filtros e paginação |
| Sem mobile responsivo | Design mobile-first |

### 1.3 Objetivos Principais

**Objetivo Primário:**
- Entregar um MVP read-only funcional em 4 semanas que valide o conceito e a UX

**Objetivos Secundários:**
1. **Consolidação de Dados:** Importar e estruturar dados de 6 clientes (~500 profissionais)
2. **Gestão de Renovações:** Sistema de alertas para renovações pendentes
3. **Visibilidade:** Dashboards com KPIs principais
4. **Escalabilidade:** Arquitetura preparada para CRUD e novos módulos
5. **Qualidade:** 80% de cobertura de testes, CI/CD automatizado

### 1.4 Stack Tecnológico

#### Frontend
- **Next.js 16** - App Router (full-stack framework)
  - *Justificativa:* SSR nativo, otimização automática, API Routes, Server Actions simplificam arquitetura
  - Ideal para aplicações internas com dados em tempo real

- **TypeScript** - Linguagem com tipagem forte
  - *Justificativa:* Reduz bugs, melhora DX, essencial para equipes pequenas
  - Type-safe em todo o stack (frontend + server)

- **Tailwind CSS v4** - Utility-first CSS framework
  - *Justificativa:* Rápido prototipagem, design consistente, bundle otimizado
  - Native CSS com @layer directives (mais eficiente)

- **shadcn/ui** - Componentes React sem dependências
  - *Justificativa:* Copiar-colar componentes, customizáveis, sem overhead de tema
  - Integração nativa com Tailwind CSS

#### Backend & Data
- **Supabase** - Firebase alternativa open-source
  - *Justificativa:*
    - PostgreSQL real (vs Firebase schemaless)
    - Auth nativa com JWT
    - Row Level Security (RLS) para multi-tenancy simples
    - Real-time subscriptions
    - Sem servidor backend separado necessário
  - Alternativa: Neon + Prisma (mais controle, mais complexo)

#### Ferramentas & DevOps
- **GitHub** - Versionamento + CI/CD
- **Vercel** - Deployment automático de Next.js
- **Vitest** - Testing framework (mais rápido que Jest)
- **Playwright** - E2E testing
- **Supabase Local** - Desenvolvimento offline
- **ESLint + Prettier** - Code quality
- **Husky + lint-staged** - Pre-commit hooks

#### Justificativa de Stack
- **Coesão:** Todas as ferramentas trabalham bem juntas (Next.js + Vercel, Tailwind + shadcn, Supabase RLS)
- **Produtividade:** Menos boilerplate, mais features de negócio
- **Curva de aprendizado:** Documentação excelente, comunidade grande
- **Custo:** 80% open-source, Vercel/Supabase com tier gratuito/barato
- **Manutenção:** Stack moderno, suporte contínuo

---

## 2. ARQUITETURA TÉCNICA

### 2.1 Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────────────────────┐
│                          CAMADA DE CLIENTE                          │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ Next.js 16 (App Router)                                      │   │
│  │ ├─ Components React (shadcn/ui + Tailwind CSS)              │   │
│  │ ├─ Server Components (rendering no servidor)                │   │
│  │ ├─ Client Components (interatividade)                       │   │
│  │ └─ Hooks customizados (useAuth, useFilters, etc)           │   │
│  └──────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                  ↕
┌─────────────────────────────────────────────────────────────────────┐
│                        CAMADA DE NEGÓCIO                            │
│  ┌──────────────────────┬──────────────────────────────────────┐   │
│  │   Server Actions     │      API Routes (opcional)           │   │
│  │  (formulários,       │  (integrações externas futuras)      │   │
│  │   queries diretas)   │                                       │   │
│  └──────────────────────┴──────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                  ↕
┌─────────────────────────────────────────────────────────────────────┐
│                    CAMADA DE DADOS (SUPABASE)                       │
│  ┌──────────────────┬──────────────────┬──────────────────────┐    │
│  │  PostgreSQL DB   │  Supabase Auth   │  RLS Policies        │    │
│  │  (8 tabelas)     │  (JWT + Session) │  (por user/role)     │    │
│  └──────────────────┴──────────────────┴──────────────────────┘    │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  Realtime Subscriptions (opcional para atualizações)         │   │
│  └──────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.2 Fluxo de Requisição

```
Cliente (Browser)
    ↓
Next.js App Router
    ↓
Server Component / API Route / Server Action
    ↓
Supabase JS Client (Server-side)
    ↓
PostgreSQL + RLS Policies
    ↓
Dados (Response)
    ↓
Serialização JSON
    ↓
Cliente (Re-render)
```

### 2.3 Padrões de Integração Supabase

#### Server-side (Preferred)
```typescript
// src/lib/supabase/server.ts
import { createClient } from '@supabase/supabase-js'

// Cliente com credenciais de servidor (admin)
// Usado em Server Components e Server Actions
export const supabaseServer = createClient(...)
```

#### Client-side (Para autenticação)
```typescript
// src/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

// Cliente anônimo no browser
// Usado para login/logout apenas
export const supabaseClient = createBrowserClient(...)
```

#### RLS Policies
- Não confiamos no cliente para segurança
- RLS garante que usuários veem apenas dados que devem
- Server-side sempre verifica permissões novamente

### 2.4 Estrutura de Pastas

```
elopar-webapp/
├── src/
│   ├── app/                           # Next.js App Router
│   │   ├── (auth)/                    # Grupo de rotas (não afeta URL)
│   │   │   ├── login/
│   │   │   │   ├── page.tsx          # Tela de login
│   │   │   │   └── actions.ts        # Server Actions de auth
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   │
│   │   ├── (dashboard)/               # Rotas autenticadas
│   │   │   ├── layout.tsx            # Layout com sidebar
│   │   │   ├── page.tsx              # Dashboard principal
│   │   │   │
│   │   │   ├── professionals/        # Gestão de profissionais
│   │   │   │   ├── page.tsx          # Lista
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx      # Detalhe individual
│   │   │   │
│   │   │   ├── clients/              # Gestão de clientes
│   │   │   │   ├── page.tsx          # Lista agrupada
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx      # Detalhe cliente
│   │   │   │
│   │   │   ├── renewals/             # Gestão de renovações
│   │   │   │   └── page.tsx          # Status + Alertas
│   │   │   │
│   │   │   ├── equipment/            # Gestão de equipamentos
│   │   │   │   └── page.tsx          # Lista de equipamentos
│   │   │   │
│   │   │   ├── vacations/            # Gestão de férias
│   │   │   │   └── page.tsx          # Calendário + Lista
│   │   │   │
│   │   │   └── settings/             # Configurações (futura)
│   │   │       └── page.tsx
│   │   │
│   │   ├── api/                      # API Routes (se necessário)
│   │   │   └── v1/
│   │   │       ├── seed/             # POST /api/v1/seed
│   │   │       │   └── route.ts      # Importar dados
│   │   │       └── health/
│   │   │           └── route.ts
│   │   │
│   │   ├── error.tsx                 # Error boundary
│   │   ├── layout.tsx                # Root layout
│   │   └── loading.tsx               # Loading skeleton
│   │
│   ├── components/                   # Componentes React reutilizáveis
│   │   ├── ui/                       # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── table.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── sheet.tsx
│   │   │   ├── select.tsx
│   │   │   ├── badge.tsx
│   │   │   └── ... (mais shadcn)
│   │   │
│   │   ├── layout/                   # Layout components
│   │   │   ├── header.tsx            # Top bar com user profile
│   │   │   ├── sidebar.tsx           # Navigation sidebar
│   │   │   ├── footer.tsx
│   │   │   └── mobile-nav.tsx
│   │   │
│   │   ├── dashboard/                # Dashboard-specific
│   │   │   ├── kpi-card.tsx          # Card de métrica
│   │   │   ├── chart-seniority.tsx   # Gráfico seniority
│   │   │   ├── chart-clients.tsx     # Gráfico clientes
│   │   │   └── alerts-widget.tsx     # Widget de alertas
│   │   │
│   │   ├── professionals/            # Profissionais-specific
│   │   │   ├── professionals-table.tsx  # Tabela principal
│   │   │   ├── professional-card.tsx    # Card compacto
│   │   │   ├── filters-toolbar.tsx      # Barra de filtros
│   │   │   ├── search-box.tsx           # Search bar
│   │   │   └── detail-modal.tsx         # Modal de detalhe
│   │   │
│   │   ├── clients/                  # Clientes-specific
│   │   │   ├── client-grid.tsx
│   │   │   ├── client-summary.tsx
│   │   │   └── allocation-chart.tsx
│   │   │
│   │   ├── renewals/                 # Renovações-specific
│   │   │   ├── renewal-table.tsx
│   │   │   ├── renewal-status-badge.tsx
│   │   │   └── renewal-timeline.tsx
│   │   │
│   │   └── common/
│   │       ├── data-table.tsx        # Tabela reutilizável com sort/filter
│   │       ├── pagination.tsx        # Paginação
│   │       ├── loading-skeleton.tsx
│   │       └── empty-state.tsx
│   │
│   ├── lib/                          # Utilitários e configuração
│   │   ├── supabase/
│   │   │   ├── client.ts             # Cliente browser (auth)
│   │   │   ├── server.ts             # Cliente servidor (admin)
│   │   │   ├── middleware.ts         # Middleware de auth
│   │   │   └── rls-policies.sql      # SQL de RLS
│   │   │
│   │   ├── utils/
│   │   │   ├── format.ts             # Formatters (data, moeda, etc)
│   │   │   ├── validators.ts         # Validação de dados
│   │   │   ├── constants.ts          # Constantes (enum values)
│   │   │   └── helpers.ts
│   │   │
│   │   ├── types/
│   │   │   ├── index.ts              # Tipos principais
│   │   │   ├── database.ts           # Auto-gerado pelo Supabase
│   │   │   └── api.ts
│   │   │
│   │   ├── hooks/
│   │   │   ├── useAuth.ts            # Hook de autenticação
│   │   │   ├── useProfessionals.ts   # Hook de profissionais (fetch + estado)
│   │   │   ├── useFilters.ts         # Hook de filtros
│   │   │   └── useMediaQuery.ts      # Hook responsivo
│   │   │
│   │   ├── actions/                  # Server Actions (CRUD, etc)
│   │   │   ├── auth.ts               # Login/logout
│   │   │   ├── professionals.ts      # Fetch profissionais
│   │   │   ├── clients.ts            # Fetch clientes
│   │   │   ├── renewals.ts           # Fetch renovações
│   │   │   └── sync.ts               # Sync com Supabase
│   │   │
│   │   └── config/
│   │       └── site.ts               # Configurações do site
│   │
│   ├── styles/                       # Estilos globais
│   │   └── globals.css               # Tailwind + custom CSS
│   │
│   └── middleware.ts                 # Next.js middleware (auth)
│
├── __tests__/                        # Testes
│   ├── unit/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── utils/
│   ├── integration/
│   │   ├── api/
│   │   └── actions/
│   └── e2e/
│       ├── auth.spec.ts
│       ├── dashboard.spec.ts
│       ├── professionals.spec.ts
│       └── renewals.spec.ts
│
├── docs/                             # Documentação
│   ├── ESPECIFICACAO_PROJETO_v2.md  # Este arquivo
│   ├── SETUP.md
│   ├── API_ROUTES.md
│   └── DATABASE_SCHEMA.md
│
├── scripts/                          # Scripts utilitários
│   ├── seed-data.ts                 # Importar Excel -> Supabase
│   ├── migrations/                  # Migrações banco
│   └── generate-types.ts            # Auto-gerar tipos do DB
│
├── .env.example                      # Variáveis de ambiente
├── .env.local                        # (não commitar)
├── tsconfig.json
├── next.config.js
├── tailwind.config.ts
├── postcss.config.js
├── vitest.config.ts
├── playwright.config.ts
├── package.json
└── README.md
```

### 2.5 Padrões de Comunicação

#### Server Actions (Preferred para CRUD/Mutations)
```typescript
// src/lib/actions/professionals.ts
'use server'

export async function fetchProfessionals(clientId?: string) {
  // Seguro, server-side, sem expor chaves
  const data = await supabaseServer
    .from('professionals')
    .select('*')
    .eq('client_id', clientId)

  return data
}
```

#### API Routes (Para integrações externas)
```typescript
// src/app/api/v1/seed/route.ts
export async function POST(request: Request) {
  // Validar autorização
  // Processar request
  // Retornar response
}
```

---

## 3. MODELO DE DADOS

### 3.1 Diagrama Entidade-Relacionamento

```
┌─────────────────┐
│    profiles     │
├─────────────────┤
│ id (uuid, FK)   │───────────┐
│ full_name       │           │
│ role            │           │ (1:N)
│ created_at      │           │ Cria profissionais
├─────────────────┘           │
                              ↓
┌──────────────────────────────────────┐
│        professionals                 │ (500+ registros)
├──────────────────────────────────────┤
│ id (uuid, PK)                        │
│ os, name, email, manager, profile... │
│ client_id (uuid, FK) ─────────────┐  │
│ created_at, updated_at            │  │
└──────────────────────────────────────┘  │ (N:1)
                                          │
                                          ↓
                                ┌──────────────────┐
                                │     clients      │
                                ├──────────────────┤
                                │ id (uuid, PK)    │
                                │ name             │
                                │ created_at       │
                                └──────────────────┘

┌──────────────────────┐
│ equipment            │
├──────────────────────┤
│ id (uuid, PK)        │
│ professional_name    │ (vinculado por nome)
│ company              │
│ machine_model        │
│ machine_type         │
│ office_package       │
│ software_details     │
│ created_at           │
└──────────────────────┘

┌──────────────────────┐
│ vacations            │
├──────────────────────┤
│ id (uuid, PK)        │
│ client_area          │
│ leadership           │
│ professional_name    │ (vinculado por nome)
│ admission_date       │
│ acquisition_start    │
│ acquisition_end      │
│ concession_start     │
│ concession_end       │
│ days_balance         │
│ vacation_start       │
│ vacation_end         │
│ bonus_days           │
│ total_days           │
│ created_at           │
└──────────────────────┘
```

### 3.2 Schema SQL (PostgreSQL + Supabase)

#### Tabela: clients

```sql
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT client_name_not_empty CHECK (name <> '')
);

CREATE INDEX idx_clients_name ON clients(name);

-- RLS Policies
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read all clients"
  ON clients
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Only admins can modify clients"
  ON clients
  USING (auth.jwt() ->> 'role' = 'admin');
```

#### Tabela: professionals

```sql
CREATE TYPE seniority_enum AS ENUM (
  'JUNIOR',
  'PLENO',
  'SENIOR',
  'ESPECIALISTA',
  'ESPECIALISTA_I',
  'ESPECIALISTA_II'
);

CREATE TYPE status_enum AS ENUM ('ATIVO', 'DESLIGADO');

CREATE TYPE contract_type_enum AS ENUM (
  'CLT_ESTRATEGICO',
  'CLT_ILATI',
  'PJ'
);

CREATE TABLE professionals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Dados básicos
  os INTEGER,
  name TEXT NOT NULL,
  email TEXT,
  manager TEXT,
  contact TEXT,

  -- Perfil e posição
  profile TEXT,
  position TEXT,
  seniority seniority_enum DEFAULT 'PLENO',
  status status_enum DEFAULT 'ATIVO',
  contract_type contract_type_enum DEFAULT 'CLT_ESTRATEGICO',

  -- Datas
  date_start DATE,
  date_end DATE,
  contract_start DATE,
  contract_end DATE,
  renewal_deadline DATE,

  -- Valores monetários
  hourly_rate NUMERIC(12, 2),
  value_clt NUMERIC(12, 2) DEFAULT 0,
  value_strategic NUMERIC(12, 2) DEFAULT 0,
  hours_worked INTEGER DEFAULT 0,
  payment_value NUMERIC(12, 2) DEFAULT 0,
  other_values NUMERIC(12, 2) DEFAULT 0,
  billing_rate NUMERIC(12, 2) DEFAULT 0,
  renewal_billing NUMERIC(12, 2) DEFAULT 0,
  total_billing NUMERIC(12, 2) DEFAULT 0,

  -- Relacionamentos
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,

  -- Auditoria
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),

  CONSTRAINT name_not_empty CHECK (name <> ''),
  CONSTRAINT valid_dates CHECK (date_start <= date_end OR date_end IS NULL),
  CONSTRAINT valid_contract_dates CHECK (contract_start <= contract_end OR contract_end IS NULL)
);

-- Índices para performance
CREATE INDEX idx_professionals_client_id ON professionals(client_id);
CREATE INDEX idx_professionals_status ON professionals(status);
CREATE INDEX idx_professionals_contract_type ON professionals(contract_type);
CREATE INDEX idx_professionals_seniority ON professionals(seniority);
CREATE INDEX idx_professionals_renewal_deadline ON professionals(renewal_deadline);
CREATE INDEX idx_professionals_name ON professionals USING GIN(name gin_trgm_ops); -- Text search

-- RLS Policies
ALTER TABLE professionals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read all professionals"
  ON professionals
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Only admins can insert professionals"
  ON professionals
  FOR INSERT
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Only admins can update professionals"
  ON professionals
  FOR UPDATE
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Only admins can delete professionals"
  ON professionals
  FOR DELETE
  USING (auth.jwt() ->> 'role' = 'admin');
```

#### Tabela: equipment

```sql
CREATE TABLE equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  professional_name TEXT NOT NULL,
  company TEXT NOT NULL,
  machine_model TEXT,
  machine_type TEXT,
  office_package BOOLEAN DEFAULT FALSE,
  software_details TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT professional_name_not_empty CHECK (professional_name <> ''),
  CONSTRAINT company_not_empty CHECK (company <> '')
);

-- Índices
CREATE INDEX idx_equipment_professional_name ON equipment(professional_name);
CREATE INDEX idx_equipment_company ON equipment(company);

-- RLS Policies
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read all equipment"
  ON equipment
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Only admins can modify equipment"
  ON equipment
  USING (auth.jwt() ->> 'role' = 'admin');
```

#### Tabela: vacations

```sql
CREATE TABLE vacations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  client_area TEXT NOT NULL,
  leadership TEXT,
  professional_name TEXT NOT NULL,

  admission_date DATE,
  acquisition_start DATE,
  acquisition_end DATE,
  concession_start DATE,
  concession_end DATE,

  days_balance INTEGER DEFAULT 0,
  vacation_start DATE,
  vacation_end DATE,
  bonus_days INTEGER DEFAULT 0,
  total_days INTEGER DEFAULT 0,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT area_not_empty CHECK (client_area <> ''),
  CONSTRAINT professional_name_not_empty CHECK (professional_name <> ''),
  CONSTRAINT valid_acquisition_dates CHECK (acquisition_start <= acquisition_end OR acquisition_end IS NULL),
  CONSTRAINT valid_concession_dates CHECK (concession_start <= concession_end OR concession_end IS NULL),
  CONSTRAINT valid_vacation_dates CHECK (vacation_start <= vacation_end OR vacation_end IS NULL)
);

-- Índices
CREATE INDEX idx_vacations_professional_name ON vacations(professional_name);
CREATE INDEX idx_vacations_client_area ON vacations(client_area);
CREATE INDEX idx_vacations_vacation_start ON vacations(vacation_start);

-- RLS Policies
ALTER TABLE vacations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read all vacations"
  ON vacations
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Only admins can modify vacations"
  ON vacations
  USING (auth.jwt() ->> 'role' = 'admin');
```

#### Tabela: profiles (Usuários)

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  full_name TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'MANAGER',

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT full_name_not_empty CHECK (full_name <> ''),
  CONSTRAINT valid_role CHECK (role IN ('ADMIN', 'MANAGER'))
);

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles"
  ON profiles
  FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Only admins can insert/delete profiles"
  ON profiles
  USING (auth.jwt() ->> 'role' = 'admin');
```

#### Tabela: audit_logs (Futuro)

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  action TEXT NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
  old_values JSONB,
  new_values JSONB,
  user_id UUID REFERENCES auth.users(id),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT action_valid CHECK (action IN ('INSERT', 'UPDATE', 'DELETE'))
);

CREATE INDEX idx_audit_logs_table_record ON audit_logs(table_name, record_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- Trigger para auto-populate (futura implementação)
```

### 3.3 Tipos TypeScript (Auto-gerado)

```typescript
// src/lib/types/database.ts
// Auto-gerado usando: npx supabase gen types typescript --local > src/lib/types/database.ts

export type Database = {
  public: {
    Tables: {
      clients: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          updated_at?: string
        }
      }
      professionals: {
        Row: {
          id: string
          os: number | null
          name: string
          email: string | null
          manager: string | null
          contact: string | null
          profile: string | null
          position: string | null
          seniority: 'JUNIOR' | 'PLENO' | 'SENIOR' | 'ESPECIALISTA'
          status: 'ATIVO' | 'DESLIGADO'
          contract_type: 'CLT_ESTRATEGICO' | 'CLT_ILATI' | 'PJ'
          date_start: string | null
          date_end: string | null
          contract_start: string | null
          contract_end: string | null
          renewal_deadline: string | null
          hourly_rate: number | null
          value_clt: number
          value_strategic: number
          hours_worked: number
          payment_value: number
          other_values: number
          billing_rate: number
          renewal_billing: number
          total_billing: number
          client_id: string
          created_at: string
          updated_at: string
          created_by: string | null
        }
        Insert: Omit<professionals['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<professionals['Insert']>
      }
      // ... outras tabelas
    }
  }
}

// Tipos customizados
export type Professional = Database['public']['Tables']['professionals']['Row']
export type Client = Database['public']['Tables']['clients']['Row']
export type Equipment = Database['public']['Tables']['equipment']['Row']
export type Vacation = Database['public']['Tables']['vacations']['Row']
export type UserProfile = Database['public']['Tables']['profiles']['Row']
```

---

## 4. FUNCIONALIDADES DETALHADAS

### 4.1 Autenticação e Autorização

#### US-001: Login com Email/Senha
**Usuário Story:**
```
Como gestor de projeto,
Quero fazer login na plataforma com email e senha,
Para acessar os dados dos profissionais
```

**Critérios de Aceitação:**
- [ ] Tela de login renderiza corretamente
- [ ] Login com credenciais válidas redireciona para dashboard
- [ ] Erro com credenciais inválidas mostra mensagem
- [ ] Sessão persiste ao recarregar página
- [ ] Logout limpa sessão e redireciona para login
- [ ] Link de "Esqueci senha" funciona (futura implementação)

**Componentes UI Necessários:**
- `LoginForm` component com inputs para email/password
- `Button` para submit
- `Alert` para erros

**Server Actions:**
```typescript
export async function login(email: string, password: string)
export async function logout()
```

**Data Required:**
- Users do Supabase Auth (criar 1-5 contas)

**Definição de Pronto:**
- [ ] Testes E2E de login passando
- [ ] Credenciais seguras (nunca em logs)
- [ ] Rate limiting implementado (futura)

---

#### US-002: Middleware de Autenticação
**Objetivo:** Proteger rotas autenticadas, redirecionar não autenticados para login

**Implementação:**
```typescript
// src/middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const supabase = createServerClient(...)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next|api|login|register|static).*)',
  ],
}
```

---

### 4.2 Dashboard Principal

#### US-003: Dashboard com KPIs
**Usuário Story:**
```
Como gestor,
Quero ver métricas chave ao abrir a plataforma,
Para ter visão rápida do status dos profissionais
```

**Critérios de Aceitação:**
- [ ] Card: Total de profissionais (ATIVO + DESLIGADO)
- [ ] Card: Profissionais ativos por cliente
- [ ] Card: Renovações vencidas (últimos 30 dias)
- [ ] Card: Renovações pendentes (próximos 30/60/90 dias)
- [ ] Cards carregam < 2 segundos
- [ ] Dados atualizam em tempo real (Supabase real-time)

**Componentes UI:**
```
┌─────────────────────────────────────────────┐
│ Dashboard › Visão Geral                 👤  │
├─────────────────────────────────────────────┤
│                                             │
│  ┌──────────────┬──────────────┬──────────┐ │
│  │ Total: 487   │ Ativos: 312  │ Deslig.: │ │
│  │ Profissionais│ Profissionais│ 175      │ │
│  └──────────────┴──────────────┴──────────┘ │
│                                             │
│  ┌──────────────┬──────────────┬──────────┐ │
│  │ Renovações   │ Renovações   │ Alelo:   │ │
│  │ Vencidas: 12 │ 30 dias: 28  │ 87 prof  │ │
│  └──────────────┴──────────────┴──────────┘ │
│                                             │
│  ┌─────────────────────────────────────────┐ │
│  │ Distribuição por Senioridade            │ │
│  │ ▓▓▓ Junior (45)    Pleno (120)  Senior  │ │
│  │     (180)    Especialista (142)         │ │
│  └─────────────────────────────────────────┘ │
│                                             │
│  ┌─────────────────────────────────────────┐ │
│  │ Profissionais por Cliente               │ │
│  │ Alelo ▓▓▓▓▓▓▓ (87)  Livelo ▓▓▓▓▓▓▓▓▓  │ │
│  │ (143)   Veloe ▓▓▓▓ (76)    Pede Pronto  │ │
│  │ (32)    Idea Maker ▓▓ (92)  Zamp ▓▓ (57) │ │
│  └─────────────────────────────────────────┘ │
│                                             │
└─────────────────────────────────────────────┘
```

**Componentes Necessários:**
- `KPICard` - Card de métrica com número grande
- `ChartSeniority` - Gráfico de barras (recharts)
- `ChartClients` - Gráfico pizza (recharts)
- `AlertsWidget` - Widget de alertas

**Server Actions:**
```typescript
export async function getKPIData()
export async function getRenewalAlerts()
export async function getProfessionalsBySeniority()
export async function getProfessionalsByClient()
```

---

#### US-004: Alertas de Renovação
**Objetivo:** Destaque visual para renovações próximas/vencidas

**Critérios:**
- [ ] Renovações vencidas aparecem em VERMELHO
- [ ] Renovações em 30 dias em AMARELO
- [ ] Renovações em 60+ dias em VERDE
- [ ] Clicável para ir à página de renovações
- [ ] Contagem precisa (query com data)

**Lógica SQL:**
```sql
SELECT
  COUNT(*) FILTER (WHERE renewal_deadline < CURRENT_DATE) as overdue,
  COUNT(*) FILTER (WHERE renewal_deadline BETWEEN CURRENT_DATE AND CURRENT_DATE + 30) as next_30,
  COUNT(*) FILTER (WHERE renewal_deadline BETWEEN CURRENT_DATE + 31 AND CURRENT_DATE + 60) as next_60,
  COUNT(*) FILTER (WHERE renewal_deadline > CURRENT_DATE + 60) as future
FROM professionals
WHERE status = 'ATIVO'
```

---

### 4.3 Gestão de Profissionais

#### US-005: Listar Profissionais com Paginação
**Usuário Story:**
```
Como gestor,
Quero ver uma tabela de todos os profissionais,
Para localizar e visualizar detalhes rapidamente
```

**Critérios de Aceitação:**
- [ ] Tabela carrega com 25 profissionais por padrão
- [ ] Paginação funciona (ir próxima/anterior página)
- [ ] Total de registros exibido (ex: "1-25 de 487")
- [ ] Colunas principais visíveis: Nome, Email, Cliente, Senioridade, Status, Tipo Contrato
- [ ] Títulos de coluna clicáveis para ordenar (futura)
- [ ] Carregamento < 500ms

**Componentes UI:**
```
┌─────────────────────────────────────────────────────────┐
│ Profissionais › Lista                            [🔍] 🔽 │
├─────────────────────────────────────────────────────────┤
│ [Filtros] │ [Cliente ▼] [Status ▼] [Senioridade ▼]     │
├─────────────────────────────────────────────────────────┤
│ Nome          │ Email        │ Cliente │ Senioridade    │
├───────────────┼──────────────┼─────────┼────────────────┤
│ João Silva    │ joao@...     │ Alelo   │ PLENO        ✓ │
│ Maria Santos  │ maria@...    │ Livelo  │ SÊNIOR       ✓ │
│ Pedro Costa   │ pedro@...    │ Veloe   │ JÚNIOR       ✗ │
│ ...           │ ...          │ ...     │ ...            │
├─────────────────────────────────────────────────────────┤
│ 1  2  3  4  5                    [1-25 de 487 registros]│
└─────────────────────────────────────────────────────────┘
```

**Componentes Necessários:**
- `ProfessionalsTable` - Tabela paginada
- `Pagination` - Controles de paginação
- `DataTable` - Tabela reutilizável genérica

**Server Actions:**
```typescript
export async function getProfessionals(
  page: number = 1,
  pageSize: number = 25,
  clientId?: string,
  status?: 'ATIVO' | 'DESLIGADO'
)
```

**Dados:**
- ~500 profissionais no banco

---

#### US-006: Filtrar Profissionais
**Objetivo:** Reduzir lista de 500+ profissionais para subset relevante

**Critérios:**
- [ ] Filtro por Cliente (dropdown multi-select)
- [ ] Filtro por Status (ATIVO / DESLIGADO)
- [ ] Filtro por Senioridade (JUNIOR / PLENO / SENIOR / ESPECIALISTA)
- [ ] Filtro por Tipo Contrato (CLT_ESTRATEGICO / CLT_ILATI / PJ)
- [ ] Filtros são cumulativos (AND logic)
- [ ] Botão "Limpar Filtros"
- [ ] URL updater com query params (para compartilhamento)

**UI:**
```
[Filtros] ◀─────────────────────────────────────────┐
              │ Cliente:       │ Alelo  ☑ Livelo ☐ Veloe ☐ │
              │ Status:        │ Ativo ☑ Deslig ☐ │
              │ Senioridade:   │ Junior Pleno Senio ☑ Espec │
              │ Tipo Contrato: │ CLT Estrat ☑ PJ ☐ │
              └──────────────────────────────────────┘
```

**Componentes:**
- `FiltersToolbar` - Barra com filters
- `Select` (shadcn/ui) - Dropdowns
- `Checkbox` (shadcn/ui) - Multi-select

**Hook:**
```typescript
export function useFilters() {
  const [filters, setFilters] = useState({
    clientId: undefined,
    status: undefined,
    seniority: [],
    contractType: []
  })

  const filteredProfessionals = useMemo(() => {
    // Aplicar lógica de filtro
  }, [professionals, filters])

  return { filters, setFilters, filteredProfessionals }
}
```

---

#### US-007: Buscar Profissional por Nome/Email
**Objetivo:** Localizar profissional específico rapidamente

**Critérios:**
- [ ] Caixa de busca em tempo real (debounced 300ms)
- [ ] Busca por nome (case-insensitive)
- [ ] Busca por email (case-insensitive)
- [ ] Destaca resultado encontrado
- [ ] Mostra "Nenhum resultado" se não encontrado
- [ ] Busca < 200ms (com índice GIN no DB)

**SQL com FTS:**
```sql
SELECT * FROM professionals
WHERE name ILIKE '%' || $1 || '%'
   OR email ILIKE '%' || $1 || '%'
LIMIT 25
```

**Componentes:**
- `SearchBox` - Input com debounce
- `Input` (shadcn/ui)

**Hook:**
```typescript
export function useSearch(query: string) {
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const timer = debounce(async () => {
      const data = await searchProfessionals(query)
      setResults(data)
    }, 300)

    return timer.cancel
  }, [query])

  return { results, isLoading }
}
```

---

#### US-008: Visualizar Detalhe de Profissional
**Usuário Story:**
```
Como gestor,
Quero visualizar detalhes completos de um profissional,
Para analisar informações contratuais e de compensação
```

**Critérios:**
- [ ] Página detail carrega todas as colunas do profissional
- [ ] Informações organizadas em seções (Pessoal, Contrato, Financeiro, Equipamento, Férias)
- [ ] Data formatada em português (DD/MM/YYYY)
- [ ] Valores monetários formatados (R$ 1.234,56)
- [ ] Link para voltar à lista
- [ ] Indicador visual de status (ATIVO = verde, DESLIGADO = cinza)
- [ ] Botão de Editar (futura) / Deletar (futura)

**URL:** `/professionals/[id]`

**Layout:**
```
┌──────────────────────────────────────────────────────┐
│ ◀ Voltar › João Silva (ID: abc123) │ ⋮ Mais          │
├──────────────────────────────────────────────────────┤
│ Status: ✓ ATIVO                                      │
│                                                      │
│ SEÇÃO: Informações Pessoais                         │
│  Nome: João Silva                                    │
│  Email: joao.silva@email.com                        │
│  Contato: (11) 98765-4321                           │
│  Gestor: Maria Santos                                │
│  Perfil: Desenvolvedor Backend                      │
│                                                      │
│ SEÇÃO: Posição e Senioridade                        │
│  Cargo: Desenvolvedor                                │
│  Senioridade: PLENO                                  │
│  Tipo Contrato: CLT ESTRATÉGICO                      │
│  OS #: 2024/001                                     │
│                                                      │
│ SEÇÃO: Datas Contratuais                            │
│  Admissão: 15/01/2022                               │
│  Fim (se houver): -                                  │
│  Vigência Contrato: 01/04/2024 a 31/03/2025        │
│  Prazo Renovação: 15/03/2025                        │
│                                                      │
│ SEÇÃO: Compensação e Faturamento                    │
│  Valor CLT: R$ 8.500,00                             │
│  Valor Estratégico: R$ 2.200,00                     │
│  Horas Trabalhadas: 160                              │
│  Valor Pagamento: R$ 8.500,00                       │
│  Taxa Faturamento: 15%                               │
│  Valor Total Faturamento: R$ 9.775,00                │
│                                                      │
│ SEÇÃO: Equipamento Alocado                          │
│  Máquina: MacBook Pro 16" M1                        │
│  Software: Office, IntelliJ IDEA, Figma             │
│                                                      │
│ SEÇÃO: Férias                                       │
│  Saldo: 12 dias                                      │
│  Próximo período: 01/06/2025                         │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Componentes Necessários:**
- `ProfessionalDetail` - Layout principal
- `Section` - Seção de informações
- `Badge` - Status visual
- `DetailRow` - Par label/valor

**Server Actions:**
```typescript
export async function getProfessionalById(id: string)
export async function getEquipmentByProfessional(name: string)
export async function getVacationByProfessional(name: string)
```

---

### 4.4 Gestão de Clientes

#### US-009: Listar Clientes com Resumo
**Objetivo:** Visualizar alocação e faturamento por cliente

**Critérios:**
- [ ] Grid de cards, um por cliente
- [ ] Card mostra: Nome, Total de profissionais, Ativo/Desligado, Faturamento total
- [ ] Clicável para expandir detalhes
- [ ] Ordenável por nome ou quantidade
- [ ] Carrega < 1 segundo

**Layout:**
```
┌─────────────────────────────────────────────────┐
│ Clientes › Visão Geral                          │
├─────────────────────────────────────────────────┤
│ Filtro: [Todos ▼]    Ordenar: [Nome ▼]         │
│                                                 │
│ ┌──────────────────┐ ┌──────────────────┐      │
│ │ ALELO            │ │ LIVELO           │      │
│ │ 87 Profissionais │ │ 143 Profissionais│     │
│ │ ✓ 72 Ativos      │ │ ✓ 115 Ativos     │     │
│ │ ✗ 15 Desligados  │ │ ✗ 28 Desligados  │     │
│ │ R$ 1.200.000     │ │ R$ 2.100.000     │     │
│ │ Total Faturamento│ │ Total Faturamento│     │
│ └──────────────────┘ └──────────────────┘      │
│                                                 │
│ ┌──────────────────┐ ┌──────────────────┐      │
│ │ VELOE            │ │ PEDE PRONTO      │      │
│ │ 76 Profissionais │ │ 32 Profissionais │     │
│ │ ✓ 65 Ativos      │ │ ✓ 28 Ativos      │     │
│ │ ✗ 11 Desligados  │ │ ✗ 4 Desligados   │     │
│ │ R$ 950.000       │ │ R$ 480.000       │     │
│ │ Total Faturamento│ │ Total Faturamento│     │
│ └──────────────────┘ └──────────────────┘      │
│                                                 │
│ ┌──────────────────┐ ┌──────────────────┐      │
│ │ IDEA MAKER       │ │ ZAMP             │      │
│ │ 92 Profissionais │ │ 57 Profissionais │     │
│ │ ✓ 78 Ativos      │ │ ✓ 45 Ativos      │     │
│ │ ✗ 14 Desligados  │ │ ✗ 12 Desligados  │     │
│ │ R$ 1.450.000     │ │ R$ 680.000       │     │
│ │ Total Faturamento│ │ Total Faturamento│     │
│ └──────────────────┘ └──────────────────┘      │
└─────────────────────────────────────────────────┘
```

**Componentes:**
- `ClientGrid` - Grid de cards
- `ClientCard` - Card individual
- `Select` para ordenação

**Server Actions:**
```typescript
export async function getClientsSummary()
// Retorna: { clientId, name, total, active, inactive, totalBilling }
```

---

#### US-010: Visualizar Detalhes de Cliente
**Objetivo:** Ver todos os profissionais e métricas de um cliente específico

**Critérios:**
- [ ] Filtro de profissionais por cliente
- [ ] Resumo: Total, Ativo, Desligado, Faturamento
- [ ] Tabela de profissionais deste cliente
- [ ] Gráfico de distribuição por senioridade
- [ ] Gráfico de distribuição por contrato
- [ ] Link para voltar aos clientes

**URL:** `/clients/[id]`

---

### 4.5 Gestão de Renovações

#### US-011: Listar Renovações com Status
**Usuário Story:**
```
Como gerente,
Quero visualizar todos as renovações de contratos,
Para priorizar ações de renovação
```

**Critérios:**
- [ ] Tabela com: Professional, Cliente, Prazo Renovação, Status, Dias Restantes
- [ ] Cores por status:
  - Vermelho: Vencido (< 0 dias)
  - Laranja: Crítico (0-7 dias)
  - Amarelo: Aviso (8-30 dias)
  - Verde: Normal (> 30 dias)
- [ ] Ordenado por data (próximo primeiro)
- [ ] Filtro por status / cliente
- [ ] Marcar como "Em Processo" (futura)

**Layout:**
```
┌─────────────────────────────────────────────────┐
│ Renovações › Acompanhamento                 [+] │
├─────────────────────────────────────────────────┤
│ Status: [Todos ▼]  Cliente: [Todos ▼]          │
│                                                 │
│ Professional  │ Cliente │ Prazo      │ Dias  S │
├───────────────┼─────────┼────────────┼─────────┤
│ João Silva    │ Alelo   │ 15/03/25   │ VENCIDO │
│ (vermelho)    │         │            │         │
├───────────────┼─────────┼────────────┼─────────┤
│ Maria Santos  │ Livelo  │ 20/03/25   │ 3 dias  │
│ (laranja)     │         │            │         │
├───────────────┼─────────┼────────────┼─────────┤
│ Pedro Costa   │ Veloe   │ 10/04/25   │ 25 dias │
│ (amarelo)     │         │            │         │
├───────────────┼─────────┼────────────┼─────────┤
│ Ana Oliveira  │ Alelo   │ 15/05/25   │ 40 dias │
│ (verde)       │         │            │         │
└─────────────────────────────────────────────────┘
```

**Componentes:**
- `RenewalsTable` - Tabela com status color
- `RenewalStatusBadge` - Badge com cor + texto
- `RenewalTimeline` (futura) - Timeline visual

**Server Actions:**
```typescript
export async function getRenewals(
  statusFilter?: 'vencido' | 'critico' | 'aviso' | 'normal',
  clientId?: string
)

// Retorna dados com dias_restantes calculado
```

---

### 4.6 Gestão de Equipamento

#### US-012: Listar Equipamento por Profissional
**Objetivo:** Rastrear máquinas e software alocados

**Critérios:**
- [ ] Tabela: Professional, Empresa, Modelo, Tipo, Office, Software
- [ ] Pesquisa por profissional
- [ ] Filtro por tipo (Desktop, Notebook, Celular, etc)
- [ ] Botão de Detalhes
- [ ] Carregamento eficiente

---

### 4.7 Gestão de Férias

#### US-013: Visualizar Saldo de Férias
**Objetivo:** Rastrear saldo e períodos de férias

**Critérios:**
- [ ] Tabela/Calendário de férias
- [ ] Colunas: Professional, Área, Saldo dias, Período Aquisitivo, Período Concessivo
- [ ] Filtro por área
- [ ] Visualização de datas de férias já agendadas
- [ ] Alerta para saldo baixo (< 5 dias)

---

## 5. FLUXO DE USUÁRIO (User Flows)

### 5.1 Fluxo de Autenticação

```
START
  ↓
[Check if logged in]
  ├─ SIM → Go to Dashboard
  └─ NÃO → Show Login Page
            ↓
        [Enter credentials]
            ↓
        [Validate on Supabase]
            ├─ Valid → Set JWT → Redirect to Dashboard
            └─ Invalid → Show error → Stay on Login
                        ↓
                    [Retry or forgot password]
                        ↓
                    [Email reset link]
                        ↓
                    [Reset password]
                        ↓
                    [Login again]
```

### 5.2 Fluxo Principal (Dashboard)

```
[Login]
  ↓
[Dashboard]
  ├─ View KPIs & Alerts
  │   ├─ Click Alert → [Renewals Page]
  │   └─ Back → [Dashboard]
  │
  ├─ Professionals
  │   ├─ View List
  │   ├─ Search/Filter
  │   ├─ Click Professional → [Professional Detail]
  │   │   ├─ View Info
  │   │   ├─ Equipment allocated
  │   │   ├─ Vacation balance
  │   │   └─ Back → [List]
  │   └─ Back → [Dashboard]
  │
  ├─ Clients
  │   ├─ View Client Grid
  │   ├─ Click Client → [Client Detail]
  │   │   ├─ View Summary
  │   │   ├─ View Professionals
  │   │   ├─ View Charts
  │   │   └─ Back → [Grid]
  │   └─ Back → [Dashboard]
  │
  ├─ Renewals
  │   ├─ View Renewals
  │   ├─ Filter by status
  │   ├─ Click Professional → [Professional Detail]
  │   │   └─ See renewal info
  │   └─ Back → [Dashboard]
  │
  ├─ Equipment
  │   ├─ View Equipment List
  │   ├─ Search/Filter
  │   └─ Back → [Dashboard]
  │
  ├─ Vacations
  │   ├─ View Vacation Calendar/Table
  │   ├─ Filter by area
  │   └─ Back → [Dashboard]
  │
  └─ Logout
      ↓
   [Login Page]
```

### 5.3 Fluxo de Busca e Filtro

```
[Professionals List]
  ↓
[Enter search term]
  ↓
[Auto-search results] (< 300ms)
  ├─ Results found → Highlight
  └─ No results → Show empty state
  ↓
[Click filters] (expand panel)
  ├─ Select Client
  ├─ Select Status
  ├─ Select Seniority
  ├─ Select Contract Type
  └─ Click "Apply Filters"
      ↓
      [Results filtered] (URL updated with params)
      ├─ Results found → Show filtered list
      └─ No results → Show empty state
      ↓
      [Click "Clear Filters"]
          ↓
          [Reset to full list]
```

---

## 6. WIREFRAMES (Descrições de Layout)

### 6.1 Página de Login

```
┌────────────────────────────────────────────┐
│                                            │
│                                            │
│              ELOPAR LOGO                   │
│                                            │
│        Gestão de Profissionais              │
│                                            │
│  ┌──────────────────────────────────────┐  │
│  │ Email:                               │  │
│  │ [________________________________]   │  │
│  │                                      │  │
│  │ Senha:                               │  │
│  │ [________________________________]   │  │
│  │                                      │  │
│  │ [Manter conectado?]  [Esqueci senha] │  │
│  │                                      │  │
│  │ ┌──────────────────────────────────┐ │  │
│  │ │       ENTRAR                     │ │  │
│  │ └──────────────────────────────────┘ │  │
│  │                                      │  │
│  │ Sem conta? [Cadastre-se]             │  │
│  └──────────────────────────────────────┘  │
│                                            │
│                                            │
└────────────────────────────────────────────┘
```

### 6.2 Layout Principal (Dashboard)

```
┌──────────────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────────────┐  │
│ │ ELOPAR │ Dashboard │ Profissionais │ Clientes   │  │
│ │ Gestão │                   [🔍] Buscar │ [👤] │ │
│ └─────────────────────────────────────────────────┘  │
├──────────────────────────────────────────────────────┤
│                                                      │
│ ┌─────────────────┐ │ Dashboard › Visão Geral       │
│ │ • Visão Geral   │ │                               │
│ │ • Profissionais │ │ ┌───────────┬───────────┬──┐  │
│ │ • Clientes      │ │ │ Total 487 │ Ativos 312│⋯ │  │
│ │ • Renovações    │ │ └───────────┴───────────┴──┘  │
│ │ • Equipamento   │ │                               │
│ │ • Férias        │ │ [Gráficos e alertas]         │
│ │                 │ │                               │
│ │ ─────────────── │ │ [Widget de renovações]       │
│ │ • Configurações │ │                               │
│ │ • Logout        │ │                               │
│ └─────────────────┘ │                               │
│                     │                               │
│                     └───────────────────────────────┘
│                                                      │
└──────────────────────────────────────────────────────┘
```

### 6.3 Página de Profissionais

```
┌──────────────────────────────────────────────────┐
│ Profissionais › Lista                          │  │
├──────────────────────────────────────────────────┤
│ [🔍 Buscar...] │ [Filtros ▼] │ [Visualizar ▼] │ │
├──────────────────────────────────────────────────┤
│ │ Nome          │ Email       │ Cliente │ Status│
│ ├─────────────┼─────────────┼─────────┼─────────┤
│ │ João Silva  │ joao@...    │ Alelo   │ ✓ ATIVO│
│ │ Maria Snt   │ maria@...   │ Livelo  │ ✓ ATIVO│
│ │ Pedro Costa │ pedro@...   │ Veloe   │ ✗ DESLI│
│ │ ...         │ ...         │ ...     │ ...    │
│ ├─────────────┴─────────────┴─────────┴─────────┤
│ │ ◀ 1  2  3  4  5 [1-25 de 487]            ▶   │
│ └───────────────────────────────────────────────┘
```

### 6.4 Página de Detalhe de Profissional

```
┌──────────────────────────────────────────────────┐
│ ◀ Voltar › João Silva                    ⋮ Editar│
├──────────────────────────────────────────────────┤
│ Status: ✓ ATIVO (Verde)                         │
├──────────────────────────────────────────────────┤
│ INFORMAÇÕES PESSOAIS                            │
│  Nome: João Silva                               │
│  Email: joao.silva@email.com                    │
│  Gestor: Maria Santos                           │
│                                                 │
│ POSIÇÃO E SENIORIDADE                           │
│  Senioridade: PLENO                             │
│  Tipo Contrato: CLT ESTRATÉGICO                │
│                                                 │
│ DATAS CONTRATUAIS                               │
│  Admissão: 15/01/2022                           │
│  Vigência: 01/04/24 a 31/03/25                 │
│  Renovação: 15/03/2025                          │
│                                                 │
│ EQUIPAMENTO ALOCADO                             │
│  MacBook Pro 16" M1                             │
│  Office 365, IntelliJ IDEA                      │
│                                                 │
│ FÉRIAS                                          │
│  Saldo: 12 dias                                 │
│  Próximo período: 01/06/2025                    │
│                                                 │
└──────────────────────────────────────────────────┘
```

---

## 7. REQUISITOS NÃO-FUNCIONAIS

### 7.1 Performance

| Métrica | Requisito | Justificativa |
|---------|-----------|---------------|
| Dashboard load time | < 2s | Primeira impressão, métricas importantes |
| Professionals list load | < 1s | Busca frequente, muitos dados |
| Search response | < 200ms | Esperado em autocomplete |
| Page navigation | < 500ms | Transições suaves |
| Chart rendering | < 300ms | Interatividade |
| Database query | < 100ms | Índices bem desenhados |
| API response | < 300ms | Without network latency |
| Mobile load (3G) | < 4s | Progressive enhancement |

**Estratégia:**
- Server-side rendering (Next.js SSR)
- Índices no PostgreSQL para queries frequentes
- Paginação para listas grandes
- Lazy loading para componentes não-críticos
- Image optimization (next/image)
- Code splitting automático

### 7.2 Segurança

| Aspecto | Medida |
|---------|--------|
| Autenticação | Supabase Auth com JWT |
| Autorização | RLS (Row Level Security) no PostgreSQL |
| HTTPS | Obrigatório (Vercel enforces) |
| CORS | Whitelist apenas domínios permitidos |
| SQL Injection | Prepared statements (Supabase client) |
| XSS | Content Security Policy headers |
| CSRF | SameSite cookies + CSRF tokens |
| Senhas | Never stored client-side, hash no servidor |
| Rate Limiting | Implementar em futura versão |
| Audit Log | Implementar em futura versão |

**RLS Policy Example:**
```sql
-- Users can only see professionals of their company (multi-tenancy)
CREATE POLICY "Users see their company professionals"
  ON professionals
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM company_members WHERE company_id = professionals.company_id
    )
  );
```

### 7.3 Escalabilidade

| Aspecto | Capacidade | Notas |
|---------|-----------|-------|
| Profissionais | 500-5000 | Com índices apropriados |
| Usuários simultâneos | 5-20 | MVP scope |
| Requisições/seg | 10-50 | Supabase tier gratuito aguenta |
| Storage | 5-50 GB | Supabase free: 500 MB, fácil upgrade |
| Conexões DB | 100 | Supabase connection pooling |

**Plano de escalabilidade futura:**
- Paginação em tudo (já implementado)
- Índices adicionais conforme necessário
- Cache com Redis (se performance demandar)
- Database replication (Supabase Professional)

### 7.4 Acessibilidade (WCAG 2.1 AA)

| Critério | Implementação |
|----------|----------------|
| Alt text | Todas as imagens têm alt descriptivo |
| Keyboard navigation | Tab order logico, focus visible |
| Color contrast | Min 4.5:1 para texto, 3:1 para UI |
| Form labels | Label + input com for/id ligados |
| Error messages | Claros, específicos, sem apenas cor |
| ARIA attributes | aria-label, aria-describedby conforme necessário |
| Screen reader | Estrutura semântica correta (nav, main, aside) |
| Responsive text | Min 14px base, escalável com zoom |

**Testes:**
- axe accessibility checker (CI)
- Manual testing com screen reader (NVDA/JAWS)
- Keyboard-only navigation testing

### 7.5 Suporte a Browsers

| Browser | Versão Mínima | Teste |
|---------|---------------|-------|
| Chrome | 90+ | Contínuo em CI |
| Firefox | 88+ | Contínuo em CI |
| Safari | 14+ | Local manual |
| Edge | 90+ | Contínuo em CI |
| Mobile Safari (iOS) | 14+ | Local manual |
| Chrome Mobile | 90+ | Local manual |

**Polyfills:** Mínimos, Next.js trata automaticamente

### 7.6 Responsive Design

```
┌─────────────────────────────────────────────────┐
│ Mobile (< 640px)                                │
├─────────────────────────────────────────────────┤
│ • Single column layout                          │
│ • Bottom navigation (mobile-nav)                │
│ • Larger touch targets (48x48px)                │
│ • Stack filters vertically                      │
│ • Tables → Cards view no mobile                 │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ Tablet (640px - 1024px)                         │
├─────────────────────────────────────────────────┤
│ • Two column layout (sidebar + content)         │
│ • Adjusted spacing                              │
│ • Collapsed tables                              │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ Desktop (> 1024px)                              │
├─────────────────────────────────────────────────┤
│ • Full layout com sidebar + main                │
│ • All features visible                          │
│ • Full tables e gráficos                        │
└─────────────────────────────────────────────────┘
```

---

## 8. ROADMAP E SPRINTS

### 8.1 Timeline Geral

```
ABRIL 2026
├─ Sprint 1 (Semanas 1-2): Fundação & Setup
├─ Sprint 2 (Semanas 3-4): MVP Read-only
│
MAIO 2026
├─ Sprint 3 (Semanas 5-6): Views & Alertas
├─ Sprint 4 (Semanas 7-8): Equipamento, Férias, Polish
│
JUNHO 2026
├─ Sprint 5 (Semanas 9-10): CRUD Operações
├─ Sprint 6 (Semanas 11-12): Features Avançadas
│
JULHO 2026
└─ Produção
```

### 8.2 Sprint 1: Fundação (Semanas 1-2)

**Objetivo:** Setup inicial, autenticação funcional, estrutura de dados

**User Stories:**

| ID | Título | Pontos | Prioridade |
|----|----|--------|---------|
| SETUP-001 | Criar projeto Next.js com TypeScript + Tailwind | 3 | P0 |
| SETUP-002 | Configurar Supabase (DB, Auth, RLS) | 5 | P0 |
| SETUP-003 | Setup shadcn/ui e componentes base | 3 | P0 |
| AUTH-001 | Implementar tela de login com Supabase Auth | 5 | P0 |
| AUTH-002 | Implementar logout + middleware | 3 | P0 |
| DB-001 | Criar schema SQL (8 tabelas) | 5 | P0 |
| DB-002 | Implementar RLS policies | 5 | P0 |
| SCRIPT-001 | Criar seed script (Excel → Supabase) | 8 | P0 |
| UI-001 | Criar layout base (sidebar + header) | 5 | P1 |
| TEST-001 | Setup Vitest + Playwright | 3 | P1 |

**Total Pontos:** 45 pontos (9 story points/semana é padrão = ~10 dias úteis)

**Deliverables:**
- [ ] Projeto funcional localmente com Next.js
- [ ] Supabase project criado e configurado
- [ ] Autenticação login/logout funcional
- [ ] Schema SQL 100% pronto
- [ ] RLS policies implementadas
- [ ] Dados seedados (script pronto)
- [ ] Layout base funcional
- [ ] CI/CD básico (GitHub Actions)

**Definition of Done:**
- [ ] Código mergeado em main
- [ ] Sem console.errors
- [ ] TypeScript strict mode limpo
- [ ] Testes smoke passando
- [ ] Documentação atualizada

**Dependências:**
- Supabase account criada
- GitHub repo configurado
- Variáveis de ambiente definidas

### 8.3 Sprint 2: MVP Read-only (Semanas 3-4)

**Objetivo:** Validar UX, implementar leitura de dados, dashboards

**User Stories:**

| ID | Título | Pontos | Prioridade |
|----|-----|-------|---------|
| DASH-001 | Dashboard com KPIs (total, ativo, desligado) | 5 | P0 |
| DASH-002 | Gráficos (seniority, clientes) | 8 | P0 |
| DASH-003 | Alertas de renovação | 5 | P0 |
| PROF-001 | Listar profissionais (paginado) | 5 | P0 |
| PROF-002 | Filtrar profissionais (cliente, status, etc) | 8 | P0 |
| PROF-003 | Buscar profissional (search) | 5 | P0 |
| PROF-004 | Página de detalhe de profissional | 8 | P0 |
| CLIENT-001 | Listar clientes (grid/card view) | 5 | P0 |
| CLIENT-002 | Detalhe de cliente | 5 | P1 |
| TEST-002 | Testes de componentes principais | 8 | P1 |

**Total Pontos:** 62 pontos

**Deliverables:**
- [ ] Dashboard funcional com KPIs e gráficos
- [ ] Lista de profissionais com filtros
- [ ] Search de profissionais
- [ ] Página de detalhe de profissional
- [ ] Grid de clientes
- [ ] 70% de cobertura de testes
- [ ] Responsive (mobile, tablet, desktop)

**Definition of Done:**
- [ ] Performance < 2s dashboard, < 500ms search
- [ ] Accessibility AA compliance
- [ ] Mobile responsive
- [ ] E2E tests smoke passing
- [ ] Documentação atualizada
- [ ] Ready for user feedback

### 8.4 Sprint 3: Views & Alertas (Semanas 5-6)

**Objetivo:** Completar visibilidade de dados, renovações, equipamento

**User Stories:**

| ID | Título | Pontos | Prioridade |
|----|-----|-------|---------|
| RENEW-001 | Listar renovações com status | 5 | P0 |
| RENEW-002 | Filtrar renovações | 3 | P1 |
| RENEW-003 | Timeline visual de renovações | 8 | P2 |
| EQUIP-001 | Listar equipamento | 5 | P0 |
| EQUIP-002 | Buscar por profissional | 3 | P0 |
| VAC-001 | Listar férias | 5 | P0 |
| VAC-002 | Calendário de férias (futura) | 8 | P2 |
| REPORT-001 | Relatórios simples (PDF export) | 8 | P2 |
| POLISH-001 | Responsive polish (mobile) | 5 | P1 |
| PERF-001 | Otimização de performance | 5 | P1 |

**Total Pontos:** 55 pontos

**Deliverables:**
- [ ] Sistema de renovações completo
- [ ] Equipamento list view
- [ ] Férias list view
- [ ] Relatórios básicos
- [ ] Performance otimizado

### 8.5 Sprint 4: Equipamento, Férias, Polish (Semanas 7-8)

**Objetivo:** Completar features leitura, design polish, performance

**User Stories:**
- Equipamento detalhe
- Férias calendário (advanced)
- Design refinements
- Performance tuning
- Accessibility compliance final

**Total Pontos:** 45-50 pontos

### 8.6 Sprint 5: CRUD Operações (Semanas 9-10)

**Objetivo:** Ativar modificações de dados

**User Stories:**
- Criar profissional (form + validation)
- Editar profissional
- Deletar profissional
- Criar cliente
- Editar cliente
- Form validation
- Optimistic updates
- Confirmação de ações destrutivas

**Total Pontos:** 60-70 pontos

### 8.7 Sprint 6: Features Avançadas (Semanas 11-12)

**Objetivo:** Escalabilidade, integrações, manutenibilidade

**User Stories:**
- Excel export (CRUD'd data)
- Advanced filtering/sorting
- Audit log viewer
- Email notifications (Supabase Edge Functions)
- Data sync reconciliation
- Performance monitoring

**Total Pontos:** 50-60 pontos

---

## 9. ESTRATÉGIA DE TESTES

### 9.1 Pirâmide de Testes

```
                  /\
                 /  \  E2E (10%)
                /─────\
               /       \
              /         \  Integration (30%)
             /───────────\
            /             \
           /               \  Unit (60%)
          /_________________\
```

### 9.2 Unit Tests (Vitest + React Testing Library)

**Cobertura Target:** 80%

**Exemplos:**

```typescript
// __tests__/unit/components/kpi-card.test.tsx
import { render, screen } from '@testing-library/react'
import { KPICard } from '@/components/dashboard/kpi-card'

describe('KPICard', () => {
  it('renders title and value', () => {
    render(<KPICard title="Total" value={487} />)
    expect(screen.getByText('Total')).toBeInTheDocument()
    expect(screen.getByText('487')).toBeInTheDocument()
  })

  it('applies color based on trend', () => {
    const { container } = render(
      <KPICard title="Growth" value={15} trend="up" />
    )
    expect(container.querySelector('.text-green-600')).toBeInTheDocument()
  })
})

// __tests__/unit/hooks/use-filters.test.ts
import { renderHook, act } from '@testing-library/react'
import { useFilters } from '@/lib/hooks/useFilters'

describe('useFilters', () => {
  it('initializes with empty filters', () => {
    const { result } = renderHook(() => useFilters())
    expect(result.current.filters).toEqual({
      clientId: undefined,
      status: undefined,
    })
  })

  it('updates filters', () => {
    const { result } = renderHook(() => useFilters())
    act(() => {
      result.current.setFilters({ clientId: 'alelo-id' })
    })
    expect(result.current.filters.clientId).toBe('alelo-id')
  })
})

// __tests__/unit/utils/format.test.ts
import { formatCurrency, formatDate } from '@/lib/utils/format'

describe('formatCurrency', () => {
  it('formats to Brazilian format', () => {
    expect(formatCurrency(1234.56)).toBe('R$ 1.234,56')
    expect(formatCurrency(0)).toBe('R$ 0,00')
  })
})

describe('formatDate', () => {
  it('formats date to DD/MM/YYYY', () => {
    const date = new Date('2025-03-15')
    expect(formatDate(date)).toBe('15/03/2025')
  })
})
```

### 9.3 Integration Tests (Vitest + Supabase Local)

```typescript
// __tests__/integration/actions/professionals.test.ts
import { getProfessionals } from '@/lib/actions/professionals'
import { supabaseLocal } from '@/lib/supabase/test'

describe('getProfessionals action', () => {
  beforeAll(async () => {
    // Setup: seed test data
    await supabaseLocal.from('clients').insert({
      id: 'test-client-1',
      name: 'Test Client'
    })

    await supabaseLocal.from('professionals').insert([
      {
        id: 'prof-1',
        name: 'João Silva',
        client_id: 'test-client-1',
        status: 'ATIVO'
      },
      {
        id: 'prof-2',
        name: 'Maria Santos',
        client_id: 'test-client-1',
        status: 'DESLIGADO'
      }
    ])
  })

  afterAll(async () => {
    // Cleanup
    await supabaseLocal.from('professionals').delete().neq('id', '')
    await supabaseLocal.from('clients').delete().neq('id', '')
  })

  it('fetches all professionals', async () => {
    const data = await getProfessionals()
    expect(data).toHaveLength(2)
  })

  it('filters by status', async () => {
    const data = await getProfessionals(1, 25, undefined, 'ATIVO')
    expect(data).toHaveLength(1)
    expect(data[0].name).toBe('João Silva')
  })

  it('filters by client', async () => {
    const data = await getProfessionals(1, 25, 'test-client-1')
    expect(data).toHaveLength(2)
  })
})

// __tests__/integration/api/health.test.ts
import { POST } from '@/app/api/health/route'

describe('Health check endpoint', () => {
  it('returns 200 OK', async () => {
    const request = new Request('http://localhost:3000/api/health', {
      method: 'POST'
    })
    const response = await POST(request)
    expect(response.status).toBe(200)
  })
})
```

### 9.4 E2E Tests (Playwright)

```typescript
// __tests__/e2e/auth.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('login with valid credentials', async ({ page }) => {
    await page.goto('/login')

    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'test-password-123')
    await page.click('button[type="submit"]')

    await expect(page).toHaveURL('/dashboard')
    await expect(page.locator('text=Visão Geral')).toBeVisible()
  })

  test('login with invalid credentials shows error', async ({ page }) => {
    await page.goto('/login')

    await page.fill('input[name="email"]', 'wrong@example.com')
    await page.fill('input[name="password"]', 'wrong-password')
    await page.click('button[type="submit"]')

    await expect(page.locator('text=Credenciais inválidas')).toBeVisible()
    await expect(page).toHaveURL('/login')
  })

  test('logout works', async ({ page, context }) => {
    // Login first
    await page.goto('/login')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'test-password-123')
    await page.click('button[type="submit"]')

    // Logout
    await page.click('[data-testid="user-menu-trigger"]')
    await page.click('text=Sair')

    await expect(page).toHaveURL('/login')
  })
})

// __tests__/e2e/dashboard.spec.ts
test('dashboard loads with KPIs', async ({ page }) => {
  await page.goto('/dashboard')

  await expect(page.locator('text=Total Profissionais')).toBeVisible()
  await expect(page.locator('text=Renovações Pendentes')).toBeVisible()

  // Check KPI values load
  const kpiValues = await page.locator('[data-testid="kpi-value"]').count()
  expect(kpiValues).toBeGreaterThan(0)

  // Check charts render
  await expect(page.locator('canvas')).toBeVisible()
})

// __tests__/e2e/professionals.spec.ts
test('professionals search works', async ({ page }) => {
  await page.goto('/professionals')

  // Search
  await page.fill('[data-testid="search-box"]', 'João')

  // Wait for results (debounced 300ms)
  await page.waitForTimeout(400)

  const rows = await page.locator('table tbody tr').count()
  expect(rows).toBeGreaterThan(0)

  // Check result contains search term
  await expect(page.locator('text=João')).toBeVisible()
})

test('professionals filter works', async ({ page }) => {
  await page.goto('/professionals')

  // Open filters
  await page.click('[data-testid="filters-trigger"]')

  // Select client filter
  await page.selectOption('select[data-testid="client-filter"]', 'alelo-id')

  // Results update
  const rows = await page.locator('table tbody tr').count()
  expect(rows).toBeGreaterThan(0)
})

test('professional detail page shows all info', async ({ page }) => {
  await page.goto('/professionals')

  // Click professional
  await page.click('text=João Silva')

  // Check detail page
  await expect(page.locator('text=João Silva')).toBeVisible()
  await expect(page.locator('text=joao@example.com')).toBeVisible()
  await expect(page.locator('text=PLENO')).toBeVisible()

  // Check sections
  await expect(page.locator('text=INFORMAÇÕES PESSOAIS')).toBeVisible()
  await expect(page.locator('text=DATAS CONTRATUAIS')).toBeVisible()
})

// __tests__/e2e/renewals.spec.ts
test('renewals page shows filtered renewals', async ({ page }) => {
  await page.goto('/renewals')

  // Check overdue renewals appear in red
  const overdueElements = await page.locator('[data-status="overdue"]').count()
  expect(overdueElements).toBeGreaterThan(0)

  // Filter by status
  await page.selectOption('select[data-testid="status-filter"]', 'overdue')

  // Verify filtered results
  const filteredRows = await page.locator('table tbody tr').count()
  expect(filteredRows).toBeLessThanOrEqual(overdueElements)
})

// __tests__/e2e/responsive.spec.ts
test('dashboard is responsive on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 })

  await page.goto('/dashboard')

  // Mobile nav should be visible
  await expect(page.locator('[data-testid="mobile-nav"]')).toBeVisible()

  // Desktop sidebar should be hidden
  await expect(page.locator('[data-testid="sidebar"]')).not.toBeVisible()

  // KPIs should stack vertically
  const kpiCards = await page.locator('[data-testid="kpi-card"]').boundingBox()
  const secondCard = await page.locator('[data-testid="kpi-card"]').nth(1).boundingBox()

  // Second card should be below first (y position greater)
  expect(secondCard?.y).toBeGreaterThan(kpiCards?.y ?? 0)
})
```

### 9.5 Estratégia de CI/CD

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check

  test-unit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run test:unit
      - uses: codecov/codecov-action@v3

  test-integration:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run test:integration

  test-e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npx playwright install
      - run: npm run build
      - run: npm run test:e2e

  deploy-preview:
    needs: [lint, test-unit, test-integration, test-e2e]
    runs-on: ubuntu-latest
    if: github.event_name == 'pull_request'
    steps:
      - uses: actions/checkout@v3
      - uses: vercel/action@main
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          github-token: ${{ secrets.GITHUB_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

**Test execution targets:**
```
npm run test:unit      # Vitest em modo watch
npm run test:integration # Vitest com Supabase local
npm run test:e2e       # Playwright
npm run test:all       # Todos os testes
npm run coverage       # Relatório de cobertura
```

---

## 10. PLANO DE EXECUÇÃO STEP-BY-STEP (Sprint 1)

### Semana 1

#### Dia 1 (Segunda)
**Objetivo:** Setup local + projeto criado

- [ ] **9:00-10:00** - Planejamento da semana, kick-off
- [ ] **10:00-12:00** - Setup:
  - [ ] Criar repositório GitHub
  - [ ] `npx create-next-app@latest --ts --app --tailwind`
  - [ ] Adicionar shadcn/ui: `npx shadcn-ui@latest init`
  - [ ] Estruturar pastas conforme spec
  - [ ] Commit inicial

- [ ] **13:00-17:00** - Supabase setup:
  - [ ] Criar conta Supabase (free tier)
  - [ ] Criar projeto
  - [ ] Configurar URL + Anon key
  - [ ] Criar arquivo `.env.local`
  - [ ] Testar conexão básica

**Deliverable:** Projeto Next.js rodando localmente com Supabase conectado

#### Dia 2 (Terça)
**Objetivo:** Schema SQL criado e migrations

- [ ] **9:00-12:00** - Criar schema SQL:
  - [ ] Criar arquivo `supabase/migrations/001_initial_schema.sql`
  - [ ] Implementar 8 tabelas conforme spec
  - [ ] Criar índices
  - [ ] Rodar migration no Supabase
  - [ ] Testar via Supabase UI

- [ ] **13:00-17:00** - RLS policies:
  - [ ] Criar `supabase/migrations/002_rls_policies.sql`
  - [ ] Implementar policies para todas as tabelas
  - [ ] Testar policies (try as authenticated user)
  - [ ] Gerar types: `npx supabase gen types typescript --local`
  - [ ] Salvar em `src/lib/types/database.ts`

**Deliverable:** Schema 100% pronto, RLS testado, types gerados

#### Dia 3 (Quarta)
**Objetivo:** Autenticação (login/logout/middleware)

- [ ] **9:00-12:00** - Setup Supabase Auth:
  - [ ] Criar `src/lib/supabase/client.ts` (browser client)
  - [ ] Criar `src/lib/supabase/server.ts` (server client)
  - [ ] Implementar middleware de auth
  - [ ] Criar types para User

- [ ] **13:00-17:00** - Tela de login:
  - [ ] Criar componente `LoginForm`
  - [ ] Implementar `src/app/(auth)/login/page.tsx`
  - [ ] Server action `src/lib/actions/auth.ts` com `login()`
  - [ ] Testar login/erro
  - [ ] Redirecionar após login

**Deliverable:** Login funcional, usuário pode fazer login

#### Dia 4 (Quinta)
**Objetivo:** Logout + Layout base

- [ ] **9:00-12:00** - Logout + middleware:
  - [ ] Implementar `logout()` server action
  - [ ] Criar middleware para proteger `/dashboard`
  - [ ] Redirecionar não autenticados para login
  - [ ] Testar middleware

- [ ] **13:00-17:00** - Layout base:
  - [ ] Criar componentes: `Header`, `Sidebar`, `Footer`
  - [ ] Implementar `src/app/(dashboard)/layout.tsx`
  - [ ] Adicionar nav links
  - [ ] Estilo com Tailwind
  - [ ] Testar responsividade

**Deliverable:** Layout base funcional, logout funcionando

#### Dia 5 (Sexta)
**Objetivo:** Seed script + testes iniciais

- [ ] **9:00-12:00** - Criar seed script:
  - [ ] Analisar dados Excel
  - [ ] Criar `scripts/seed-data.ts`
  - [ ] Parsear 6 clientes + ~500 profissionais
  - [ ] Inserir no Supabase
  - [ ] Validar dados

- [ ] **13:00-17:00** - Setup testes + polishing:
  - [ ] Setup Vitest
  - [ ] Setup React Testing Library
  - [ ] Setup Playwright
  - [ ] Teste smoke de login
  - [ ] Review código, cleanup

**Deliverable:** Dados seedados, testes básicos passando, semana 1 fechada

### Semana 2

#### Dia 6 (Segunda)
**Objetivo:** Dashboard KPIs

- [ ] **9:00-12:00** - Server actions de dados:
  - [ ] Criar `src/lib/actions/professionals.ts`
  - [ ] Implementar `getProfessionals()`, `getProfessionalCount()`, `getActiveProfessionals()`
  - [ ] Implementar `getClientsSummary()`
  - [ ] Testar queries

- [ ] **13:00-17:00** - Componentes de KPI:
  - [ ] Criar `KPICard` component
  - [ ] Criar `src/app/(dashboard)/page.tsx` (dashboard)
  - [ ] Implementar 4 KPI cards principais
  - [ ] Estilo com Tailwind
  - [ ] Testar carregamento

**Deliverable:** Dashboard carregando com KPIs

#### Dia 7 (Terça)
**Objetivo:** Gráficos no dashboard

- [ ] **9:00-12:00** - Instalar + Setup recharts:
  - [ ] `npm install recharts`
  - [ ] Criar `ChartSeniority` component (bar chart)
  - [ ] Criar `ChartClients` component (pie chart)
  - [ ] Implementar server actions para dados dos gráficos

- [ ] **13:00-17:00** - Integração:
  - [ ] Adicionar gráficos ao dashboard
  - [ ] Testar responsividade
  - [ ] Estilo visual
  - [ ] Performance (lazy load charts)

**Deliverable:** Dashboard com 2 gráficos funcionais

#### Dia 8 (Quarta)
**Objetivo:** Lista de profissionais + paginação

- [ ] **9:00-12:00** - Componente de tabela:
  - [ ] Criar `ProfessionalsTable` component
  - [ ] Criar `Pagination` component
  - [ ] Implementar `src/app/(dashboard)/professionals/page.tsx`
  - [ ] Testar paginação (25 items/page)

- [ ] **13:00-17:00** - Integração de dados:
  - [ ] Server action `getProfessionals(page, pageSize)`
  - [ ] Buscar dados
  - [ ] Exibir em tabela
  - [ ] Teste de carregamento

**Deliverable:** Página de profissionais com paginação funcional

#### Dia 9 (Quinta)
**Objetivo:** Filtros + Search

- [ ] **9:00-12:00** - Filtros:
  - [ ] Criar `FiltersToolbar` component
  - [ ] Criar hook `useFilters()`
  - [ ] Implementar dropdowns (Client, Status, Seniority)
  - [ ] Testar filtros

- [ ] **13:00-17:00** - Search:
  - [ ] Criar `SearchBox` component com debounce
  - [ ] Server action `searchProfessionals(query)`
  - [ ] Integrar com tabela
  - [ ] Teste de performance (< 200ms)

**Deliverable:** Filtros + Search funcionando

#### Dia 10 (Sexta)
**Objetivo:** Detalhe de profissional + Testing

- [ ] **9:00-12:00** - Página de detalhe:
  - [ ] Criar `src/app/(dashboard)/professionals/[id]/page.tsx`
  - [ ] Implementar `ProfessionalDetail` component
  - [ ] Exibir todas as informações
  - [ ] Link para voltar

- [ ] **13:00-17:00** - Testes + Review:
  - [ ] Escrever unit tests para componentes
  - [ ] Escrever E2E test para login → dashboard → profissional
  - [ ] Code review
  - [ ] Preparar para Sprint 2

**Deliverable:** Sprint 1 finalizada, testes passing, pronto para demo

---

## 11. DECISION LOG

### D-001: Next.js Fullstack vs Backend Separado

**Decisão:** Next.js Fullstack (Server Actions + API Routes)

**Alternativas Consideradas:**
1. Backend separado (Node.js/Express + frontend React)
2. Fullstack Next.js

**Razão:**
- Simplicidade: Uma linguagem (TypeScript), um repo, um deploy
- Velocidade: Menos boilerplate, mais features
- Custo: Menos recursos de infraestrutura
- Escalabilidade: Supabase handles database/auth

**Trade-offs:**
- ❌ Menor separação de concerns
- ✅ Mais rápido para MVP
- ✅ Mais fácil de manter

### D-002: Supabase vs Neon + Prisma

**Decisão:** Supabase (BaaS)

**Alternativas:**
1. Neon (PostgreSQL managed) + Prisma (ORM)
2. Supabase (Firebase open-source alternative)

**Razão:**
- Auth já incluída (não precisa NextAuth.js)
- RLS nativa para segurança multi-user
- Real-time subscriptions (futura feature)
- Menos dependências

**Trade-offs:**
- ❌ Vendor lock-in (mas open-source)
- ❌ Menos controle de schema
- ✅ Rápido prototipagem
- ✅ Integração natural com RLS

### D-003: shadcn/ui vs Material-UI vs Ant Design

**Decisão:** shadcn/ui

**Razão:**
- Copiar-colar: Código fica no repo (customizável)
- Headless: Flexibilidade máxima
- Tailwind nativo (não duplicar CSS)
- Sem overhead de tema
- Comunidade crescente

**Trade-offs:**
- ❌ Menos componentes pré-built
- ✅ Mais customizável
- ✅ Bundle menor

### D-004: MVP Read-only vs CRUD desde start

**Decisão:** MVP Read-only primeiro (Sprints 1-4), CRUD depois (Sprint 5)

**Razão:**
- Validar UX antes de investir em CRUD
- Entender fluxo real de usuários
- Menor scope inicial
- Feedback cedo

**Trade-offs:**
- ❌ Funcionalidade limitada inicialmente
- ✅ Time pode focar na experiência
- ✅ Menos bugs iniciais

### D-005: Sprints de 2 semanas

**Decisão:** 2 semanas

**Razão:**
- Padrão da indústria
- Demo/feedback frequente
- Retrospectiva regular
- Ideal para time pequeno

---

## 12. RISCOS E MITIGAÇÕES

### Risco 1: Qualidade de Dados Excel

**Descrição:** Dados Excel têm inconsistências (senioridade escrita diferente, datas em formatos múltiplos, valores nulos)

**Impacto:** Alto - dados ruins causam confusão de usuários

**Probabilidade:** Alta

**Mitigação:**
- [ ] Script de validação no seed (detectar anomalias)
- [ ] Relatório de dados problemáticos antes de importar
- [ ] Manual review de ~50 primeiros registros
- [ ] Test data bem estruturado
- [ ] UI mostra "dados não preenchidos" em vez de quebrar

### Risco 2: Curva de Aprendizado Supabase

**Descrição:** Time não familiarizado com RLS, real-time, etc

**Impacto:** Médio - mais tempo nos primeiros sprints

**Probabilidade:** Média

**Mitigação:**
- [ ] Spike research na Sprint 0 (2-3 horas)
- [ ] Documentação interna clara
- [ ] Exemplos de código prontos
- [ ] Suporte Supabase community (Discord)

### Risco 3: Bandwidth de Uma Pessoa

**Descrição:** Só um dev pode criar gargalos

**Impacto:** Alto - projeto atrasa se dev fica doente/ocupado

**Probabilidade:** Média (dependendo de situação)

**Mitigação:**
- [ ] Documentação excelente (onboard secundário rápido)
- [ ] Code simples (menos magic)
- [ ] Testes bons (catching regressions)
- [ ] PRs pequenas (review rápido)

### Risco 4: Scope Creep

**Descrição:** Requisitos novos aparecem durante o desenvolvimento

**Impacto:** Médio - atraso de release

**Probabilidade:** Alta (normal em projetos)

**Mitigação:**
- [ ] Freezing specs após Sprint 1
- [ ] Novo requisito = novo sprint
- [ ] Stakeholder reviews em fim de sprint
- [ ] "Nice to have" vs "Must have" clara

### Risco 5: Performance com 500+ Profissionais

**Descrição:** Queries podem ficar lentas com dados crescentes

**Impacto:** Médio - má experiência do usuário

**Probabilidade:** Baixa-Média

**Mitigação:**
- [ ] Índices desenhados para queries principais
- [ ] Paginação desde o start (não carregar tudo)
- [ ] Testes de load na Sprint 4
- [ ] Plano de cache (Redis) se necessário

### Risco 6: Mobile Responsividade Esquecida

**Descrição:** Foco em desktop, mobile fica ruim

**Impacto:** Médio-Alto (usuários acessam mobile)

**Probabilidade:** Média

**Mitigação:**
- [ ] Mobile-first CSS strategy
- [ ] Testes E2E de responsividade
- [ ] Viewport testing no CI
- [ ] Design review semanal em mobile

---

## 13. GLOSSÁRIO

| Termo | Definição |
|-------|-----------|
| **ATIVO** | Profissional atualmente contratado/alocado |
| **DESLIGADO** | Profissional que saiu da empresa |
| **Senioridade** | Nível técnico: JUNIOR, PLENO, SÊNIOR, ESPECIALISTA |
| **CLT ESTRATÉGICO** | Contrato CLT com valor estratégico agregado |
| **CLT ILATI** | Contrato CLT com tipo de alocação ILATI |
| **PJ** | Profissional como Pessoa Jurídica |
| **OS** | Ordem de Serviço (número identificador) |
| **Vigor de Contrato** | Período em que o contrato é válido |
| **Prazo Renovação** | Data limite para renovar contrato |
| **RLS** | Row Level Security (segurança em nível de linha) |
| **JWT** | JSON Web Token (autenticação stateless) |
| **Server Action** | Função executada no servidor (Next.js) |
| **SSR** | Server-Side Rendering |
| **Seed Data** | Dados iniciais importados do Excel |
| **Índice** | Estrutura de DB para aceleração de queries |
| **Paginação** | Dividir resultados em páginas (25/página) |
| **Filter** | Refinar lista por critérios |
| **FTS** | Full Text Search (busca textual) |
| **Relatório** | Extração de dados (ex: PDF, Excel) |
| **Auditoria** | Log de quem fez o quê e quando |
| **Spike** | Pesquisa rápida sobre tecnologia |

---

## 14. APÊNDICES

### A. Mapeamento Excel → Database

#### Clientes

| Coluna Excel | Tabela DB | Campo | Tipo |
|------|------|--------|--------|
| Client name | clients | name | TEXT |
| (implicit) | clients | id | UUID |

#### Profissionais (Active Professionals sheets)

| Coluna Excel | Coluna DB | Tipo | Notas |
|------|-----------|------|-------|
| OS | os | INTEGER | Nullable, varia por cliente |
| PROFISSIONAL | name | TEXT | Obrigatório |
| E-mail | email | TEXT | Nullable |
| Gestor | manager | TEXT | Nullable |
| Contato | contact | TEXT | Nullable |
| PERFIL / PERFIL FATURAMENTO | profile | TEXT | Específico por cliente |
| CARGO | position | TEXT | Nullable, não existe em Pede Pronto |
| SENIORIDADE | seniority | seniority_enum | Normalizar variações |
| STATUS | status | status_enum | ATIVO / DESLIGADO |
| TIPO DE CONTRATAÇÃO | contract_type | contract_type_enum | CLT_ESTRATEGICO, PJ, CLT_ILATI |
| DATA INÍCIO | date_start | DATE | Admission date |
| DATA DE SAÍDA | date_end | DATE | Nullable |
| VIGÊNCIA OS: INÍCIO | contract_start | DATE | Nullable |
| VIGÊNCIA OS: DATA FIM | contract_end | DATE | Nullable |
| PRAZO RENOVAÇÃO OS | renewal_deadline | DATE | Nullable |
| VALOR CLT | value_clt | NUMERIC | 0 se não existe |
| VALOR ESTRATÉGICO | value_strategic | NUMERIC | 0 se não existe |
| HORAS TRABALHADAS | hours_worked | INTEGER | 0 se não existe |
| R$ PAGAMENTO | payment_value | NUMERIC | 0 se não existe |
| OUTROS | other_values | NUMERIC | 0 se não existe |
| R$ TAXA FATURAMENTO | billing_rate | NUMERIC | 0 se não existe |
| Faturamento Renovação 2025 | renewal_billing | NUMERIC | 0 se não existe |
| VALOR TOTAL DE FATURAMENTO | total_billing | NUMERIC | Somar valores |
| VALOR HORA | hourly_rate | NUMERIC | Apenas Veloe, Pede Pronto |

#### Desligados Sheet

| Origem | Destino |
|--------|---------|
| Mesmo formato que Active | professionals (status=DESLIGADO) |
| Livelo rows 3-82 | client_id=livelo |
| Alelo rows 83-110 | client_id=alelo |
| Veloe rows 111-142 | client_id=veloe |
| Pede Pronto rows 143-173 | client_id=pede_pronto |
| Idea Maker rows 174+ | client_id=idea_maker |

#### Equipamento

| Excel | DB | Tipo |
|------|-------|------|
| Nome | professional_name | TEXT |
| Empresa | company | TEXT |
| Modelo Máquina | machine_model | TEXT |
| Tipo de máquina | machine_type | TEXT |
| Pacote office | office_package | BOOLEAN |
| Software espec | software_details | TEXT |

#### Férias

| Excel | DB | Tipo |
|------|-------|------|
| Área/Cliente | client_area | TEXT |
| Liderança | leadership | TEXT |
| Taker | professional_name | TEXT |
| Admissão | admission_date | DATE |
| Período Aquisitivo | acquisition_start, acquisition_end | DATE |
| Período Concessivo | concession_start, concession_end | DATE |
| Saldo dias | days_balance | INTEGER |
| Datas férias | vacation_start, vacation_end | DATE |
| Abono | bonus_days | INTEGER |
| Quantidade dias | total_days