# Revisão de Design - Gestão de Profissionais Grupo Elopar
**Data:** 05 de Abril de 2026
**Projeto:** Gestão de Profissionais - Grupo Elopar
**Stack:** Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + shadcn/ui + Supabase
**Status da Revisão:** EM PROGRESSO

---

## 1. Resumo do Design

### 1.1 Visão Geral da Solução

O projeto propõe um sistema de gestão de profissionais para o Grupo Elopar, consolidando dados dispersos em planilhas Excel. O MVP é uma aplicação web read-only construída em **Next.js 16** com **Supabase** como backend, voltada para 1-5 gestores de projeto monitorarem alocações, vigências e informações administrativas de ~100 profissionais ativos e 175 desligados.

**Escopo do MVP:**
- Dashboard com KPIs e alertas de renovação
- Listagem de profissionais com filtros (cliente, status, senioridade, perfil)
- Visualização de detalhes do profissional
- Gestão por cliente
- Read-only (CRUD implementado posteriormente)

### 1.2 Decisões Arquiteturais Principais

| Decisão | Justificativa |
|---------|---------------|
| **Next.js Fullstack** | Elimina complexidade de separar frontend e backend; App Router nativo facilita organização; Supabase fornece auth integrada. |
| **Supabase vs Neon+Prisma** | BaaS reduz overhead operacional; RLS (Row Level Security) integrada para multi-tenancy; Auth nativa; pricing previsível para MVP. |
| **shadcn/ui + Tailwind** | Componentes prontos; sem vendor lock-in; customização simples; alinhado com padrão Next.js moderno. |
| **Read-only MVP** | Reduz complexidade; mitigam erros de data entry; validam UX com dados reais antes de CRUD. |
| **Seed de Excel** | Rápido onboarding de dados; preserva histórico; único import necessário para MVP. |
| **2-week sprints** | Feedback frequente com stakeholders; ajustes rápidos; alinhado com ambição "1-2 meses". |

### 1.3 Arquitetura Técnica

**Stack Selecionado:**
```
Frontend/SSR: Next.js 16 (App Router) + React 19 + TypeScript
Styling: Tailwind CSS v4 + shadcn/ui
Backend/Auth/DB: Supabase (PostgreSQL + Auth + RLS + Edge Functions)
Package Manager: npm
```

**Estrutura de Pastas (Esperada):**
```
src/
  ├─ app/
  │  ├─ (auth)/          # Páginas de login/signup
  │  ├─ (dashboard)/     # Área autenticada
  │  │  ├─ page.tsx      # Dashboard principal
  │  │  ├─ profissionais/ # Lista + filtros
  │  │  ├─ clientes/      # Agrupamento por cliente
  │  │  └─ renovacoes/    # Alertas de vigência
  │  ├─ api/             # Route handlers (se necessário)
  │  ├─ layout.tsx
  │  └─ globals.css
  ├─ components/         # Componentes reutilizáveis
  │  ├─ ui/             # shadcn/ui
  │  ├─ dashboard/      # Componentes específicos
  │  └─ common/         # Layout, navbar, etc.
  ├─ lib/               # Utilidades (tipos, helpers)
  ├─ hooks/             # Custom React hooks
  └─ services/          # Supabase client, queries
```

**Modelo de Dados (Supabase PostgreSQL):**
- **clients** (6 registros): Alelo, Livelo, Veloe, Pede Pronto, Idea Maker, Zamp
- **professionals** (~100 ativos): OS, nome, email, gestor, cargo, senioridade, status, datas, valores
- **equipment** (~101 registros): máquinas, softwares, profissional associado
- **vacations** (~12 registros): períodos aquisitivos, saldos, férias agendadas
- **audit_log** (tabela interna): rastreamento de mudanças futuras

### 1.4 Fluxos Principais

1. **Login → Dashboard → Filtrar → Detalhe**
   - Auth Supabase (email/senha)
   - Dashboard exibe KPIs e alertas
   - Usuário filtra por cliente, status, senioridade
   - Acessa detalhes do profissional

2. **Monitoramento de Renovações**
   - Coluna `date_vig_end` (vigência) é verificada
   - Alertas para vigências < 30 dias
   - Badge visual ("Renovação próxima")

3. **Seed de Dados**
   - Script Node.js lê Excel
   - Valida e normaliza dados
   - Insere em Supabase via admin client
   - Rastreamento de inconsistências em log

### 1.5 Métricas de Sucesso Esperadas

- Dashboard carrega em < 2s
- Filtros retornam resultados em < 1s
- Taxa de erro crítico < 0.1% em produção
- Satisfação do usuário > 80%

---

## 2. Análise Crítica

### 2.1 Suposições Arriscadas e Pontos Fracos

#### 2.1.1 Suposição 1: "Supabase será suficiente para complexidade dos dados"

**Risco:** A especificação menciona campos como `date_start`, `date_saved`, `date_vig_start`, `date_vig_end`, `value_clt`, `value_strategy`, `hours_worked`, `billing` - **com lógica de cálculo implícita**. Exemplo:
- Como se calcula `billing` a partir de `value_clt` + `value_strategy` + `hours_worked`?
- Qual é a precedência de `date_saved` vs `date_vig_end` quando ambas existem?
- Como se normaliza senioridade ("SÊNIOR II", "SENIOR", "SÊNIOR PLENO")?

**Realidade:** Supabase com RLS é excelente para CRUD simples e reads, mas:
- Sem um ORM forte (Prisma/TypeORM), querys complexas ficam verbose
- RLS policies podem ficar frágeis com lógica de negócio complicada
- Migrações de dados sujos (Excel) exigem scripts robustos
- Edge Functions para lógica pesada custam caro em escala

**Evidência nos Dados:**
```
Problema na planilha original:
- Senioridade: "JUNIOR", "PLENO", "SÊNIOR", "SÊNIOR II", "SÊNIOR PLENO", "ESPECIALISTA"
- Contrato: "CLT", "PJ", "CLT ESTRATÉGICO", "CLT ESTRÁTEGICO" (typo!)
- Status: "ATIVO", "Desligado", "DESLIGADO" (inconsistência de case)
```

**Impacto:** Sem normalização no seed, filtros quebram. "Senioridade = SÊNIOR" não encontra "SENIOR".

#### 2.1.2 Suposição 2: "Read-only MVP elimina a complexidade"

**Risco:** O escopo inicial de "read-only" mascara a questão: **como os dados chegam ao sistema?**
- Seed via script: OK para onboarding, mas precisa de validação robusta
- Atualizações futuras: Fazer upload Excel manual? Integração com RH? Isso não está claro.
- Dados stale: Se o Excel é atualizado fora do sistema, quando sincroniza?

**Impacto:** O MVP fica preso aos dados do seed; qualquer inconsistência discovered em produção exigirá rollback e re-seed manual.

#### 2.1.3 Suposição 3: "Dashboard em 2 segundos é realizável"

**Risco:** Com 100+ profissionais, equipment, vacation, há risco de N+1 queries ou índices ausentes:
```sql
-- Problema: sem índices
SELECT * FROM professionals WHERE client_id = $1 AND status = 'ATIVO';
SELECT * FROM equipment WHERE professional_id IN (list_above);
SELECT * FROM vacations WHERE professional_id IN (list_above);
```

**Realidade de Supabase:**
- RLS policies adicionam overhead (verifica auth em cada row)
- Sem índices compostos (`client_id, status`), full table scan ocorre
- Pagination não implementada: 100 registros por page mata performance

**Impacto:** Dashboard vai degrada conforme dados crescem de 100 para 300+ (futura).

#### 2.1.4 Suposição 4: "1-5 projeto managers é o tamanho final"

**Risco:**
- Atual: 1-5 PMs (MVP)
- Histórico mencionado: 6 clientes, Grupo Elopar é multi-tenant implicitamente
- Futuro: Pode crescer para 20+ PMs (diferentes clientes/departamentos)

**Realidade de RLS:**
- RLS policies simplista (apenas `user_id = auth.uid()`) funciona
- Multi-tenant avançado (um PM vê só seus clientes) exige policies complexas
- Sem granularidade, um PM vê todos os dados

**Impacto:** RLS não escalará bem sem refactoring. Risco de exposição de dados no futuro.

#### 2.1.5 Suposição 5: "shadcn/ui é suficiente para tabelas complexas"

**Risco:** shadcn/ui oferece componentes base, mas:
- Tabela com filtros, busca, ordenação, paginação, exportação é complexa
- shadcn não vem com data table pronta (existe `@tanstack/react-table`, mas precisa integração)
- Responsividade mobile: tabela no mobile é UX horrível (sem componentes adaptáveis)

**Impacto:** MVP pode ficar com UX ruim no mobile; refactoring necessário na Fase 2.

### 2.2 Problemas Detectados

#### Problema 1: Falta Camada de Validação de Dados

**Situação:** Excel é importado via script sem validação forte.
```javascript
// Pseudo-código (atual - fraco)
const row = sheet.getRow(i);
const professional = {
  os: row['OS'],
  name: row['Nome'],
  seniority: row['Senioridade'], // <- PERIGO: pode vir como "SÊNIOR II"
};
```

**O que deveria existir:**
```typescript
// Zod schema para validação
const ProfessionalSchema = z.object({
  os: z.number().positive(),
  name: z.string().min(3),
  seniority: z.enum(['JUNIOR', 'PLENO', 'SÊNIOR', 'ESPECIALISTA']), // Normalizado
  status: z.enum(['ATIVO', 'DESLIGADO']),
});
```

**Impacto:** Dados sujos entram no banco; filtros quebram; usuários ficam confusos.

#### Problema 2: Sem Estratégia de Paginação/Performance

**Situação:** Dashboard carrega todos os ~100 profissionais de uma vez.
```sql
-- Sem LIMIT
SELECT * FROM professionals WHERE status = 'ATIVO';
```

**Realidade de crescimento:**
- Hoje: 100 registros → OK
- Mês 2: 300 registros → Começa a ficar lento
- Ano 1: 1.000+ registros → Insuportável

**Solução esperada:** Paginação (limit/offset) ou cursor-based pagination.

#### Problema 3: RLS Policies Não Definidas

**Situação:** Especificação menciona auth Supabase, mas não define policies.
- Quem pode ver quem?
- Um PM de Alelo pode ver dados de Livelo?
- Admin pode ver tudo?

**Risco:** Sem policies, o banco fica aberto ou policies são aplicadas errado em desenvolvimento.

#### Problema 4: Sem Estratégia de Monitoramento/Alertas

**Situação:** MVP é read-only, nenhum erro de data corruption. Mas:
- Como saber se dados ficam stale?
- Como rastrear quem acessou o quê? (compliance)
- Como alertar sobre renovações? (via email, push, SMS?)

**Realidade:** Alertas de "vigência próxima" no MVP são apenas visuais (badge).

### 2.3 Edge Cases e Cenários de Falha

#### Edge Case 1: Profissional com Vigência Vencida

```sql
-- Hoje: 2026-04-05
-- Profissional com date_vig_end = 2026-03-15 (30 dias atrás)
SELECT * FROM professionals WHERE date_vig_end < NOW() - INTERVAL '30 days';
-- Resultado: Alerta "Vigência vencida" aparece?
```

**Questão:** Dashboard mostra alertas apenas para datas futuras < 30 dias, ou também passadas?

#### Edge Case 2: Profissional com Múltiplas Alocações no Mesmo Cliente

```
OS: 001 | Nome: João | Cliente: Alelo | Status: ATIVO | Vigência: 2026-06-01
OS: 002 | Nome: João | Cliente: Alelo | Status: ATIVO | Vigência: 2026-08-01
```

**Questão:** Tabela mostra ambas as linhas ou agrupa? Dashboard conta como 1 ou 2 profissionais?

#### Edge Case 3: Sincronização Excel Offline

```
Scenario:
1. PM usa sistema web (online)
2. PM trabalha com Excel local (offline)
3. Excel é atualizado (novo profissional)
4. Tenta sincronizar via sistema web
5. Conflito: dados locais vs remoto?
```

**Status:** MVP não suporta isso (read-only). Risco em Fase 2.

#### Edge Case 4: Profissional com Email Nulo ou Duplicado

```sql
-- OS 001: João, email = NULL
-- OS 002: Maria, email = 'maria@example.com'
-- OS 003: Carlos, email = 'maria@example.com' <- DUPLICADO!

SELECT DISTINCT email FROM professionals WHERE email IS NOT NULL;
```

**Impacto:** Filtros por email quebram; exclusividade em Supabase `@unique` não garante.

#### Edge Case 5: Crescimento de Dados Além do Esperado

```
Cenário: Cliente novo contrata 200 profissionais em 1 mês.
Tabela profissionais: 100 → 300 registros
Query default: SELECT * FROM professionals;
Resultado: Dashboard trava, frontend timeout.
```

**Status:** Sem paginação, sistema quebra.

### 2.4 Questões Críticas Sem Resposta

1. **Como se lida com dados do Excel inconsistentes?**
   - Quem valida? Script ou manual?
   - O que fazer com registros inválidos? (skip, quarantine, erro?)

2. **Qual é a SLA de atualização de dados?**
   - Excel é importado daily? Weekly? Manually?
   - Se há delay, como usuários sabem se dados são "frescos"?

3. **Como escalará para 10x de dados?**
   - Índices já estão definidos? Composite keys?
   - Arquivamento de dados desligados (175 registros) está planejado?

4. **Qual é a plano de monetização?**
   - Supabase free tier suporta quantos usuários simultâneos?
   - Quando passa para plan pago, quanto custa?

5. **Quem mantém isso a longo prazo?**
   - Roadmap futuro (CRUD, notificações, integração RH)?
   - Suporte do Elopar ou agency?

---

## 3. Avaliação de Restrições

### 3.1 Performance

#### Análise de Baseline

**Escopo atual:**
```
Professionals: ~100 registros
Equipment: ~101 registros
Vacations: ~12 registros
```

**Queries esperadas no dashboard:**
1. Dashboard KPIs:
   ```sql
   SELECT COUNT(*) FROM professionals WHERE status = 'ATIVO';
   SELECT COUNT(*) FROM professionals WHERE status = 'DESLIGADO';
   SELECT COUNT(*) FROM professionals WHERE date_vig_end < NOW() + INTERVAL '30 days';
   SELECT seniority, COUNT(*) FROM professionals GROUP BY seniority;
   ```

2. Lista de profissionais (com filtros):
   ```sql
   SELECT * FROM professionals
   WHERE client_id = $1 AND status = $2 AND seniority = $3
   LIMIT 50 OFFSET 0;
   ```

**Previsão de performance:**

| Query | Sem Índices | Com Índices | Target (2s) |
|-------|------------|------------|------------|
| COUNT BY status | 50ms | 10ms | ✓ OK |
| GROUP BY seniority | 80ms | 20ms | ✓ OK |
| Filtrados + LIMIT 50 | 200ms | 30ms | ✓ OK |
| Total agregado (4 queries) | ~330ms | ~70ms | ✓ OK |

**Observação:** Com 100 registros, sem índices ainda passa. Mas com 1.000 registros (cenário provável em 12 meses):

| Query | Sem Índices | Com Índices |
|-------|------------|------------|
| Filtrados + LIMIT 50 | 2.000ms+ | 50ms |

**Conclusão:** **CRÍTICO** - Sem índices compostos agora, system quebra no futuro.

#### Recomendação de Índices (Supabase)

```sql
-- Índices CRÍTICOS
CREATE INDEX idx_professionals_client_status
  ON professionals(client_id, status);

CREATE INDEX idx_professionals_status
  ON professionals(status);

CREATE INDEX idx_professionals_date_vig_end
  ON professionals(date_vig_end);

-- Índices SECUNDÁRIOS
CREATE INDEX idx_equipment_professional
  ON equipment(professional_id);

CREATE INDEX idx_vacations_professional
  ON vacations(professional_id);
```

#### RLS Impact

Supabase RLS policies adicionam ~5-10ms por query (policy evaluation).
```sql
-- Exemplo policy
CREATE POLICY "users can see professionals of their clients"
ON professionals FOR SELECT
USING (client_id IN (SELECT client_id FROM user_assignments WHERE user_id = auth.uid()));
```

**Com 10 clientes:** Policy evaluation pode adicionar 50-100ms por query.

**Recomendação:** Usar `enable_rls` apenas em tabelas necessárias; keep `professionals` with simple policies.

### 3.2 Segurança

#### Análise de Risco de Dados

**Dados Sensíveis no MVP:**
- Nome, email, gestor → PII (Personally Identifiable Information)
- Salários (value_clt, value_strategy) → Crítico
- Tipo de contrato (CLT vs PJ) → Competitivo
- Status (Desligado) → Pode ser sensível

**Conformidade:**
- Brasil: LGPD (Lei Geral de Proteção de Dados)
- EU: GDPR (se houver dados de clientes EU)

**Suposição atual:** "1-5 PMs têm acesso total aos dados"
- Sem granularidade (um PM de Alelo pode ver dados de Livelo?)
- Sem auditoria

#### Checklist de Segurança

| Item | Status | Risco |
|------|--------|-------|
| **Authentication** | Email/senha via Supabase | Bom - Supabase é seguro |
| **Authorization (RLS)** | Não definida | CRÍTICO - sem policies, dados expostos |
| **Encryption em trânsito** | HTTPS (Vercel/Supabase) | Bom - automático |
| **Encryption em repouso** | Supabase default | Bom - padrão |
| **Auditoria (audit_log)** | Não implementada | MÉDIO - útil para compliance |
| **Session timeout** | Supabase default (24h) | OK - revisar política |
| **2FA (Two-Factor Auth)** | Não implementada | MÉDIO - considerar para produção |

#### RLS Policies Recomendadas

```sql
-- 1. Política de Cliente
CREATE TABLE user_assignments (
  user_id UUID REFERENCES auth.users(id),
  client_id INT REFERENCES clients(id),
  role TEXT DEFAULT 'viewer' -- 'viewer' ou 'admin'
);

-- 2. RLS Policy para Professionals
ALTER TABLE professionals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users see professionals of their assigned clients"
ON professionals FOR SELECT
USING (client_id IN (
  SELECT client_id FROM user_assignments
  WHERE user_id = auth.uid()
));

-- 3. RLS Policy para Equipment
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users see equipment of their professionals"
ON equipment FOR SELECT
USING (professional_id IN (
  SELECT id FROM professionals
  WHERE client_id IN (
    SELECT client_id FROM user_assignments
    WHERE user_id = auth.uid()
  )
));
```

### 3.3 Escalabilidade

#### Projeção de Crescimento

**Cenário otimista:**
```
Mês 1 (MVP):   100 profissionais ativos
Mês 6:         150 profissionais ativos (novo cliente)
Ano 1:         300+ profissionais ativos (múltiplos novos clientes)
Ano 2:         500+ profissionais ativos
```

**Capacidade atual do Supabase Free Tier:**
- Até 500MB storage (suficiente para ~5.000 registros simples)
- Realtime: 200 simultâneos (suficiente para MVP)
- Bandwidth: ~50GB/mês (suficiente para leitura)

**Capacidade de Next.js no Vercel Free Tier:**
- Serverless functions: 100 ao mesmo tempo (OK)
- Cold starts: ~1-2s (aceitável)
- Bandwidth: 100GB/mês (OK para MVP)

**Quebra esperada:**
```
MVP (Mês 1-2):    Supabase Free + Vercel Free ✓
Crescimento (Mês 3-6): Continua OK
Pressão (Mês 12+): Upgrade necessário para Pro plans
```

#### Checklist de Escalabilidade

| Componente | MVP | Mês 6 | Ano 1 |
|-----------|-----|-------|-------|
| **Database** | Supabase Free | Supabase Pro | Supabase Pro+ |
| **Frontend** | Vercel Free | Vercel Pro | Vercel Pro |
| **Storage** | <100MB | <300MB | ~500MB-1GB |
| **Concurrent users** | 1-5 | 5-10 | 10-20 |
| **Queries/min** | ~100 | ~300 | ~1.000 |
| **Paginação** | Não urgente | CRÍTICO | Mandatório |
| **Caching** | Não implementado | Recomendado | CRÍTICO |

#### Recomendações de Escalabilidade

1. **Implementar paginação cursor-based no Mês 2** (antes que cresça)
2. **Adicionar índices no launch** (não depois)
3. **Considerar caching (Redis/Vercel KV)** a partir do Mês 6
4. **Arquivar dados desligados** (175 registros) para tabela separada `archived_professionals`

### 3.4 Custo

#### Projeção de Custos

**Supabase Pricing (anual):**
```
Free Tier: $0
Pro: $25/mês = $300/ano (recomendado para MVP+)
Team: $599/mês = $7.188/ano (futuro)
```

**Vercel Pricing (anual):**
```
Hobby (Free): $0
Pro: $20/mês = $240/ano
Enterprise: Customizado
```

**Estimativa MVP (Ano 1):**
```
Supabase Pro: $300
Vercel Pro: $240
Domínio: $12
Total: ~$552/ano = ~$46/mês
```

**ROI Consideração:**
- Planilha Excel: 0 cost direto, mas 10+ horas/mês de admin manual
- Sistema web: $46/mês, economiza 5+ horas/mês de admin
- Break-even: < 1 mês

### 3.5 Maintenance

#### Responsabilidades

| Tarefa | Frequência | Owner | Effort |
|--------|-----------|-------|--------|
| **Seed dados (Excel)** | Monthly | Admin | 1 hora |
| **Backups** | Daily | Supabase (auto) | 0 |
| **Monitoramento de erros** | Realtime | Dev | 5h/mês |
| **Dependency updates** | Monthly | Dev | 2h/mês |
| **RLS policy reviews** | Quarterly | Dev + PM | 2h/trimestre |
| **Performance tuning** | As-needed | Dev | 2-5h/trimestre |

#### Plano de Suporte (MVP)

```
- Entidade responsável: TBD (Elopar internal? External agency?)
- SLA: 4h response, 24h resolution (suggestion)
- On-call: Weekdays 8h-18h
- Escalation path: Dev → Tech Lead → CTO
```

---

## 4. Perspectiva do Usuário

### 4.1 Personas Validadas

#### Persona 1: Gerente de Projetos (PM Sênior)
**Perfil:**
- 5+ anos de experiência em gestão
- Gerencia 2-3 clientes (20-30 profissionais)
- Precisa de visibility de alocações e renovações
- Usa Excel diariamente (benchmark)

**Necessidades principais:**
1. Rápida visualização de quem está alocado onde
2. Alertas de vigência próxima (renovação)
3. Acesso a histórico de profissional (salário, datas, documentos)
4. Filtros eficientes (não quer ver tudo)
5. Exportar relatório para reunião com cliente

#### Persona 2: Administrativo
**Perfil:**
- 2-3 anos de experiência
- Mantém dados atualizados
- Precisa de relatórios consolidados
- Menos urgência, mais profundidade

**Necessidades principais:**
1. Sincronização de dados com Excel central
2. Relatórios de faturamento por cliente
3. Auditoria de mudanças
4. Busca robusta (filtrar por email, OS, nome)

### 4.2 Avaliação de Funcionalidades Contra Necessidades

#### Funcionalidade 1: Dashboard

**Design proposto:**
```
[KPI Cards: Total, Ativos, Desligados, Renovações]
[Gráfico Senioridade (pie)]
[Gráfico Clientes (bar)]
[Tabela Alertas]
```

**Feedback do usuário (simulado):**
- ✓ Cards de KPI são úteis
- ✓ Gráfico de senioridade ajuda a entender força de trabalho
- ✗ Gráfico de clientes não é muito útil (PM só gerencia 1-2 clientes)
- ✗ Faltam métricas de faturamento (muito importante para financeiro)
- ✗ Falta timeline visual de renovações (apenas tabela é pouco)

**Recomendação:** Adicionar:
- Card de faturamento total (mês)
- Timeline visual de próximas renovações (Gantt-like)
- Filtro no dashboard ("Ver apenas meu cliente")

#### Funcionalidade 2: Lista de Profissionais

**Design proposto:**
```
[Filtros: Cliente, Status, Senioridade, Perfil]
[Search: Nome, Email]
[Tabela: OS, Nome, Cargo, Cliente, Data Vigência, Status]
[Paginação]
```

**Feedback do usuário:**
- ✓ Filtros são essenciais
- ✓ Busca por nome é crítica
- ✗ Falta coluna de "Dias até renovação" (calculado visualmente agora)
- ✗ Falta ordenação por "Data de vigência" (proximidade)
- ✗ Tabela muito densa no mobile (17 colunas?)
- ✓ Paginação é aceitável

**Recomendação:**
- Adicionar coluna "Status Renovação" (verde/amarelo/vermelho)
- Adicionar ordenação by "Dias até renovação" (default)
- Fazer tabela responsiva (collapse columns no mobile)
- Considerar exportar para CSV/Excel (para levar para reunião)

#### Funcionalidade 3: Detalhes do Profissional

**Design proposto:**
```
[Infos Pessoais: Nome, Email, Gestor, Contato]
[Infos Contratuais: OS, Cargo, Senioridade, Status, Tipo Contratação]
[Datas: Início, Saída, Vigência, Dias até vencer]
[Valores: CLT, Estratégico, Faturamento, Total]
[Histórico de status]
```

**Feedback do usuário:**
- ✓ Todas as informações são necessárias
- ✓ Histórico é útil
- ✗ Falta "Documentos" (CNH, cópia contrato, etc.) - será futuro?
- ✗ Falta "Equipamentos associados" (máquina, software)
- ✗ Falta "Férias" (saldo e agendadas)
- ? Onde está "Contato"? (telefone?)

**Recomendação:**
- Adicionar seção "Equipamentos"
- Adicionar seção "Férias"
- Esclarecer o que é "Contato"
- Planejar "Documentos" para Fase 2

#### Funcionalidade 4: Gestão por Cliente

**Design proposto:**
```
[Selector de Cliente]
[Resumo: Nº alocações, Faturamento total]
[Lista de profissionais desse cliente]
```

**Feedback do usuário:**
- ✓ Útil para conversas com cliente
- ✗ "Faturamento total" - é de quanto tempo? (este mês? trimestre? ano?)
- ✗ Falta "Histórico de alocações" (quem saiu, quem entrou)
- ✗ Falta "Contato do cliente" (email, telefone)
- ✗ Falta "Próximas renovações por cliente" (resumo)

**Recomendação:**
- Adicionar "Data range" para faturamento (filtro temporal)
- Adicionar "Status resumido" (X ativos, Y por renovar)
- Adicionar "Contato do cliente" (tbl clients precisa de campos)
- Vincular renovações por cliente

### 4.3 Workflow de Renovação (Critical Path)

**Fluxo Ideal (usuário):**
```
1. Login → Dashboard
2. Ver alertas de renovação (tabela/timeline)
3. Clicar em profissional com vigência próxima
4. Ver detalhes completos
5. Marcar como "Proposta enviada" (futuro - CRUD)
6. Gerar relatório para cliente
7. Logout
```

**Realidade do MVP:**
```
1. Login ✓
2. Ver alertas (tabela, não timeline) ✓ (partially)
3. Clicar e ver detalhes ✓
4. Marcar - NÃO EXISTE (read-only)
5. Relatório - NÃO EXISTE (futuro export)
```

**Gaps no MVP:**
- Sem "Marcar renovação", PM tem que atualizar manualmente em Excel ou email
- Sem histórico no sistema, perdem-se propostas e status
- Sem relatório, PM exporta tudo manualmente (ineficiente)

**Impacto:** MVP é 70% útil, mas os últimos 30% (ação e follow-up) requerem Excel.

### 4.4 Questões de Usabilidade

#### Pergunta 1: "Qual é a senioridade desse profissional?"
**Resposta atual:** Campo `seniority` na tabela, em texto simples.
**Problema:** Em Excel, usuário vê "SÊNIOR", sistema mostra "SÊNIOR II" - confusão.
**Recomendação:** Badge com cor (Junior=azul, Pleno=verde, Sênior=amarelo, Especialista=vermelho).

#### Pergunta 2: "Quanto tempo até essa vigência vencer?"
**Resposta atual:** Coluna "Data Vigência", usuário calcula mentalmente.
**Problema:** Slow cognition, error-prone, especialmente com múltiplos profissionais.
**Recomendação:** Coluna "Dias até renovação" (número + badge de alerta).

#### Pergunta 3: "Como exporto isso para Excel?"
**Resposta atual:** Print screen ou... não é possível.
**Problema:** PM precisa levar dados para reunião com cliente offline.
**Recomendação:** Botão "Exportar CSV" no filtro ativo (Fase 2, mas planeje agora).

#### Pergunta 4: "Quem atualizou esses dados?"
**Resposta atual:** Não há rastreamento.
**Problema:** Se há inconsistência, não sabe de onde veio (Excel antigo? Digitação errada?).
**Recomendação:** Coluna `updated_by` + `updated_at` em cada tabela (Fase 2).

### 4.5 Perspectiva de Frustração

**Cenários onde usuário se frustra:**

1. **Filtro quebrado:** Procura por "SÊNIOR", 0 resultados encontrados (porque no DB está "SENIOR II").
   - **Raiz:** Normalização de dados deficiente
   - **Mitigação:** Validação em seed + documentação de valores permitidos

2. **Dashboard lento:** Tira 5+ segundos para carregar.
   - **Raiz:** Sem índices ou sem paginação
   - **Mitigação:** Índices no launch + paginação na Fase 2

3. **Renovação perdida:** PM vê alerta no dashboard, mas depois não consegue lembrar qual profissional era.
   - **Raiz:** Sem como "marcar" ou "salvar" no sistema (read-only)
   - **Mitigação:** Notificação por email? Relatório diário? Planejar CRUD urgentemente

4. **Dados desatualizados:** Contratar novo profissional em Excel, não aparece no sistema por 1 semana.
   - **Raiz:** Seed manual, sem sync contínuo
   - **Mitigação:** Documentar processo de atualização ou implementar sync automatizado (API Excel?)

### 4.6 Recomendações do Usuário (Síntese)

**Essencial (Bloqueia MVP):**
- Filtros funcionando (normalizar dados)
- Dashboard não quebrado de performance

**Importante (Fase 1-2):**
- Coluna "Dias até renovação" + badges visuais
- Exportar para CSV
- Notificações por email (próxima renovação)
- Responsividade mobile (tabela colapsável)

**Legal (Fase 2+):**
- CRUD (marcar renovação no sistema)
- Timeline visual de renovações
- Relatórios PDF
- Integração com calendário (Google Calendar?)

---

## 5. Decisões Finais (Integrator Review)

### 5.1 Análise de Objeções e Resoluções

#### Objeção 1: "Supabase é a escolha errada, deveria usar Neon + Prisma"

**Argumentos contra:**
- Neon + Prisma é mais complexo para fullstack MVP
- Supabase oferece auth nativa, sem extra de setup
- Pricing é previsível e low-cost para MVP
- Edge functions futuro (não hoje, mas possível)

**Argumentos a favor:**
- Prisma é ORM mais maduro que supabase-js
- Neon escalável para múltiplos clientes (multi-tenant)
- Melhor para migrações (Prisma migrations vs SQL manual)

**DECISÃO:** **MANTER Supabase**, mas com condições:
1. Implementar schema migrations com Supabase CLI (não SQL manual)
2. Documentar todas as policies no repositório
3. Revisar em Mês 3 (se pain points, considerar Neon + Prisma para Fase 2)

---

#### Objeção 2: "Performance vai quebrar, precisa de paginação AGORA"

**Argumentos contra:**
- MVP tem apenas 100 registros, paginação é over-engineering
- Adiciona complexidade ao frontend (cursor/offset logic)
- Tempo investido em paginação = tempo perdido em features do MVP

**Argumentos a favor:**
- Com 100+ registros, sem paginação já é ruim no mobile
- Projeto crescerá para 300+ em 6 meses (previsão)
- Paginação é trivial com shadcn/ui + React Table (1-2 horas)
- Melhor implementar logo e iterar

**DECISÃO:** **IMPLEMENTAR paginação (limit 50) no MVP**, com revisão de UX no Mês 2.
- Risco ACEITÁVEL de 2h engineering
- Benefício ALTO de escalabilidade

---

#### Objeção 3: "RLS policies são muito complexas, deixa pra Fase 2"

**Argumentos contra:**
- RLS é segurança crítica, não é "nice to have"
- Sem policies, qualquer usuário autenticado vê todos os dados
- Compliance (LGPD) exige controle de acesso

**Argumentos a favor:**
- MVP é "1-5 PMs", todos devem ver mesmos dados (confiança alta)
- Implementar RLS agora pode introduzir bugs (acesso negado por acidente)
- Fase 2 (multi-client) exigirá revisão anyway

**DECISÃO:** **IMPLEMENTAR RLS básico no MVP**:
```
- Política: Usuário autenticado vê TODOS os professionals/equipment/vacations
- Justificativa: MVP assume confiança; Fase 2 refactora com user_assignments
- Revisão: Mês 2, antes de Fase 2
```

---

#### Objeção 4: "Faltam campos críticos no design (documentos, contato, etc.)"

**Argumentos contra:**
- MVP é read-only, só precisa de dados que existem no Excel
- Adicionar campos = adicionar complexidade (seed, schema, UI)
- Excel já tem 17 colunas, mais é confusão

**Argumentos a favor:**
- Usuários querem "Documentos" (CNH) e "Contato" (telefone)
- Sem documentos, não consegue validar profissional offline
- Sem contato, precisa de excel separado

**DECISÃO:** **ADICIONAR campos no schema, mas deixar opcional no MVP**:
1. Campos adicionais:
   - `phone` (profissional)
   - `documents_url` (profissional, aponta para pasta compartilhada)
   - `client_email`, `client_phone` (clientes)
2. Frontend mostra se disponível, não quebrausa
3. Seed permite valores NULL
4. Fase 2 (CRUD) obriga preenchimento

---

#### Objeção 5: "Dados de Excel são muito sujos, seed vai falhar"

**Argumentos contra:**
- Seed com validação rigorosa vai rejeitar muitos registros
- Usuário quer os dados no sistema (mesmo que imperfeitos)
- Refazer manualmente é time-consuming

**Argumentos a favor:**
- Dados sujos quebram filtros e lógica
- Melhor fazer uma vez agora do que descobrir bugs depois
- Validação é educativa (mostra inconsistências)

**DECISÃO:** **SEED com 3 níveis de validação**:
```
Nível 1 (ERRO): Campos obrigatórios faltam → rejeita linha
Nível 2 (WARN): Valores não normalizados (SÊNIOR II) → normaliza automaticamente
Nível 3 (INFO): Duplicatas/inconsistências → reporta em log

Script output: relatório detalhado
  ✗ 5 linhas rejeitadas (email faltando)
  ⚠ 12 linhas normalizadas (senioridade)
  ℹ 3 duplicatas de email (manual review)
  ✓ 100 linhas importadas com sucesso
```

---

### 5.2 Decisões Recomendadas

#### Mudança 1: Expandir Schema

**Tabelas existentes:**
- clients, professionals, equipment, vacations

**Adicionar:**

```sql
-- 1. user_assignments (RLS future-proof)
CREATE TABLE user_assignments (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id INT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'viewer',
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, client_id)
);

-- 2. Expandir professionals
ALTER TABLE professionals ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE professionals ADD COLUMN IF NOT EXISTS documents_url TEXT;

-- 3. Expandir clients
ALTER TABLE clients ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS contact_person TEXT;

-- 4. audit_log (para futuro compliance)
CREATE TABLE audit_log (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  table_name TEXT NOT NULL,
  operation TEXT NOT NULL, -- 'SELECT', 'INSERT', 'UPDATE', 'DELETE'
  record_id INT,
  changes JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

#### Mudança 2: Criar Índices Críticos

```sql
-- Performance índices
CREATE INDEX idx_professionals_client_status
  ON professionals(client_id, status)
  WHERE status = 'ATIVO';

CREATE INDEX idx_professionals_date_vig_end
  ON professionals(date_vig_end)
  WHERE date_vig_end > NOW();

CREATE INDEX idx_professionals_email
  ON professionals(email);

CREATE INDEX idx_equipment_professional
  ON equipment(professional_id);

CREATE INDEX idx_vacations_professional
  ON vacations(professional_id);
```

---

#### Mudança 3: Implementar Validação de Seed

**Arquivo:** `scripts/seed-professionals.ts`

```typescript
import { z } from 'zod';

const SENIORITY_NORMALIZE = {
  'JUNIOR': 'JUNIOR',
  'PLENO': 'PLENO',
  'SÊNIOR': 'SÊNIOR',
  'SÊNIOR II': 'SÊNIOR', // normaliza
  'SÊNIOR PLENO': 'SÊNIOR',
  'SENIOR': 'SÊNIOR', // typo
  'ESPECIALISTA': 'ESPECIALISTA',
  'ESPECIALISTA SÊNIOR': 'ESPECIALISTA',
};

const ProfessionalSchema = z.object({
  os: z.number().positive(),
  name: z.string().min(3),
  email: z.string().email(),
  seniority: z.enum(['JUNIOR', 'PLENO', 'SÊNIOR', 'ESPECIALISTA']),
  status: z.enum(['ATIVO', 'DESLIGADO']),
  // ... outros campos
});

function validateRow(row: any): { valid: boolean; errors?: string[]; normalized?: any } {
  try {
    const normalized = {
      ...row,
      seniority: SENIORITY_NORMALIZE[row.seniority] || row.seniority,
      status: row.status.toUpperCase(),
    };

    const parsed = ProfessionalSchema.parse(normalized);
    return { valid: true, normalized: parsed };
  } catch (error) {
    return {
      valid: false,
      errors: error instanceof z.ZodError
        ? error.errors.map(e => `${e.path.join('.')}: ${e.message}`)
        : [String(error)]
    };
  }
}
```

---

#### Mudança 4: Paginação no Frontend

**Componente:** `src/components/professional-table.tsx`

```typescript
// Implementação com @tanstack/react-table
import { useReactTable, getPaginationRowModel } from '@tanstack/react-table';

const table = useReactTable({
  data: professionals,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  initialState: {
    pagination: {
      pageIndex: 0,
      pageSize: 50,
    },
  },
});

// UI
<div>
  {/* Table rows */}
  <DataTablePagination table={table} />
</div>
```

---

#### Mudança 5: Documentar Processo de Atualização de Dados

**Arquivo:** `docs/DATA_MANAGEMENT.md`

```markdown
# Gestão de Dados

## Atualização Manual de Profissionais

1. Atualizar arquivo Excel central
2. Exportar como CSV (encoding UTF-8)
3. Executar seed script:
   ```bash
   npm run seed -- --file data.csv --validate --report
   ```
4. Revisar relatório de erros/warnings
5. Corrigir em Excel se necessário, re-seed
6. Validar no dashboard

## Frequência Recomendada
- MVP: Semanal (manual)
- Fase 2: Integração automática (API / webhook)

## SLA de Atualização
- Dados aparecem em < 1 hora após seed
- Rollback disponível (restaurar snapshot anterior)
```

---

### 5.3 Melhorias Recomendadas (Não-bloqueantes)

#### Recomendação 1: Adicionar Timeline de Renovações

**Fase 1** (MVP):
- Tabela de alertas com "Dias até renovação"

**Fase 2** (Nice-to-have):
- Timeline visual (Gantt chart) por cliente
- Filtro "Renovações próximas (< 30 dias)"

---

#### Recomendação 2: Email Notifications

**Fase 2:**
- Enviar email quando vigência < 7 dias
- Digest semanal (renovações da semana)
- Integração com Resend ou SendGrid

---

#### Recomendação 3: Responsividade Mobile

**Fase 2:**
- Tabela colapsível (mostra apenas colunas críticas)
- Drawer para detalhes (em vez de nova página)
- Filtros em modal (em vez de barra lateral)

---

#### Recomendação 4: Performance Monitoring

**Agora:**
- Adicionar Vercel Analytics (free)
- Supabase metrics dashboard (built-in)

**Fase 2:**
- APM (Application Performance Monitoring): LogRocket ou Sentry
- Query performance logging em Supabase

---

#### Recomendação 5: Design System Documentação

**Agora:**
- Criar `docs/DESIGN_SYSTEM.md` com:
  - Cores (cliente 1, ativo, renovação)
  - Tipografia
  - Componentes do shadcn/ui usados
  - Convenções de classe Tailwind

---

### 5.4 Riscos Aceitados

| Risco | Probabilidade | Impacto | Decisão |
|-------|--------------|--------|---------|
| **Dados sujos no seed** | Alta | Médio | Mitigado com validação + relatório |
| **Performance degrada em 6m** | Média | Alto | Mitigado com paginação + índices |
| **RLS policies quebram acesso** | Baixa | Crítico | Mitigado com testes antes de deploy |
| **Usuário frustra com read-only** | Alta | Médio | Aceitável (CRUD em Fase 2) |
| **Supabase atinge quota free** | Baixa | Médio | Upgrade para Pro (< $300/ano) |

---

## 6. Decision Log

| Decisão | Alternativas Consideradas | Objeções | Resolução |
|---------|---------------------------|----------|-----------|
| **Supabase vs Neon+Prisma** | Neon+Prisma, Firebase, AWS RDS | Prisma é mais maduro; multi-tenant futuro | Manter Supabase, revisar em Mês 3 se dor. Condição: schema migrations versionadas. |
| **Read-only MVP** | CRUD desde dia 1 | Valida UX antes; reduz bugs | Manter read-only. Planejar CRUD para Fase 2 (Semana 12+). |
| **Paginação no MVP** | Sem paginação (dados pequenos) | Escalabilidade futura; trivial implementar agora | Implementar paginação (limit 50). Tempo: 2h. |
| **RLS Policies** | Deixar para Fase 2 (segurança simplificada agora) | Compliance LGPD exige controle acesso | RLS básico agora (usuário autenticado = acesso total). Refactor em Mês 2. |
| **Campos adicionais (phone, docs)** | Apenas campos existentes no Excel | Dados necessários para workflow futuro | Adicionar ao schema (NULL-allow), não obrigado no MVP. |
| **Seed com validação** | Importar dados como-estão | Data quality crítica para filtros | Seed com Zod validation + 3 níveis (ERROR/WARN/INFO). |
| **Índices no launch** | Índices quando necessário (futuro) | Performance crítica desde Mês 2 | Criar índices no launch (< 30min, economia futura). |
| **Next.js fullstack** | Frontend React separado + Backend Node.js | Complexidade infraestrutura | Manter fullstack. Ganho: menos infra, menos deploy. |
| **shadcn/ui + Tailwind** | Material-UI ou Chakra | Customização, bundle size | Manter shadcn/ui. Suporta dark mode, sem extra config. |

---

## 7. Riscos Identificados

| Risco | Probabilidade | Impacto | Mitigação | Owner |
|-------|--------------|--------|-----------|-------|
| **Dados Excel inconsistentes quebram filtros** | Alta | Médio | Validação Zod em seed + relatório detalhado | Dev |
| **Performance piora com crescimento (300+ records)** | Média | Alto | Paginação MVP + índices + cache (Fase 2) | Dev |
| **RLS policies introduzem bugs de acesso** | Baixa | Crítico | Testes unitários de policies antes de prod | QA |
| **Usuários frustrados com read-only** | Alta | Médio | Comunicar roadmap CRUD (Fase 2) + workflow alternativo | PM |
| **Supabase RLS overhead impacta performance** | Baixa | Médio | Profile queries em dev; upgrade plan se necessário | Dev |
| **Dados stale (não sincronizam com Excel)** | Média | Médio | Documentar SLA; planejar sync automatizado (Fase 2) | PM/Dev |
| **Mobile UX é horrível (tabela não responsiva)** | Alta | Médio | Redesign tabela colapsível (Fase 2, não MVP) | Design |
| **Falta rastreabilidade de quem atualizou dados** | Média | Baixo | audit_log schema (não populate MVP) | Dev |
| **Índices criados incorretamente** | Baixa | Médio | Code review by senior dev; testes de performance | Dev |
| **Usuário não consegue exportar para Excel** | Alta | Médio | Planejar export CSV (Fase 2) | PM |

---

## 8. Recomendações de Skills Adicionais

Ao longo do desenvolvimento, as seguintes skills/ferramentas seriam valiosas:

### 8.1 Supabase-Specific Skills

**Atual:** Documentação Supabase + StackOverflow
**Recomendado:**
- Supabase RLS Policy generator (skill custom)
- Supabase migration manager (versionamento de schema)
- Query performance profiler (identify N+1 bugs)

**Impacto:** Reduz setup time de RLS; garante migrations versionadas; previne performance regressions.

---

### 8.2 Data Migration / ETL Skill

**Atual:** Scripts Node.js manual
**Recomendado:**
- Python-based ETL pipeline (Apache Airflow, Fivetran)
- Data validation framework (Great Expectations ou similar)
- Automated data quality checks (dbt tests)

**Impacto:** Scale Excel imports para múltiplas fontes; catch data quality issues early; reduce manual intervention.

---

### 8.3 Monitoring & Observability Skill

**Atual:** Nenhum
**Recomendado:**
- Sentry para error tracking (aplicações frontend/backend)
- LogRocket ou PostHog para user session replay
- Datadog ou New Relic para infrastructure monitoring

**Impacto:** Detecta bugs em produção antes de usuários reportarem; entender padrões de uso; performance insights.

---

### 8.4 Design System Skill

**Atual:** shadcn/ui + Tailwind CSS (padrão)
**Recomendado:**
- Storybook para componentização visual
- Figma integration com dev handoff
- Accessibility audit tool (axe-core, Lighthouse)

**Impacto:** Documentação viva de components; design consistency; accessibility compliance (WCAG).

---

### 8.5 Testing & QA Skill

**Atual:** Não mencionado
**Recomendado:**
- Playwright ou Cypress para E2E tests
- MSW (Mock Service Worker) para API mocking
- jest para unit tests

**Impacto:** Previne regressões; segurança ao refactor; confiança em deploy.

---

### 8.6 DevOps / Infrastructure Skill

**Atual:** Vercel (deploy automático) + Supabase (hosted)
**Recomendado:**
- GitHub Actions para CI/CD workflow
- Infrastructure as Code (Terraform para Supabase config)
- Environment management (dev/staging/prod)

**Impacto:** Reproducible deployments; safe staging environment; faster feedback loop.

---

## 9. Disposição Final

### 9.1 Decisão Overall

**STATUS: APPROVED WITH CONDITIONS**

---

### 9.2 Rationale

A proposta de arquitetura (Next.js 16 + Supabase) é **sólida para o MVP** com scope claramente definido:
- Read-only funcionalidade mitiga complexity
- Supabase oferece balance de simplicidade vs feature completeness
- Next.js fullstack elimina overhead de infraestrutura
- Team size (1-5 PMs) suporta implicitação simplificada de RLS

**Porém**, há 5 **mudanças críticas** que devem ser implementadas **antes do launch**:
1. Validação de seed com Zod (prevent data corruption)
2. Índices de performance (prevent future collapse)
3. Paginação no MVP (support scalability)
4. RLS básico (compliance LGPD)
5. Schema expansion (campos future-proof)

Sem essas mudanças, riscos de data quality e performance aumentam significativamente.

---

### 9.3 Condições para Approval

#### Condição 1: Validação de Seed
- [ ] Script Zod schema definido
- [ ] Teste com dados reais do Excel
- [ ] Relatório de validação implementado
- [ ] Documentação de fallback (manual fixes)
- **DL:** Semana 1

#### Condição 2: Índices Criados
- [ ] 5 índices críticos criados (ver seção 3.1)
- [ ] Query performance baseline documentado
- [ ] Teste de scale (1.000 registros) passa < 2s
- **DL:** Semana 1

#### Condição 3: Paginação Implementada
- [ ] React Table integrado com shadcn/ui
- [ ] Pagination controls testes
- [ ] Default page size = 50
- [ ] Mobile responsivity validada
- **DL:** Semana 2

#### Condição 4: RLS Policies
- [ ] Política base: `user_id = auth.uid()`
- [ ] Testes unitários das policies
- [ ] Documentação de política em código (comments)
- [ ] Plano de refactor para Fase 2
- **DL:** Semana 2

#### Condição 5: Schema Expansion
- [ ] user_assignments table criada
- [ ] Campos phone/documents_url adicionados (NULL-allow)
- [ ] audit_log structure (não popula MVP)
- [ ] Migration script versionado
- **DL:** Semana 1

---

### 9.4 Critérios de Sucesso para Go-Live

Antes de disponibilizar para PMs, validar:

| Critério | Acceptance | Owner |
|----------|-----------|-------|
| **Dashboard load time** | < 2s (p99) | Dev |
| **Filter accuracy** | 100% (sem resultados faltando por typos) | QA |
| **Data integrity** | 0 corruption em 100 inserts de seed | Dev |
| **RLS enforcement** | User A não vê dados unauthorized | QA |
| **Pagination UX** | Intuitivo (forward/back/jump to page) | Design |
| **Mobile responsivity** | Tabela usável em iPhone 12 | Design |
| **Error handling** | Erro gracioso (não 500 branco) | Dev |
| **Documentation** | Runbook de seed + data management | PM |

---

### 9.5 Próximos Passos (Roadmap)

**Sprint 1 (Semana 1-2):**
- [ ] Implementar todas as 5 condições acima
- [ ] Setup Supabase project com schema + índices
- [ ] Criar seed script com Zod validation
- [ ] Teste de import com dados reais do Excel

**Sprint 2 (Semana 3-4):**
- [ ] Auth flow (Supabase magic link ou email/password)
- [ ] Dashboard layout (shadcn/ui cards + recharts)
- [ ] Professional table com filtros + paginação
- [ ] Integração com Supabase queries

**Sprint 3 (Semana 5-6):**
- [ ] Detail page (profissional completo)
- [ ] Client management (agrupamento)
- [ ] Renewal alerts (tabela + lógica de dias)
- [ ] Polish UX (dark mode, accessibility)

**Sprint 4 (Semana 7-8):**
- [ ] E2E tests (Playwright ou Cypress)
- [ ] Performance optimization (caching, lazy loading)
- [ ] Deploy staging (validar com 1-2 PMs)
- [ ] Documentation (user guide, API, data management)

**Sprint 5+ (Fase 2):**
- [ ] CRUD (create, update, delete professionals)
- [ ] Email notifications (Resend/SendGrid)
- [ ] CSV export
- [ ] RLS refactor (multi-client)

---

### 9.6 Sign-Off

**Revisão realizada:** 05 de Abril de 2026
**Status:** ✓ APPROVED WITH CONDITIONS

**Análise concluída por:**
- Primary Designer: Arquitetura confirmada
- Skeptic: Riscos identificados e mitigações definidas
- Constraint Guardian: Performance/segurança endereçadas
- User Advocate: UX alinhada com PM needs 