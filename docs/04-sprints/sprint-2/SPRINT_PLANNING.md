# Sprint 2 - Planejamento

**Período:** Semanas 3-4 (21 de abril - 4 de maio de 2026)
**Sprint Goal:** Dashboard e listagem de profissionais funcionando

## Visão Geral

Sprint 2 marca o início do desenvolvimento do MVP read-only. O foco é implementar o dashboard com KPI cards, gráficos de distribuição e a listagem de profissionais com filtros e busca. Esta sprint validará a arquitetura configurada em Sprint 1 e entregará valor visual ao projeto.

## Duração da Sprint

- **Data de Início:** Segunda-feira, 21 de abril de 2026
- **Data de Término:** Domingo, 4 de maio de 2026
- **Duração:** 2 semanas (10 dias úteis)
- **Reuniões:**
  - Sprint Planning: 21 de abril, 10:00
  - Daily Standup: Todos os dias úteis, 09:30
  - Sprint Review: 4 de maio, 15:00
  - Retrospectiva: 4 de maio, 15:30

## Capacidade da Equipe

**Composição:**
- Tide Cardoso (Dev Fullstack) - 40 horas/semana
- Desenvolvedor Frontend (conforme necessário) - 20 horas/semana

**Velocidade Esperada:** 50 story points

**Fórmula de Cálculo:**
- Capacidade total: 60 horas/semana
- Overhead (reuniões, comunicação): ~10%
- Capacidade efetiva: ~54 horas/semana
- Pontuação por hora (refinado de Sprint 1): 0,93 pontos/hora
- Capacidade = 54 × 0,93 ≈ 50 pontos

## Compromissos da Sprint

1. **EP-009:** Dashboard com KPI Cards (8 pts)
2. **EP-010:** Gráfico de distribuição por senioridade (5 pts)
3. **EP-011:** Gráfico de distribuição por cliente (5 pts)
4. **EP-012:** Listagem de profissionais com tabela (8 pts)
5. **EP-013:** Filtros de profissionais (cliente, status, senioridade, contrato) (5 pts)
6. **EP-014:** Busca por nome/email com debounce (3 pts)
7. **EP-015:** Paginação da listagem (3 pts)
8. **EP-016:** Página de detalhes do profissional (8 pts)
9. **EP-017:** Testes unitários dos componentes Sprint 2 (5 pts)

**Total Planejado:** 50 story points

## Riscos e Dependências

### Riscos

| ID | Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|---|
| R1 | Sprint 1 não completou com sucesso | Baixa | Crítico | Ter plano B com mock data se Sprint 1 atrasar |
| R2 | Performance do dashboard com muitos dados | Média | Médio | Implementar paginação/lazy loading desde início |
| R3 | Complexidade em gráficos (Recharts/Chart.js) | Baixa | Médio | Pesquisar biblioteca ideal antes de começar |
| R4 | Mudanças no design podem afetar timeline | Média | Médio | Congelar design antes do início da sprint |

### Dependências

- Toda esta sprint depende de Sprint 1 completada
- EP-009 (Dashboard) é base para validação de dados
- EP-012 (Listagem) é dependency para EP-013, EP-014, EP-015
- EP-016 (Detalhes) depende de EP-012 estar funcional

## Definição de Pronto (Definition of Done)

Uma tarefa é considerada **PRONTA** quando:

### Desenvolvimento
- [ ] Código implementado conforme especificação
- [ ] Code review aprovado (mínimo 1 desenvolvedor)
- [ ] Testes unitários implementados (cobertura mínima 80% para componentes)
- [ ] Sem console errors ou warnings
- [ ] Responsividade testada em mobile/tablet/desktop

### Integração
- [ ] Mergeado para branch `develop`
- [ ] Sem conflitos com código existente
- [ ] Funcionalidade testada manualmente em dev
- [ ] Dados reais do Supabase sendo exibidos corretamente

### Performance
- [ ] Carregamento da página < 3 segundos (first contentful paint)
- [ ] Gráficos renderizam sem lag
- [ ] Paginação funciona sem re-render desnecessário
- [ ] Busca com debounce 300ms funcionando

### Qualidade
- [ ] Linting passou (ESLint + Prettier)
- [ ] TypeScript compilation sem erros
- [ ] Acessibilidade básica validada
- [ ] Nenhuma regressão em features anteriores

## Critérios de Sucesso da Sprint

A sprint será considerada bem-sucedida se:

1. Todos os 9 stories forem concluídos (50 pontos)
2. Dashboard visível e funcional com dados reais
3. Listagem de profissionais com todos os filtros operacionais
4. Nenhuma história tiver status BLOCKED ao final
5. Aprovação mínima de 85% nas reviews de código
6. Velocity consistente ou superior a Sprint 1

## Escopo Fora da Sprint

As seguintes tarefas serão adiadas para sprints posteriores:

- Edição de dados (CRUD)
- Visões por cliente (Sprint 3)
- Sistema de alertas de renovação (Sprint 3)
- Export de dados (Sprint 6)
- Features avançadas (Sprint 6)

## Notas Importantes

- Design System deve estar finalizado e pronto para uso
- Biblioteca de gráficos deve ser definida na primeira daily
- Considerar usar Server Components do Next.js para performance
- Documentar queries Supabase para reutilização posterior
- Validar dados do Excel importado para identificar inconsistências

---

**Aprovado por:** Orchestrator
**Data:** 5 de abril de 2026
**Próximo Review:** 4 de maio de 2026
