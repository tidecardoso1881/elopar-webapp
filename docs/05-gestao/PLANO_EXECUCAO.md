# Plano de Execução - Elopar

**Projeto:** Sistema de Gestão de Profissionais - Grupo Elopar
**Duração:** 12 semanas | **Data de Início:** 7 de abril de 2026 | **Data de Término:** 29 de junho de 2026
**Status:** Planejado

---

## 1. Visão Geral do Projeto

### Objetivo Principal
Desenvolver um MVP de gestão de profissionais para o Grupo Elopar, permitindo visualização read-only inicial com progressão para CRUD completo, sistema de alertas de renovação de contratos e relatórios básicos.

### Marcos Principais
1. **Sprint 0 (Completada):** Planejamento e especificação
2. **Sprint 1 (Apr 7-20):** Infraestrutura e Setup
3. **Sprint 2 (Apr 21 - May 4):** MVP Read-only
4. **Sprint 3 (May 5-18):** Visões e Alertas
5. **Sprint 4 (May 19 - Jun 1):** Polish e Mobile
6. **Sprint 5 (Jun 2-15):** CRUD Completo
7. **Sprint 6 (Jun 16-29):** Features Avançadas e Launch

### Entregáveis
- Sistema web fully funcional em produção
- Documentação técnica completa
- Manual do usuário
- Testes automatizados (unit, integration, E2E)

---

## 2. Timeline e Cronograma Detalhado

### Sprint 1: Fundação e Setup (7-20 de abril)

**Semana 1 (7-13 de abril)**
- Seg 7: Sprint Planning + Kickoff (10:00)
- Ter-Sex: Desenvolvimento de EP-001 a EP-003
- Fri 13: Mid-sprint review (15:00)

**Semana 2 (14-20 de abril)**
- Seg 14: Continuação EP-004 (autenticação - crítico)
- Ter-Qui: Finalizações (EP-005 a EP-008)
- Dom 20: Sprint Review (15:00) + Retrospectiva (15:30)

**Deliverables esperados:** Ambiente completo, auth funcionando, banco de dados com seed

---

### Sprint 2: MVP Read-only (21 abr - 4 maio)

**Semana 3 (21-27 de abril)**
- Seg 21: Sprint Planning (10:00)
- Ter-Fri: Dashboard (EP-009) + Gráficos (EP-010, EP-011)
- Fri 27: Mid-sprint review

**Semana 4 (28 abr - 4 maio)**
- Seg 28: Continuação listagem (EP-012)
- Ter-Fri: Filtros (EP-013), Busca (EP-014), Paginação (EP-015)
- Dom 4: Sprint Review (15:00) + Retro (15:30)

**Deliverables esperados:** Dashboard visual, listagem com filtros, primeira validação de dados

---

### Sprint 3: Visões e Alertas (5-18 de maio)

**Semana 5 (5-11 de maio)**
- Seg 5: Sprint Planning (10:00)
- Ter-Fri: Clientes (EP-018, EP-019), Sistema de alertas (EP-020 - início)
- Fri 11: Mid-sprint review

**Semana 6 (12-18 de maio)**
- Seg 12: Continuação EP-020
- Ter-Fri: Página de renovações (EP-021), Indicadores (EP-022)
- Dom 18: Sprint Review + Retro

**Deliverables esperados:** Alertas de renovação funcionando, testes E2E iniciados

---

### Sprint 4: Polish e Mobile (19 maio - 1 junho)

**Semana 7 (19-25 de maio)**
- Seg 19: Sprint Planning (10:00)
- Ter-Fri: Equipamentos (EP-025), Férias (EP-026 - início)
- Fri 25: Mid-sprint review

**Semana 8 (26 maio - 1 junho)**
- Seg 26: Continuação férias, Mobile (EP-027 - início)
- Ter-Fri: Mobile responsividade, Performance (EP-028)
- Dom 1: Sprint Review + Retro

**Deliverables esperados:** Aplicação completamente responsiva, Core Web Vitals > 85

---

### Sprint 5: CRUD Completo (2-15 de junho)

**Semana 9 (2-8 de junho)**
- Seg 2: Sprint Planning (10:00)
- Ter-Fri: Formulários de criação (EP-032), Edição (EP-033)
- Fri 8: Mid-sprint review

**Semana 10 (9-15 de junho)**
- Seg 9: Conclusão formulários, Deleção (EP-034)
- Ter-Fri: CRUD de clientes (EP-035), Validações (EP-036)
- Dom 15: Sprint Review + Retro

**Deliverables esperados:** Sistema CRUD totalmente funcional, integridade de dados garantida

---

### Sprint 6: Features Avançadas e Launch (16-29 de junho)

**Semana 11 (16-22 de junho)**
- Seg 16: Sprint Planning (10:00)
- Ter-Fri: Export (EP-039), Relatórios (EP-040 - início)
- Fri 22: Mid-sprint review

**Semana 12 (23-29 de junho)**
- Seg 23: Continuação relatórios, Audit log (EP-041)
- Ter-Qui: Documentação (EP-044), Deploy (EP-045)
- Sex 28: Final testing, production deployment
- Dom 29: Sprint Review + Retro + Go-Live!

**Deliverables esperados:** Sistema em produção, documentação completa, suporte iniciado

---

## 3. Milestones Críticos

| Data | Milestone | Status | Responsável |
|---|---|---|---|
| 7 de abril | Kickoff Sprint 1 | Planejado | Orchestrator |
| 20 de abril | Infraestrutura completa | Esperado | Tide Cardoso |
| 4 de maio | MVP read-only em dev | Esperado | Tide Cardoso |
| 18 de maio | Sistema de alertas funcional | Esperado | Tide Cardoso |
| 1 de junho | Aplicação mobile-ready | Esperado | Tide Cardoso |
| 15 de junho | CRUD completo, pronto para staging | Esperado | Tide Cardoso |
| 28 de junho | Aprovação final para produção | Esperado | Orchestrator |
| 29 de junho | Go-live em produção | Esperado | Tide Cardoso |

---

## 4. Dependências Entre Sprints

```
Sprint 0 (Planning)
    ↓
Sprint 1 (Infrastructure) ← BLOQUEADOR: Deve estar 100% antes de Sprint 2
    ↓
Sprint 2 (Read-only) ← Depende de Sprint 1
    ↓
Sprint 3 (Alerts) ← Depende de Sprints 1-2
    ↓
Sprint 4 (Polish) ← Depende de Sprints 1-3
    ↓
Sprint 5 (CRUD) ← Depende de Sprints 1-4
    ↓
Sprint 6 (Launch) ← Depende de Sprints 1-5
    ↓
Go-Live em Produção
```

### Riscos de Dependência
- Se Sprint 1 atrasar, todas as sprints subsequentes atrasam
- Se sistema de alertas (Sprint 3) falhar, impact forte em operação diária
- Mobile responsividade (Sprint 4) não pode atrasar Sprint 5

---

## 5. Organização da Equipe

### Composição

**Tide Cardoso** (Dev Fullstack)
- Capacidade: 40 horas/semana
- Responsabilidade: Desenvolvimento full-stack de todas as sprints
- Escalação: Orquestrador para bloqueadores

**Orquestrador** (Project Manager)
- Capacidade: ~5-10 horas/semana
- Responsabilidade: Aprovações, review, desbloqueadores, comunicação
- Participação: Dailies, reviews, planning, retrospectivas

**Suporte Externo (Conforme Necessário)**
- Frontend specialist: Se Sprint 2+ atrasarem
- QA/Tester: Para testes E2E e performance
- DevOps: Para setup Vercel/Supabase se necessário

### Capacidade Total
- Sprint 1-6: ~40 pontos/sprint = 240 pontos totais planejados
- Capacidade Tide: ~40 pontos/sprint
- Margem de segurança: ~5-10 pontos por sprint para bugs/refactoring

---

## 6. Estrutura de Reuniões

### Reuniões Regulares

**Daily Standup**
- Hora: 09:30 UTC-3 (todos os dias úteis)
- Duração: 15 minutos
- Participants: Tide + Orquestrador
- Pauta: O que fiz, o que faço, blockers

**Sprint Planning**
- Hora: 10:00 (dia 1 de cada sprint)
- Duração: 60-90 minutos
- Pauta: Seleção de stories, estimativas, planejamento

**Sprint Review**
- Hora: 15:00 (último dia de sprint)
- Duração: 45 minutos
- Pauta: Demonstração de features, feedback, ajustes

**Retrospectiva**
- Hora: 15:30 (último dia de sprint)
- Duração: 45 minutos
- Pauta: O que funcionou, o que não funcionou, melhorias

**Mid-Sprint Review**
- Hora: 15:00 (meio da sprint)
- Duração: 30 minutos
- Pauta: Check-in de progresso, re-estimativa se necessário

### Canais de Comunicação
- **Reuniões síncronas:** Discord voice
- **Chat:** Discord #elopar-dev
- **Issues/PRs:** GitHub
- **Documentação:** Google Drive / GitHub Wiki
- **Escalações:** Email + Discord @mention

---

## 7. Gestão de Riscos

### Matriz de Riscos

| ID | Risco | Prob. | Impacto | Mitigação | Owner |
|---|---|---|---|---|---|
| R1 | Sprint 1 infrastructure atrasa | Médio | Crítico | Iniciar ASAP, ter alternativas | Tide |
| R2 | Dados Excel inconsistentes | Médio | Alto | Validar dados antecipadamente | Orchest. |
| R3 | Supabase free tier limita performance | Baixo | Alto | Planejar upgrade antecipado | Tide |
| R4 | CRUD Sprint 5 mais complexo que estimado | Médio | Médio | Começar cedo, simplificar scope | Tide |
| R5 | Acessibilidade (Sprint 4) requer refactor | Médio | Médio | Implementar desde início | Tide |
| R6 | Deploy produção descobre problemas | Médio | Alto | Staging environment, rehearse | Tide |
| R7 | Churn de equipe | Baixo | Crítico | Documentação clara, onboarding | Orchest. |

### Plano de Contingência

**Se Sprint 1 atrasar (atraso > 2 dias):**
1. Aumentar horas de Tide (overtime aprovado)
2. Trazer dev externo para paralelizar
3. Reduzir scope de Sprint 2 (remover gráficos)

**Se dados Excel estão ruins (descoberto em Sprint 1):**
1. Parar seed momentaneamente
2. Executar data cleanup
3. Criar script de validação
4. Continuar com subset de dados limpos

**Se performance de Supabase inadequada:**
1. Upgrade para paid plan
2. Implementar caching (Redis)
3. Otimizar queries + índices
4. Considerar CDN para assets

**Se E2E tests flaky (Sprint 3-4):**
1. Migrar para setup mais estável
2. Aumentar retry logic
3. Usar visual testing em vez de E2E
4. Reduzir complexidade de testes

---

## 8. Estratégia de Deployment

### Ambientes

**Development (Local)**
- Máquina do Tide
- Supabase local/staging
- Next.js dev server

**Staging (Pre-production)**
- Vercel staging deployment
- Supabase staging project
- Dados de teste (copy de prod antes de cada teste)
- Purpose: QA final, teste de deploy, performance testing

**Production**
- Vercel production
- Supabase production (single DB)
- Backup diário
- Purpose: Usuários finais

### Processo de Deployment

**Sprint 1-5 (Desenvolvimento)**
```
Local development → GitHub PR → Code review → Merge to develop
develop branch → Auto-deploy to staging (Vercel)
Staging testing → If OK, keep for next sprint
```

**Sprint 6 (Release)**
```
develop branch (Final) → Code review + Orchestrator approval
Merge to main branch
main branch → Auto-deploy to production (Vercel)
Production smoke tests
Go-live announcement
```

### Rollback Strategy
- Manter último commit bem-sucedido tagged em Git
- Vercel permite instant rollback a deployment anterior
- Se database migration quebra:
  1. Revert Vercel deployment
  2. Revert Supabase migration (se reversível)
  3. Comunicar stakeholders

---

## 9. Gestão de Mudanças

### Scope Management
- Toda mudança de scope deve ser aprovada por Orchestrator
- Sprint em andamento: mudanças em "Done" ou defeitos P0/P1 apenas
- Sprint seguinte: adicionar como novo story

### Change Control Board
- **Membro:** Orchestrator (decision maker)
- **Membro:** Tide Cardoso (impact assessment)
- **Frequência:** Ad-hoc ou weekly
- **Critério:** Escopo > 1 dia de trabalho ou mudança arquitetural

### Processo
1. Descrever mudança em GitHub Issue
2. Tide estima impacto + tempo
3. Orchestrator aprova/rejeita
4. Se aprovado, priorizar em backlog

---

## 10. Qualidade e Testes

### Critérios de Aceitação de Features

Toda feature deve ter:
- [ ] Código implementado
- [ ] Code review aprovado
- [ ] Testes unitários (cobertura > 80%)
- [ ] Testes de integração (se aplicável)
- [ ] Tested manualmente em dev
- [ ] Linting + TypeScript check
- [ ] Performance acceptable
- [ ] Acessibilidade WCAG 2.1 AA (Sprint 4+)
- [ ] Documentado

### Processo de QA

**Durante Desenvolvimento:**
- Tide testa localmente enquanto desenvolve
- Daily: Tide testa features em dev com dados reais
- Code review: Orchestrator verifica testes

**End of Sprint:**
- Orchestrator faz smoke testing em staging
- Verifica comportamento esperado
- Testa em múltiplos browsers (Chrome, Firefox, Safari)
- Testa em mobile (iPhone, Android)

**Pre-Production (Sprint 6):**
- Smoke tests em produção
- Verificar dados sensíveis protegidos
- Confirmar backups funcionando
- Confirmar monitoring ativo

---

## 11. Documentação

### Documentos que Devem Existir Ao Final

**Documentação Técnica:**
- [x] ARQUITETURA_SISTEMA.html - Visão geral da arquitetura
- [x] DESIGN_SYSTEM.md - Componentes e padrões
- [x] README.md do projeto - Setup local
- [ ] API Documentation - Endpoints e schemas (Sprint 1+)
- [ ] Database Schema Diagram - (Sprint 1)
- [ ] Deployment Guide - (Sprint 6, EP-044)
- [ ] Runbook de Operações - (Sprint 6, EP-044)

**Documentação do Usuário:**
- [ ] Manual do Usuário - (Sprint 6, EP-044)
- [ ] Vídeos de tutorial - (Sprint 6, EP-044)
- [ ] FAQ - (Sprint 6, EP-044)

**Documentação do Projeto:**
- [x] PLANO_TESTES.md - Estratégia de testes
- [x] DECISION_LOG.md - Decisões arquiteturais
- [x] PLANO_EXECUCAO.md - Este documento
- [x] STATUS_REPORT.md - Status atual

### Responsabilidade
- Tide: Documentação técnica, API, schema
- Orchestrator: Documentação de projeto, decisões
- Ambos: Documentação de procedimentos

---

## 12. Comunicação com Stakeholders

### Status Reports
- **Frequência:** Weekly (Fridays)
- **Para:** Orchestrator (e stakeholders conforme necessário)
- **Conteúdo:** Progresso vs. plano, blockers, outlook

### Sprint Reviews
- **Frequência:** Final de cada sprint
- **Audiência:** Stakeholders, usuários (select)
- **Formato:** Demo de features + feedback

### Escalações
- **Bloqueadores técnicos:** Imediato (Discord)
- **Problemas de scope/timeline:** Daily review
- **Decisões arquiteturais:** Dentro de 24h

---

## 13. Métricas de Sucesso

### Métricas de Projeto

| Métrica | Target | Como Medir |
|---|---|---|
| Velocity | 40 pts/sprint | Soma de story points completados |
| On-time delivery | 100% | Sprint completada dentro do cronograma |
| Code quality | Linting 100% | ESLint, TypeScript strict |
| Test coverage | >80% | Vitest coverage report |
| Performance | LCP < 2.5s | Lighthouse score |
| Acessibilidade | WCAG 2.1 AA | axe audit |
| Deployment success | 100% | Zero critical errors em prod |

### Métricas de Qualidade

| Métrica | Target |
|---|---|
| Bug escape rate | < 1% (bugs em prod vs. encontrado em teste) |
| Code review approval rate | > 90% (PRs aprovadas vs. total) |
| Regression issues | 0 (issues em features já prontas) |

---

## 14. Encerramento de Projeto

### Atividades Pós-Launch (Sprint 6, EP-045)

1. **Primeiro Dia em Produção (29 de junho)**
   - Monitorar aplicação 24/7
   - Estar pronto para hotfixes críticos
   - Comunicar status para stakeholders

2. **Primeira Semana (30 jun - 6 jul)**
   - Coletar feedback de usuários
   - Corrigir bugs descobertos
   - Documentar issues para futuro

3. **Transição para Suporte**
   - Criar SOP de suporte
   - Treinar suporte/operações
   - Documentar runbook
   - Estabelecer horário de suporte

### Entrega Final
- Código fonte no GitHub (private)
- Toda documentação no wiki/docs
- Database backup
- Processo de deploy documentado
- Equipe de suporte pronta

---

## 15. Próximas Fases (Pós-MVP)

Não incluído no escopo das 12 semanas, mas planejado para futuro:

**Fase 2 - Automações e Integrações**
- Integração com Google Calendar
- Integração com sistemas de folha de pagamento
- Automações de workflow

**Fase 3 - Mobile Native**
- App iOS nativo
- App Android nativo

**Fase 4 - 