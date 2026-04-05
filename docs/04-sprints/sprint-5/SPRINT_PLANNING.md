# Sprint 5 - Planejamento

**Período:** Semanas 9-10 (2 de junho - 15 de junho de 2026)
**Sprint Goal:** CRUD completo para profissionais e clientes

## Visão Geral

Sprint 5 transforma o MVP read-only em um sistema totalmente funcional com capacidade de criar, editar e deletar dados. Foco em validação robusta de formulários e integridade de dados.

## Duração da Sprint

- **Data de Início:** Segunda-feira, 2 de junho de 2026
- **Data de Término:** Domingo, 15 de junho de 2026
- **Duração:** 2 semanas (10 dias úteis)

## Capacidade da Equipe

**Velocidade Esperada:** 34 story points

## Compromissos da Sprint

1. **EP-032:** Formulário de criação de profissional (8 pts)
2. **EP-033:** Formulário de edição de profissional (5 pts)
3. **EP-034:** Exclusão de profissional com confirmação (3 pts)
4. **EP-035:** CRUD de clientes (5 pts)
5. **EP-036:** Validação de formulários (Zod + React Hook Form) (5 pts)
6. **EP-037:** Optimistic updates e loading states (3 pts)
7. **EP-038:** Testes unitários e integração CRUD (5 pts)

**Total Planejado:** 34 story points

## Riscos e Dependências

### Riscos

| ID | Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|---|
| R1 | Validação de dados complexa | Média | Alto | Usar Zod com schema detalhado, testar edge cases |
| R2 | Operações de banco falham | Média | Alto | Implementar rollback e error handling |
| R3 | Duplicação de chaves estrangeiras | Média | Médio | Implementar validação unique no banco |

### Dependências

- Toda sprint depende de Sprints 1-4 completas
- EP-035 (CRUD Clientes) usa padrões de EP-032/033

## Definição de Pronto

- [ ] Formulário validado com todas as regras
- [ ] Erro tratado e exibido de forma clara
- [ ] Dados salvos corretamente no Supabase
- [ ] RLS policies respeitadas

## Critérios de Sucesso

1. Todos os 7 stories concluídos (34 pontos)
2. CRUD 100% funcional sem data loss
3. Validação robusta em todas as entrada
4. Testes cobrindo casos de sucesso e erro

---

**Aprovado por:** Orchestrator
**Data:** 5 de abril de 2026
