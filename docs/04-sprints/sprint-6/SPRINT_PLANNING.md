# Sprint 6 - Planejamento

**Período:** Semanas 11-12 (16 de junho - 29 de junho de 2026)
**Sprint Goal:** Features avançadas, documentação e launch em produção

## Visão Geral

Sprint 6 é a sprint final do MVP, focando em features avançadas (export, relatórios), documentação completa, testes de carga finais e deployment em produção. Foco em qualidade e preparação para operação.

## Duração da Sprint

- **Data de Início:** Segunda-feira, 16 de junho de 2026
- **Data de Término:** Domingo, 29 de junho de 2026
- **Duração:** 2 semanas (10 dias úteis)

## Capacidade da Equipe

**Velocidade Esperada:** 40 story points

## Compromissos da Sprint

1. **EP-039:** Export para Excel (8 pts)
2. **EP-040:** Relatórios básicos (8 pts)
3. **EP-041:** Audit log de mudanças (5 pts)
4. **EP-042:** Notificações por email (8 pts)
5. **EP-043:** Teste de carga e performance final (3 pts)
6. **EP-044:** Documentação de deploy e manual do usuário (5 pts)
7. **EP-045:** Deploy em produção no Vercel (3 pts)

**Total Planejado:** 40 story points

## Riscos e Dependências

### Riscos

| ID | Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|---|
| R1 | Deploy em produção encontra problemas | Média | Crítico | Fazer staging deploy antes de prod |
| R2 | Relatórios complexos atrasam timeline | Média | Médio | Simplificar escopo se necessário |
| R3 | Email delivery instável | Baixa | Médio | Usar provider confiável (SendGrid, Resend) |

### Dependências

- Toda sprint depende de Sprints 1-5 completas
- EP-039 (Export) pode rodar em paralelo com outras
- EP-045 (Deploy) é último item

## Definição de Pronto

- [ ] Feature funciona em produção
- [ ] Documentação completa
- [ ] Rollback plan preparado
- [ ] Monitoring configurado

## Critérios de Sucesso

1. Todos os 7 stories concluídos (40 pontos)
2. Sistema em produção operacional
3. Documentação clara para usuários
4. Zero downtime deployment
5. Monitoring e alertas ativados

---