# KANBAN.md — Estado do Projeto Elopar

> Fonte da verdade compartilhada entre Claude Cowork e Claude Code.
> Atualizado em: 2026-04-06 v3 | Modelo: Kanban contínuo (migrado de Scrum)

---

## 🗂️ Colunas e WIP Limits

| Coluna | WIP Limit | Descrição |
|---|---|---|
| **Backlog** | ∞ | EPs priorizados com MoSCoW |
| **Entendimento** | 2 | PM analisando e refinando |
| **DoR** (Ready) | 3 | Spec completa + mockup (se UI) |
| **Dev** | 3 | Em implementação por agentes |
| **Testes** | 2 | TypeScript + lint + testes |
| **Code Review** | 2 | PR aberto, aguardando review |
| **Homologação** | 1 | Tide validando em staging |
| **Produção** ✅ | ∞ | Merged em main + deploy Vercel |

---

## 📍 Estado Atual (06/04/2026)

### 🔴 Em Dev / Pendente

_(nenhum EP em andamento no momento)_

### 🟡 Backlog Priorizado

| Prioridade | EP | Título | Bloqueio |
|---|---|---|---|
| Must Have | EP-NEW-005A | Criação de Usuários (Admin) | Aguarda EP-NEW-005 (Área do Usuário) |
| Should Have | EP-NEW-005 | Área de Usuário Unificada | — |
| Should Have | EP-NEW-006 | Exportação CSV/Excel/PDF | — |

### ✅ Últimas entregas (06/04/2026)
- **EP-NEW-001**: Esqueci Minha Senha ✅ — proxy.ts rotas públicas + fix login link + middleware.ts removido
- **EP-NEW-002**: Templates Excel + importador Python ✅
- **EP-NEW-003**: Dashboard de Saúde dos Testes ✅ — RLS aplicado, build ok, em produção (Vercel)
- **EP-NEW-004**: Alertas de Renovação de Contrato ✅ — tabela contract_notifications, cron diário, /notificacoes, sino no header
- **PM-TASK-001**: DoR de Perfis & Permissões entregue em `docs/00-projeto/`
- **fix(build)**: tsconfig.json exclui e2e/scripts, middleware.ts duplicado removido

---

## 🔁 Fluxo de Trabalho

```
Cowork (PM)                    Code (Agentes)
    │                               │
    ├─ Recebe requisição            │
    ├─ Analisa com MoSCoW           │
    ├─ Cria DoR (spec + mockup?)    │
    ├─ Escreve prompt do agente     │
    │                               │
    └─────── prompt ───────────────►│
                                    ├─ Implementa EP
                                    ├─ Roda tsc + lint + tests
                                    ├─ Abre PR
                                    └─ Notifica Tide
    │
    ├─ Tide faz homologação
    └─ Tide faz merge (Code ou Git Bash)
```

---

## 📐 DoR — Definition of Ready

Um EP está pronto para Dev quando tem:

- [ ] **Título** claro e objetivo
- [ ] **Contexto** — por que isso é necessário
- [ ] **Tela** — qual(is) tela(s) são afetadas
- [ ] **Comportamento esperado** — o que deve acontecer
- [ ] **Critérios de aceite** — checklist testável
- [ ] **Mockup** — obrigatório se criar/alterar UI visível
- [ ] **Dependências** — outros EPs ou dados necessários
- [ ] **Fora do escopo** — o que explicitamente não será feito

---

## ✅ DoD — Definition of Done

Um EP está concluído quando:

- [ ] Código implementado e funcionando
- [ ] `npx tsc --noEmit` sem erros
- [ ] `npm run lint` sem erros
- [ ] Testes relevantes passando
- [ ] PR aberto com descrição clara
- [ ] Homologado por Tide
- [ ] Merged em main
- [ ] Deploy Vercel bem-sucedido (se aplicável)

---

## 📊 Métricas de Saúde

| Métrica | Alvo | Como medir |
|---|---|---|
| Lead time médio | < 3 dias | Data DoR → Produção |
| Taxa de retrabalho | < 20% | PRs reabertos / total |
| WIP violações | 0 | Colunas acima do limite |
| TypeScript errors em PR | 0 | `tsc --noEmit` no PR |

---

## 📥 Inbox de Requisições

Novas requisições chegam em:
```
docs/00-projeto/1 - backlog de melhorias/
```

Fluxo de processamento:
- **raiz/** → nova, ainda não analisada
- **lida/** → analisada pelo PM, EP criado
- **resolvido/** → entregue em produção

---

## 🔗 Referências Rápidas

- Spec do projeto: `docs/00-projeto/ESPECIFICACAO_PROJETO_v2.md`
- Design review: `docs/00-projeto/DESIGN_REVIEW.md`
- Histórico de sprints: `docs/04-sprints/`
- Log de decisões: `docs/05-gestao/DECISION_LOG.md`
- Como rodar o projeto: `CLAUDE.md` (raiz)
