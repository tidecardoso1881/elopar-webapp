# Sprint 2 - Backlog Detalhado

**Sprint:** 2 | **Período:** 21 de abril - 4 de maio de 2026 | **Velocidade:** 50 story points

---

## EP-009: Dashboard com KPI Cards

**Tipo:** Feature
**Story Points:** 8
**Prioridade:** P0 (Must Have)
**Status:** TODO
**Atribuído a:** Tide Cardoso

### Descrição

Como gerenciador do grupo Elopar, quero visualizar um dashboard com KPIs principais (total de profissionais, clientes ativos, contratos ativos, equipamentos), para ter uma visão rápida da saúde do negócio.

### Critérios de Aceitação

- [ ] Dashboard carrega em < 2 segundos com dados reais
- [ ] KPI Cards exibidos com:
  - [ ] Total de profissionais (com tendência)
  - [ ] Total de clientes ativos
  - [ ] Total de contratos ativos
  - [ ] Total de equipamentos disponíveis
- [ ] Cada card mostra:
  - [ ] Valor principal em grande
  - [ ] Descrição e unidade
  - [ ] Tendência (seta up/down com %)
  - [ ] Ícone visual apropriado
- [ ] Cards responsivos em mobile
- [ ] Efeito hover com sutil elevação
- [ ] Atualização de dados em tempo real (opcional: polling a cada 30s)
- [ ] Skeleton loaders enquanto dados carregam

### Tarefas Técnicas

- [ ] Criar componente `DashboardPage` em `app/dashboard/page.tsx`
- [ ] Criar componente `KPICard` reutilizável
- [ ] Implementar server action para buscar KPIs no Supabase
- [ ] Usar queries SQL otimizadas:
  - `SELECT COUNT(*) FROM profissionais`
  - `SELECT COUNT(DISTINCT cliente_id) FROM contratos WHERE status = 'ativo'`
  - `SELECT COUNT(*) FROM contratos WHERE status = 'ativo'`
  - `SELECT COUNT(*) FROM equipamentos`
- [ ] Adicionar cálculo de tendências (comparar com período anterior)
- [ ] Criar skeleton component para loading state
- [ ] Testar com dados simulados de diferentes volumes

### Notas

- Usar Lucide React para ícones
- Coordenar cores com Design System
- Considerar caching de queries para performance
- Preparar para dashboard com filtros por data em futuro

---

## EP-010: Gráfico de distribuição por senioridade

**Tipo:** Feature
**Story Points:** 5
**Prioridade:** P0 (Must Have)
**Status:** TODO
**Atribuído a:** Desenvolvedor Frontend

### Descrição

Como gerenciador, quero visualizar um gráfico mostrando a distribuição de profissionais por nível de senioridade (Junior, Pleno, Sênior, Líder), para entender a composição da equipe.

### Critérios de Aceitação

- [ ] Gráfico de pizza ou barra implementado
- [ ] Dados agrupados por senioridade corretamente
- [ ] Cores diferentes para cada nível
- [ ] Legenda com contagem e percentual
- [ ] Interatividade: hover mostra tooltip com detalhes
- [ ] Responsivo em mobile (mudar para vertical se necessário)
- [ ] Dados se atualizam sem page refresh
- [ ] Filtro por cliente opcional

### Tarefas Técnicas

- [ ] Avaliar e selecionar biblioteca (Recharts, Chart.js ou Victory)
- [ ] Criar componente `SeniorityChart`
- [ ] Implementar query Supabase:
  ```sql
  SELECT senioridade, COUNT(*) as count
  FROM profissionais
  GROUP BY senioridade
  ```
- [ ] Formatar dados para formato esperado pela biblioteca
- [ ] Implementar tooltip customizado
- [ ] Adicionar cores do Design System
- [ ] Testar com múltiplos datasets

### Notas

- Decidir entre Recharts (melhor para React) ou Chart.js (mais leve)
- Garantir acessibilidade para leitores de tela
- Preparar para drill-down em futuro

---

## EP-011: Gráfico de distribuição por cliente

**Tipo:** Feature
**Story Points:** 5
**Prioridade:** P0 (Must Have)
**Status:** TODO
**Atribuído a:** Desenvolvedor Frontend

### Descrição

Como gerenciador, quero visualizar um gráfico mostrando quantos profissionais estão alocados em cada cliente, para entender a concentração de recursos.

### Critérios de Aceitação

- [ ] Gráfico de barra horizontal ou vertical implementado
- [ ] Cada cliente exibido como uma barra/slice
- [ ] Ordenação por quantidade decrescente
- [ ] Cores diferentes para cada cliente (palette)
- [ ] Tooltip mostrando cliente, quantidade e percentual
- [ ] Top 10 clientes (com "Outros" agrupados se necessário)
- [ ] Responsivo em mobile
- [ ] Clique em bar permite drill-down (futuro link)

### Tarefas Técnicas

- [ ] Usar mesma biblioteca de gráficos do EP-010
- [ ] Criar componente `ClientChart`
- [ ] Implementar query Supabase:
  ```sql
  SELECT c.nome, COUNT(p.id) as count
  FROM contratos ct
  JOIN profissionais p ON ct.profissional_id = p.id
  JOIN clientes c ON ct.cliente_id = c.id
  WHERE ct.status = 'ativo'
  GROUP BY c.id, c.nome
  ORDER BY count DESC
  LIMIT 10
  ```
- [ ] Tratamento para > 10 clientes (agrupar em "Outros")
- [ ] Geração de palette de cores
- [ ] Animação de entrada

### Notas

- Considerar usar color palette da biblioteca para escalabilidade
- Validar performance com muitos clientes
- Documentar like data em PLANO_TESTES.md

---

## EP-012: Listagem de profissionais com tabela

**Tipo:** Feature
**Story Points:** 8
**Prioridade:** P0 (Must Have)
**Status:** TODO
**Atribuído a:** Tide Cardoso

### Descrição

Como gerenciador, quero visualizar uma tabela listando todos os profissionais com informações como nome, email, senioridade, cliente atual e status, para ter uma visão completa da equipe.

### Critérios de Aceitação

- [ ] Tabela criada com colunas:
  - [ ] Nome (clicável para detalhes)
  - [ ] Email
  - [ ] Senioridade (com badge visual)
  - [ ] Cliente atual (com cor)
  - [ ] Status (Ativo, Inativo, em Férias)
  - [ ] Data de início do contrato
- [ ] Tabela carrega com dados reais
- [ ] Linha clicável abre página de detalhes
- [ ] Tabela com scroll horizontal em mobile
- [ ] Sem truncamento de dados (usar ellipsis com tooltip)
- [ ] Hover visual em linhas
- [ ] Carregamento <2s com até 1000 registros

### Tarefas Técnicas

- [ ] Usar shadcn/ui Table component
- [ ] Criar componente `ProfissionaisTable`
- [ ] Implementar server action para busca de profissionais
- [ ] Query Supabase:
  ```sql
  SELECT p.*, c.nome as cliente_nome, ct.data_inicio
  FROM profissionais p
  LEFT JOIN contratos ct ON p.id = ct.profissional_id AND ct.status = 'ativo'
  LEFT JOIN clientes c ON ct.cliente_id = c.id
  ORDER BY p.nome
  ```
- [ ] Criar badge components para Status e Senioridade
- [ ] Implementar row click handler
- [ ] Testar com dados variados

### Notas

- Preparar para paginação em EP-015
- Considerar virtual scrolling se > 10k registros
- Documentar data model em ARQUITETURA

---

## EP-013: Filtros de profissionais

**Tipo:** Feature
**Story Points:** 5
**Prioridade:** P0 (Must Have)
**Status:** TODO
**Atribuído a:** Desenvolvedor Frontend

### Descrição

Como gerenciador, quero filtrar a listagem de profissionais por cliente, status, senioridade e tipo de contrato, para focar na informação que preciso.

### Critérios de Aceitação

- [ ] Filtros implementados:
  - [ ] Cliente (select multi-choice)
  - [ ] Status (checkbox: Ativo, Inativo, em Férias)
  - [ ] Senioridade (checkbox: Junior, Pleno, Sênior, Líder)
  - [ ] Tipo de Contrato (checkbox: PJ, CLT, Freelancer)
- [ ] Filtros aplicáveis simultaneamente
- [ ] URL reflete filtros selecionados (query params)
- [ ] Tabela atualiza em tempo real conforme filtros
- [ ] Botão "Limpar filtros" limpa todos
- [ ] Indicador visual de filtros ativos
- [ ] Responsivo em mobile (dropdown colapsível)

### Tarefas Técnicas

- [ ] Criar componente `FilterBar` reutilizável
- [ ] Criar componentes para cada tipo de filtro
- [ ] Usar React Hook Form para gerenciar estado
- [ ] Implementar query dinâmica baseada em filtros
- [ ] Usar URL search params (next/navigation)
- [ ] Debounce de queries (300ms)
- [ ] Adicionar "No results" state
- [ ] Testar combinações de filtros

### Notas

- Considerar salvar filtros em localStorage para próxima visita
- Preparar para salvar filtros favoritos em futuro
- Acessibilidade: usar semantic HTML e ARIA labels

---

## EP-014: Busca por nome/email com debounce

**Tipo:** Feature
**Story Points:** 3
**Prioridade:** P0 (Must Have)
**Status:** TODO
**Atribuído a:** Desenvolvedor Frontend

### Descrição

Como gerenciador, quero buscar profissionais por nome ou email rapidamente, para encontrar um específico sem filtros complexos.

### Critérios de Aceitação

- [ ] Campo de busca implementado no topo da tabela
- [ ] Busca funciona em tempo real (debounce 300ms)
- [ ] Busca em campos:
  - [ ] Nome
  - [ ] Email
  - [ ] Documento (CPF/CNPJ)
- [ ] Case-insensitive
- [ ] Retorna resultados de forma rápida
- [ ] Limpar busca reseta a tabela
- [ ] Icon visual de busca
- [ ] Loading state enquanto busca

### Tarefas Técnicas

- [ ] Usar shadcn/ui Input component
- [ ] Implementar useCallback com debounce
- [ ] Query Supabase com ILIKE:
  ```sql
  WHERE p.nome ILIKE $1
     OR p.email ILIKE $1
     OR p.documento ILIKE $1
  ```
- [ ] Usar useMemo para otimizar
- [ ] Integrar com filtros (AND lógico)
- [ ] Testar performance com muitos dados

### Notas

- Usar `lodash.debounce` ou implementar custom
- Considerar full-text search no Supabase se necessário
- Documentar query pattern

---

## EP-015: Paginação da listagem

**Tipo:** Feature
**Story Points:** 3
**Prioridade:** P0 (Must Have)
**Status:** TODO
**Atribuído a:** Desenvolvedor Frontend

### Descrição

Como sistema, quero implementar paginação na listagem de profissionais, para otimizar performance e experiência do usuário com muitos registros.

### Critérios de Aceitação

- [ ] Paginação com controles:
  - [ ] Botões Anterior/Próxima
  - [ ] Seletora de página
  - [ ] Items per page (10, 25, 50, 100)
- [ ] URL reflete página atual (query params)
- [ ] Mantém filtros/busca ao paginar
- [ ] Mostra "página X de Y" e "total de Z registros"
- [ ] Primeira/última página desabilitadas apropriadamente
- [ ] Smooth scroll to top ao mudar página
- [ ] Server-side pagination para performance

### Tarefas Técnicas

- [ ] Criar componente `Pagination`
- [ ] Implementar offset/limit no Supabase
- [ ] Usar shadcn/ui pagination components
- [ ] Query com COUNT para total
- [ ] Usar search params do Next.js
- [ ] Testar com diferentes volumes de dados

### Notas

- Implementar lazy loading das páginas
- Considerar usar React Query para caching
- Documentar padrão de paginação

---

## EP-016: Página de detalhes do profissional

**Tipo:** Feature
**Story Points:** 8
**Prioridade:** P0 (Must Have)
**Status:** TODO
**Atribuído a:** Desenvolvedor Frontend

### Descrição

Como gerenciador, quero ver uma página de detalhes com todas as informações de um profissional específico (contatos, contratos, equipamentos, férias), para acessar dados completos.

### Critérios de Aceitação

- [ ] Página contém seções:
  - [ ] Informações pessoais (nome, email, telefone, documento, endereço)
  - [ ] Histórico de contratos (cliente, datas, status)
  - [ ] Equipamentos atribuídos (lista com datas)
  - [ ] Períodos de férias agendadas
  - [ ] Últimas alterações (audit log básico)
- [ ] Dados carregam do Supabase
- [ ] Back button retorna à listagem com filtros mantidos
- [ ] Responsivo em mobile
- [ ] Loading skeleton enquanto carrega
- [ ] Mostrar "Sem dados" para seções vazias

### Tarefas Técnicas

- [ ] Criar página `app/profissionais/[id]/page.tsx`
- [ ] Usar dynamic route params
- [ ] Implementar server component para dados
- [ ] Criar componentes:
  - [ ] `ProfissionalHeader` (info básica)
  - [ ] `ContratosList` (histórico)
  - [ ] `EquipamentosList`
  - [ ] `FeriasList`
  - [ ] `AuditLog`
- [ ] Queries Supabase:
  - Dados do profissional
  - Contratos relacionados
  - Equipamentos
  - Férias
  - Alterações (audit log)
- [ ] Testar com profissionais com dados variados

### Notas

- Preparar para edição em Sprint 5
- Considerar use of Date components para período de férias
- Documentar componentes criados

---

## EP-017: Testes unitários dos componentes Sprint 2

**Tipo:** Testing
**Story Points:** 5
**Prioridade:** P1 (Should Have)
**Status:** TODO
**Atribuído a:** Desenvolvedor Frontend

### Descrição

Como desenvolvedor, quero ter testes unitários cobrindo os componentes principais da Sprint 2, para garantir qualidade e evitar regressões.

### Critérios de Aceitação

- [ ] Testes criados para:
  - [ ] KPICard component (renderização, props)
  - [ ] Gráficos (dados, interatividade)
  - [ ] Tabela (renderização com dados)
  - [ ] Filtros (aplicação, limpeza)
  - [ ] Busca (debounce, resultados)
  - [ ] Paginação (navegação, URL)
- [ ] Cobertura mínima 80% dos componentes
- [ ] Testes de snapshot para componentes visuais
- [ ] Testes de integração para filtro + busca + paginação
- [ ] Mocks de dados Supabase
- [ ] Testes passam localmente e no CI

### Tarefas Técnicas

- [ ] Criar `__tests__/` para cada componente
- [ ] Usar Vitest + React Testing Library
- [ ] Mock de Supabase client
- [ ] Mock de data para testes
- [ ] Testes de renderização
- [ ] Testes de user interactions
- [ ] Testes de dados variados
- [ ] Coverage report gerado

### Notas

- Seguir padrão TDD quando possível
- Documentar estratégia de mocking
- Considerar testes E2E em Sprint 3

---

## Resumo da Sprint

| ID | Story | Pts | P | Status |
|---|---|---|---|---|
| EP-009 | Dashboard com KPI Cards | 8 | P0 | TODO |
| EP-010 | Gráfico de distribuição por senioridade | 5 | P0 | TODO |
| EP-011 | Gráfico de distribuição por cliente | 5 | P0 | TODO |
| EP-012 | Listagem de profissionais com tabela | 8 | P0 | TODO |
| EP-013 | Filtros de profissionais | 5 | P0 | TODO |
| EP-014 | Busca por nome/email com debounce | 3 | P0 | TODO |
| EP-015 | Paginação da listagem | 3 | P0 | TODO |
| EP-016 | Página de detalhes do profissional | 8 | P0 | TODO |
| EP-017 | Testes unitários dos componentes Sprint 2 | 5 | P1 | TODO |

**Total:** 50 story points

---

**Última atualização:** 5 de abril de 2026
**Próximo review:** 4 de maio de 2026
