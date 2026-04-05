# Sprint 4 - Planejamento

**Período:** Semanas 7-8 (19 de maio - 1 de junho de 2026)
**Sprint Goal:** Módulos complementares e refinamento visual

## Visão Geral

Sprint 4 complementa o MVP com módulos de equipamento e férias, implementa responsividade mobile completa e otimizações de performance. Foco em qualidade visual e acessibilidade.

## Duração da Sprint

- **Data de Início:** Segunda-feira, 19 de maio de 2026
- **Data de Término:** Domingo, 1 de junho de 2026
- **Duração:** 2 semanas (10 dias úteis)

## Capacidade da Equipe

**Velocidade Esperada:** 39 story points

## Compromissos da Sprint

1. **EP-025:** Listagem de equipamentos (5 pts)
2. **EP-026:** Listagem de férias com calendário (8 pts)
3. **EP-027:** Responsividade mobile completa (5 pts)
4. **EP-028:** Performance optimization (5 pts)
5. **EP-029:** Testes E2E completos (8 pts)
6. **EP-030:** Testes de acessibilidade WCAG 2.1 AA (3 pts)
7. **EP-031:** Bug fixes e polish de UI (5 pts)

**Total Planejado:** 39 story points

## Riscos e Dependências

### Riscos

| ID | Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|---|
| R1 | Mobile responsividade quebra outras features | Média | Alto | Testar em múltiplos devices durante desenvolvimento |
| R2 | Performance optimization toma mais tempo | Média | Médio | Usar ferramentas de análise (Lighthouse, Web Vitals) |
| R3 | Acessibilidade descobre muitos problemas | Média | Médio | Fazer audit regular durante sprints anteriores |

### Dependências

- Toda sprint depende de Sprints 1-3 completas
- EP-027 (Mobile) deve estar completo antes de EP-029 (E2E)

## Definição de Pronto

- [ ] Testes passando em mobile devices (320px, 768px, 1024px)
- [ ] Performance Lighthouse > 90 em mobile
- [ ] Acessibilidade WCAG 2.1 AA validada
- [ ] Sem responsive issues identificadas

## Critérios de Sucesso

1. Todos os 7 stories concluídos (39 pontos)
2. Mobile experience indistinguível do desktop
3. Lighthouse scores > 90 em todas as páginas
4. Sem console errors em mobile

---

**Aprovado por:** Orchestrator
**Data:** 5 de abril de 2026
