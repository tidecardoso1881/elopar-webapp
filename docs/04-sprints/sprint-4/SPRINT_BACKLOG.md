# Sprint 4 - Backlog Detalhado

**Sprint:** 4 | **Período:** 19 de maio - 1 de junho de 2026 | **Velocidade:** 39 story points

---

## EP-025: Listagem de equipamentos

**Tipo:** Feature
**Story Points:** 5
**Prioridade:** P0 (Must Have)
**Status:** TODO

### Descrição

Como gerenciador, quero visualizar todos os equipamentos com informações de atribuição e status, para gerenciar o inventário.

### Critérios de Aceitação

- [ ] Página `/equipamentos` com tabela de equipamentos
- [ ] Colunas: Descrição, Tipo, Profissional Atribuído, Data Atribuição, Status
- [ ] Filtros por tipo e status
- [ ] Badge visual para status (Disponível, Atribuído, Manutenção)
- [ ] Busca por descrição/número de série
- [ ] Paginação com 25 items por página

### Tarefas Técnicas

- [ ] Criar página `app/equipamentos/page.tsx`
- [ ] Usar componente Table do shadcn/ui
- [ ] Query para JOIN com profissionais
- [ ] Implementar filtros e busca
- [ ] Testes unitários

### Notas

- Preparar para CRUD em Sprint 5
- Considerar QR code scanning em futuro

---

## EP-026: Listagem de férias com calendário

**Tipo:** Feature
**Story Points:** 8
**Prioridade:** P0 (Must Have)
**Status:** TODO

### Descrição

Como gerenciador, quero visualizar as férias agendadas em um calendário, para gerenciar disponibilidade de profissionais.

### Critérios de Aceitação

- [ ] Calendário visual mostrando período de férias
- [ ] Modo de visualização: Mês, Semana
- [ ] Cores diferentes por profissional ou status
- [ ] Clique em dia mostra quem está de férias
- [ ] Vista em tabela alternativa com lista de férias
- [ ] Filtro por profissional
- [ ] Legend com cores/status
- [ ] Responsivo em mobile

### Tarefas Técnicas

- [ ] Instalar biblioteca de calendário (react-big-calendar OU react-calendar)
- [ ] Criar componente `FeriasCalendar`
- [ ] Query Supabase para períodos de férias
- [ ] Mapear dados para formato esperado
- [ ] Implementar views (Mês/Semana)
- [ ] Adicionar componente de tabela alternativa

### Notas

- Escolher biblioteca na primeira daily
- Considerar integração com Google Calendar em futuro

---

## EP-027: Responsividade mobile completa

**Tipo:** Feature
**Story Points:** 5
**Prioridade:** P0 (Must Have)
**Status:** TODO

### Descrição

Como usuário mobile, quero que toda a aplicação funcione perfeitamente em dispositivos pequenos, com layout adaptado e controles touch-friendly.

### Critérios de Aceitação

- [ ] Testar em breakpoints: 320px, 480px, 768px, 1024px, 1280px+
- [ ] Sem scroll horizontal (ou apenas conteúdo específico)
- [ ] Botões com tamanho mínimo 44x44px para touch
- [ ] Navegação mobile com hamburger menu
- [ ] Tabelas com scroll horizontal ou card view
- [ ] Gráficos adaptáveis (redimensionam)
- [ ] Filtros em drawer/accordion em mobile
- [ ] Sem conteúdo "hidden" sem razão

### Tarefas Técnicas

- [ ] Auditar todas as páginas em mobile
- [ ] Ajustar componentes para Tailwind responsive
- [ ] Criar componente `MobileMenu` se necessário
- [ ] Implementar drawer para filtros
- [ ] Testar em emulador e dispositivos reais
- [ ] Usar DevTools do Chrome

### Notas

- Prioridade: Safari iOS também
- Touch-friendly é essencial para operação em campo

---

## EP-028: Performance optimization

**Tipo:** Feature
**Story Points:** 5
**Prioridade:** P1 (Should Have)
**Status:** TODO

### Descrição

Como sistema, quero otimizar performance da aplicação para Core Web Vitals, melhorando experiência do usuário.

### Critérios de Aceitação

- [ ] Lighthouse Performance Score > 90 em desktop
- [ ] Lighthouse Performance Score > 85 em mobile
- [ ] First Contentful Paint < 2s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Cumulative Layout Shift < 0.1
- [ ] Tempo de resposta de API < 500ms

### Tarefas Técnicas

- [ ] Usar Lighthouse para audit
- [ ] Image optimization (Next.js Image)
- [ ] Code splitting automático (Next.js)
- [ ] Lazy loading de componentes pesados
- [ ] Caching de queries Supabase
- [ ] Minificação e compressão
- [ ] Database index optimization

### Notas

- Priorizar LCP e FID
- Usar web-vitals library para monitoring

---

## EP-029: Testes E2E completos para todas as páginas

**Tipo:** Testing
**Story Points:** 8
**Prioridade:** P1 (Should Have)
**Status:** TODO

### Descrição

Como desenvolvedor, quero ter testes E2E cobrindo todos os fluxos principais da aplicação.

### Critérios de Aceitação

- [ ] Testes para todas as páginas principais
- [ ] Testes em múltiplos browsers (Chrome, Firefox)
- [ ] Tempo total < 10 minutos
- [ ] 100% de pass rate
- [ ] Screenshots em falhas
- [ ] Report gerado em CI/CD

### Tarefas Técnicas

- [ ] Expandir suite de testes de Sprint 3
- [ ] Page objects pattern
- [ ] Fixtures para dados de teste
- [ ] Parallel execution
- [ ] CI/CD integration

---

## EP-030: Testes de acessibilidade WCAG 2.1 AA

**Tipo:** Testing
**Story Points:** 3
**Prioridade:** P1 (Should Have)
**Status:** TODO

### Descrição

Como desenvolvedor, quero validar acessibilidade da aplicação conforme WCAG 2.1 AA.

### Critérios de Aceitação

- [ ] Teste de contraste de cores (4.5:1 para texto)
- [ ] Navegação por teclado funcionando
- [ ] Screen reader testado (NVDA/JAWS)
- [ ] ARIA labels apropriados
- [ ] Heading hierarchy correto
- [ ] Sem violations críticas em axe

### Tarefas Técnicas

- [ ] Usar axe DevTools e axe-core
- [ ] Testar com teclado
- [ ] Testar com screen reader
- [ ] Audit com aXe CLI

---

## EP-031: Bug fixes e polish de UI

**Tipo:** Task
**Story Points:** 5
**Prioridade:** P0 (Must Have)
**Status:** TODO

### Descrição

Como produto, quero corrigir bugs encontrados nas sprints anteriores e refinar UI/UX para profissionalismo.

### Critérios de Aceitação

- [ ] Todos os bugs reportados corrigidos (prioridade P0/P1)
- [ ] UI refinamento:
  - [ ] Espaçamento consistente
  - [ ] Animações suaves
  - [ ] Feedback visual melhorado
  - [ ] Hover states em todos os botões
- [ ] Sem regressions
- [ ] QA sign-off

### Tarefas Técnicas

- [ ] Criar lista de bugs em Issues
- [ ] Priorizar e resolver
- [ ] Testes de regressão
- [ ] Code review

---

## Resumo da Sprint

| ID | Story | Pts | P | Status |
|---|---|---|---|---|
| EP-025 | Listagem de equipamentos | 5 | P0 | TODO |
| EP-026 | Listagem de férias com calendário | 8 | P0 | TODO |
| EP-027 | Responsividade mobile completa | 5 | P0 | TODO |
| EP-028 | Performance optimization | 5 | P1 | TODO |