# Sprint 3 - Planejamento

**Período:** Semanas 5-6 (5 de maio - 18 de maio de 2026)
**Sprint Goal:** Visões por cliente e sistema de alertas de renovação

## Visão Geral

Sprint 3 expande o MVP com visões específicas por cliente e implementa o sistema crítico de alertas de renovação de contratos. Este é um componente essencial para a operação diária do grupo Elopar.

## Duração da Sprint

- **Data de Início:** Segunda-feira, 5 de maio de 2026
- **Data de Término:** Domingo, 18 de maio de 2026
- **Duração:** 2 semanas (10 dias úteis)

## Capacidade da Equipe

**Velocidade Esperada:** 39 story points

## Compromissos da Sprint

1. **EP-018:** Listagem de clientes com cards (5 pts)
2. **EP-019:** Página de detalhes do cliente (8 pts)
3. **EP-020:** Sistema de alertas de renovação (8 pts)
4. **EP-021:** Página de renovações com tabs por urgência (5 pts)
5. **EP-022:** Indicadores visuais de urgência (countdown, cores) (3 pts)
6. **EP-023:** Testes de integração API/Actions (5 pts)
7. **EP-024:** Testes E2E auth + dashboard (5 pts)

**Total Planejado:** 39 story points

## Riscos e Dependências

### Riscos

| ID | Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|---|
| R1 | Sistema de alertas complexo que impacta performance | Média | Alto | Implementar com fila de processamento (background job) |
| R2 | Lógica de cálculo de urgência ambígua | Média | Médio | Detalhar critérios na primeira daily |
| R3 | E2E tests instáveis em CI | Média | Médio | Usar retry logic e waits apropriados |

### Dependências

- Toda sprint depende de Sprint 1 e 2 completas
- EP-020 (Sistema de alertas) é base para EP-021 e EP-022
- EP-024 (E2E) depende de EP-020 estar funcional

## Definição de Pronto

Mesmos critérios de Sprint 2, com adição de:
- [ ] Alertas testados com múltiplos cenários de urgência
- [ ] E2E tests passando em múltiplos browsers

## Critérios de Sucesso

1. Todos os 7 stories concluídos (39 pontos)
2. Sistema de alertas em produção sem bugs críticos
3. E2E test suite executando com 100% de sucesso
4. Velocity consistente com Sprints anteriores

---
