# Sprint 1 - Planejamento

**Período:** Semanas 1-2 (7 de abril - 20 de abril de 2026)
**Sprint Goal:** Infraestrutura completa, autenticação funcionando, dados migrados

## Visão Geral

Sprint 1 é a fundação do projeto Elopar. Neste período, estabeleceremos toda a infraestrutura técnica necessária para o desenvolvimento das features posteriores, incluindo configuração do ambiente, banco de dados, autenticação e setup inicial dos testes.

## Duração da Sprint

- **Data de Início:** Segunda-feira, 7 de abril de 2026
- **Data de Término:** Domingo, 20 de abril de 2026
- **Duração:** 2 semanas (10 dias úteis)
- **Reuniões:**
  - Sprint Planning: 7 de abril, 10:00
  - Daily Standup: Todos os dias úteis, 09:30
  - Sprint Review: 20 de abril, 15:00
  - Retrospectiva: 20 de abril, 15:30

## Capacidade da Equipe

**Composição:**
- Tide Cardoso (Dev Fullstack) - 40 horas/semana
- Desenvolvedor Backend (conforme necessário) - 20 horas/semana

**Velocidade Esperada:** 40 story points

**Fórmula de Cálculo:**
- Capacidade total: 60 horas/semana
- Overhead (reuniões, comunicação): ~10%
- Capacidade efetiva: ~54 horas/semana
- Pontuação por hora (estimado): 0,74 pontos/hora
- Capacidade = 54 × 0,74 ≈ 40 pontos

## Compromissos da Sprint

1. **EP-001:** Criar projeto Supabase e configurar ambiente (3 pts)
2. **EP-002:** Configurar estrutura Next.js com App Router e shadcn/ui (5 pts)
3. **EP-003:** Implementar schema do banco de dados com migrations (5 pts)
4. **EP-004:** Implementar autenticação Supabase Auth (8 pts)
5. **EP-005:** Criar script de seed (Excel → Supabase) (8 pts)
6. **EP-006:** Implementar layout base (Sidebar, Header, Theme) (5 pts)
7. **EP-007:** Configurar Vitest e estrutura de testes (3 pts)
8. **EP-008:** Configurar CI/CD básico (GitHub Actions) (3 pts)

**Total Planejado:** 40 story points

## Riscos e Dependências

### Riscos

| ID | Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|---|
| R1 | Atrasos na provisão do ambiente Supabase | Média | Alto | Solicitar acesso com antecedência, ter conta pessoal de backup |
| R2 | Complexidade na migração de dados do Excel | Média | Médio | Revisar structure de dados antecipadamente, criar script de validação |
| R3 | Integração Next.js + Supabase + shadcn/ui com problemas de versões | Baixa | Médio | Usar versões LTS, testar localmente antes de commitar |
| R4 | Atraso em EP-004 (autenticação) bloqueia outras tasks | Alta | Alto | Iniciar EP-004 no primeiro dia, paralelizar com EP-002 |

### Dependências

- EP-002 (Next.js) depende parcialmente de EP-001 (Supabase)
- EP-003 (Schema) depende de EP-001 (Projeto Supabase)
- EP-004 (Auth) depende de EP-003 (Schema)
- EP-005 (Seed) depende de EP-003 (Schema)
- EP-006 (Layout) pode ser independente até integração final
- EP-007 (Testes) pode começar após EP-002
- EP-008 (CI/CD) pode começar após EP-002

## Definição de Pronto (Definition of Done)

Uma tarefa é considerada **PRONTA** quando:

### Desenvolvimento
- [ ] Código implementado conforme especificação
- [ ] Code review aprovado (mínimo 1 desenvolvedor)
- [ ] Testes unitários implementados (cobertura mínima 80%)
- [ ] Sem console errors ou warnings
- [ ] Nenhuma dependência de segurança vulnerável

### Integração
- [ ] Mergeado para branch `develop`
- [ ] Sem conflitos com código existente
- [ ] Funcionalidade testada manualmente em dev
- [ ] Documentação técnica atualizada

### Qualidade
- [ ] Linting passou (ESLint + Prettier)
- [ ] TypeScript compilation sem erros
- [ ] Performance dentro de limites aceitáveis
- [ ] Sem regressões identificadas

### Documentation
- [ ] Arquitetura/decisões técnicas documentadas
- [ ] Comentários no código para lógica complexa
- [ ] README atualizado se necessário

## Critérios de Sucesso da Sprint

A sprint será considerada bem-sucedida se:

1. Todos os 8 stories forem concluídos (40 pontos)
2. Nenhuma história tiver status BLOCKED ao final
3. Aprovação mínima de 80% nas reviews de código
4. Testes automatizados em execução no CI/CD
5. Ambiente de desenvolvimento estável para Sprint 2

## Escopo Fora da Sprint

As seguintes tarefas serão adiadas para sprints posteriores:

- Features de dashboard (Sprint 2)
- Listagem e filtros de profissionais (Sprint 2)
- Módulos de visões por cliente (Sprint 3)
- CRUD de dados (Sprint 5)
- Features avançadas de export/relatórios (Sprint 6)

## Notas Importantes

- Prioridade absoluta: garantir que infraestrutura esteja 100% funcional
- Revisar daily a situação de EP-004 (autenticação) - task crítica
- Documentar todas as decisões de arquitetura
- Preparar ambiente para que Sprint 2 possa começar sem bloqueios
- Manter comunicação clara sobre qualquer mu