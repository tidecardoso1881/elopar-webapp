# Sprint 3 - Backlog Detalhado

**Sprint:** 3 | **Período:** 5-18 de maio de 2026 | **Velocidade:** 39 story points

---

## EP-018: Listagem de clientes com cards

**Tipo:** Feature
**Story Points:** 5
**Prioridade:** P0 (Must Have)
**Status:** TODO
**Atribuído a:** Desenvolvedor Frontend

### Descrição

Como gerenciador, quero visualizar todos os clientes em um formato de cards com informações resumidas, para navegar entre clientes e acessar detalhes específicos.

### Critérios de Aceitação

- [ ] Cards exibidos em grid responsivo (3 colunas desktop, 1 mobile)
- [ ] Cada card mostra:
  - [ ] Nome do cliente
  - [ ] Número de profissionais alocados
  - [ ] Próximas datas de renovação
  - [ ] Status visual (Ativo/Inativo)
- [ ] Cards clicáveis levam para página de detalhes
- [ ] Busca e filtro por status
- [ ] Carregamento < 1.5s

### Tarefas Técnicas

- [ ] Criar componente `ClientGrid`
- [ ] Criar componente reutilizável `ClientCard`
- [ ] Query Supabase para clientes com contagem
- [ ] Implementar grid responsivo com Tailwind
- [ ] Adicionar skeleton loaders

### Notas

- Coordenar design com EP-019
- Preparar para sorting em futuro

---

## EP-019: Página de detalhes do cliente

**Tipo:** Feature
**Story Points:** 8
**Prioridade:** P0 (Must Have)
**Status:** TODO
**Atribuído a:** Tide Cardoso

### Descrição

Como gerenciador, quero ver uma página detalhada de cada cliente com dados completos, histórico de contratos e indicadores de saúde do relacionamento.

### Critérios de Aceitação

- [ ] Página contém:
  - [ ] Informações básicas (nome, CNPJ, contato)
  - [ ] Lista de profissionais alocados (tabela)
  - [ ] Histórico de contratos com datas
  - [ ] Próximas renovações (em destaque)
  - [ ] Indicador de "saúde" do cliente
- [ ] Botão para retornar à listagem
- [ ] Dados carregam do Supabase
- [ ] Responsivo em mobile
- [ ] Loading state apropriado

### Tarefas Técnicas

- [ ] Criar página `app/clientes/[id]/page.tsx`
- [ ] Criar componentes para cada seção
- [ ] Queries Supabase para dados correlatos
- [ ] Integrar com EP-020 (alertas de renovação)

### Notas

- Preparar para edição em Sprint 5
- Considerar gráfico de timeline de contratos

---

## EP-020: Sistema de alertas de renovação

**Tipo:** Feature
**Story Points:** 8
**Prioridade:** P0 (Must Have)
**Status:** TODO
**Atribuído a:** Tide Cardoso

### Descrição

Como sistema, quero identificar contratos próximos de renovação e gerar alertas com diferentes níveis de urgência, para que o gerenciador possa se preparar com antecedência.

### Critérios de Aceitação

- [ ] Alertas categorizados por urgência:
  - [ ] CRÍTICO: 0-14 dias (vermelho)
  - [ ] URGENTE: 15-30 dias (laranja)
  - [ ] NORMAL: 31-60 dias (amarelo)
  - [ ] INFO: > 60 dias (azul)
- [ ] Algoritmo detecta automaticamente:
  - [ ] Contratos com data_fim próxima
  - [ ] Contratos pendentes de renovação
  - [ ] Contratos em risco
- [ ] Alertas armazenados em tabela `alertas`
- [ ] Sem duplicatas de alertas
- [ ] Processamento executado via:
  - [ ] Supabase Edge Function (cron job)
  - OU Webhook chamado periodicamente
- [ ] Performance: processamento < 5 segundos

### Tarefas Técnicas

- [ ] Criar tabela `alertas` no banco
- [ ] Criar migration para tabela
- [ ] Implementar lógica de cálculo de urgência
- [ ] Criar Supabase Edge Function `check-renewal-alerts`
- [ ] Configurar cron job (executar a cada 6 horas)
- [ ] Implementar idempotência (evitar duplicatas)
- [ ] Adicionar index em `data_fim` para performance
- [ ] Testar com múltiplos cenários

### Notas

- Usar timezone apropriado (America/Sao_Paulo)
- Considerar notificações de email em futuro
- Documentar lógica de cálculo de urgência

---

## EP-021: Página de renovações com tabs por urgência

**Tipo:** Feature
**Story Points:** 5
**Prioridade:** P0 (Must Have)
**Status:** TODO
**Atribuído a:** Desenvolvedor Frontend

### Descrição

Como gerenciador, quero ver uma página centralizada de renovações com tabs separando por urgência, para priorizar meu trabalho.

### Critérios de Aceitação

- [ ] Página `/renovacoes` com tabs:
  - [ ] Crítico (0-14 dias)
  - [ ] Urgente (15-30 dias)
  - [ ] Normal (31-60 dias)
  - [ ] Informativo (> 60 dias)
- [ ] Cada tab mostra:
  - [ ] Contador de itens
  - [ ] Tabela ou lista de renovações
  - [ ] Cliente, profissional, data de renovação
- [ ] Clicar em uma renovação abre detalhes do cliente
- [ ] Indicador visual da urgência
- [ ] Responsivo em mobile
- [ ] Dados em tempo real (atualizar a cada 30s)

### Tarefas Técnicas

- [ ] Criar página `app/renovacoes/page.tsx`
- [ ] Criar componente `RenovacoesTabs`
- [ ] Query Supabase para alertas por urgência
- [ ] Usar shadcn/ui Tabs component
- [ ] Implementar auto-refresh

### Notas

- Coordenar com EP-020 para dados
- Considerar filtro por cliente/profissional

---

## EP-022: Indicadores visuais de urgência (countdown, cores)

**Tipo:** Feature
**Story Points:** 3
**Prioridade:** P0 (Must Have)
**Status:** TODO
**Atribuído a:** Desenvolvedor Frontend

### Descrição

Como usuário, quero visualizar indicadores visuais claros que mostrem quanto tempo falta para renovação, com cores associadas à urgência.

### Critérios de Aceitação

- [ ] Componente `UrgencyBadge` criado com:
  - [ ] Cor apropriada (vermelho, laranja, amarelo, azul)
  - [ ] Número de dias restantes
  - [ ] Ícone visual (relógio, alerta, etc.)
- [ ] Componente reutilizável em múltiplas páginas
- [ ] Countdown reativo (atualiza a cada dia)
- [ ] Acessível para leitores de tela
- [ ] Responsivo em mobile

### Tarefas Técnicas

- [ ] Criar componente `UrgencyBadge`
- [ ] Implementar cálculo de dias restantes
- [ ] Usar cores do Design System
- [ ] Adicionar ícones do Lucide React
- [ ] Testes de renderização

### Notas

- Usar componentes shadcn/ui base
- Considerar animação sutil para CRÍTICO

---

## EP-023: Testes de integração API/Actions

**Tipo:** Testing
**Story Points:** 5
**Prioridade:** P1 (Should Have)
**Status:** TODO
**Atribuído a:** Desenvolvedor Frontend

### Descrição

Como desenvolvedor, quero ter testes de integração cobrindo as server actions e APIs da Sprint 3, para garantir que front-end e back-end comunicam corretamente.

### Critérios de Aceitação

- [ ] Testes para:
  - [ ] Fetch de clientes (EP-018)
  - [ ] Fetch de detalhes do cliente (EP-019)
  - [ ] Cálculo de alertas (EP-020)
  - [ ] Busca de renovações (EP-021)
- [ ] Mocks de Supabase
- [ ] Validação de dados retornados
- [ ] Tratamento de erros
- [ ] Cobertura mínima 75%

### Tarefas Técnicas

- [ ] Criar `__tests__/integration/` directory
- [ ] Testes usando Vitest
- [ ] Mock de Supabase queries
- [ ] Testes de server actions
- [ ] Coverage report

### Notas

- Seguir padrão TDD
- Documentar mocks criados

---

## EP-024: Testes E2E auth + dashboard

**Tipo:** Testing
**Story Points:** 5
**Prioridade:** P1 (Should Have)
**Status:** TODO
**Atribuído a:** Desenvolvedor Frontend

### Descrição

Como desenvolvedor, quero ter testes E2E cobrindo fluxos críticos (login, dashboard, navegação), para garantir funcionalidade end-to-end.

### Critérios de Aceitação

- [ ] Testes E2E com Playwright para:
  - [ ] Login e logout
  - [ ] Visualizar dashboard
  - [ ] Navegar para clientes
  - [ ] Ver renovações
  - [ ] Clicar em detalhes
- [ ] Testes rodam em CI/CD
- [ ] Tempo total < 5 minutos
- [ ] Nenhum flakiness (retry logic se necessário)
- [ ] Screenshots em caso de falha

### Tarefas Técnicas

- [ ] Instalar Playwright
- [ ] Criar arquivo `e2e/critical.spec.ts`
- [ ] Implementar fixtures para auth
- [ ] Testes de navegação
- [ ] Testes de dados críticos
- [ ] CI integration (GitHub Actions)

### Notas

- Usar page objects pattern
- Considerar múltiplos browsers (Chrome, Firefox)

---

## Resumo da Sprint

| ID | Story | Pts | P | Status |
|---|---|---|---|---|
| EP-018 | Listagem de clientes com cards | 5 | P0 | TODO |
| EP-019 | Página de detalhes do cliente | 8 | P0 | TODO |
| EP-020 | Sistema de alertas de renovação | 8 | P0 | TODO |
| EP-021 | Página de renovações com