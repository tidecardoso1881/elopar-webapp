# Protocolo de Comunicação — Elopar

> Lido por: Gerente, Especialista 1, Especialista 2
> Atualizado: 2026-04-07

---

## Estrutura de Pastas

```
comunicacao/
  PROTOCOLO.md                  ← este arquivo — leia antes de tudo
  gerente/
    inbox/                      ← E1 e E2 enviam mensagens para o Gerente aqui
    enviadas/                   ← histórico de mensagens enviadas pelo Gerente
  especialista-1/
    inbox/                      ← mensagens novas para E1 (ainda não lidas)
    fazendo/                    ← tarefa que E1 está executando AGORA (máx. 1 arquivo)
    done/                       ← tarefas concluídas por E1
    bloqueado/                  ← E1 travou e aguarda resposta do Gerente
  especialista-2/
    inbox/                      ← mensagens novas para E2 (ainda não lidas)
    fazendo/                    ← tarefa que E2 está executando AGORA (máx. 1 arquivo)
    done/                       ← tarefas concluídas por E2
    bloqueado/                  ← E2 travou e aguarda resposta do Gerente
```

---

## Fluxo de uma Tarefa

```
Gerente escreve ticket
        ↓
  especialista-X/inbox/       ← ticket chega aqui
        ↓  (especialista lê)
  especialista-X/fazendo/     ← move o arquivo ao iniciar (máx. 1 arquivo)
        ↓  (especialista conclui)
  especialista-X/done/        ← move o arquivo ao terminar + adiciona número do PR
```

**Se travar:**
```
  especialista-X/fazendo/
        ↓  (bloqueio encontrado)
  especialista-X/bloqueado/   ← move o arquivo + descreve o problema no final
        ↓
  gerente/inbox/              ← cria mensagem avisando o Gerente
```

---

## Regras por Papel

### Gerente
- Escreve tickets em `especialista-X/inbox/`
- Lê notificações em `gerente/inbox/`
- Mantém cópia das mensagens enviadas em `gerente/enviadas/`
- Nunca escreve diretamente em `fazendo/` ou `done/` — só o próprio especialista move arquivos

### Especialista 1
- **Só lê e escreve em `especialista-1/`** — nunca acessa pastas do Especialista 2
- Ao iniciar uma tarefa: move o arquivo de `inbox/` → `fazendo/`
- `fazendo/` tem **máximo 1 arquivo** — termine antes de começar outro
- Ao concluir: move de `fazendo/` → `done/` e adiciona `PR: #NNN` no final do arquivo
- Para falar com o Gerente: cria arquivo em `gerente/inbox/`
- Para falar com o Especialista 2: cria arquivo em `especialista-2/inbox/`
- Se travar: move para `bloqueado/` + avisa o Gerente

### Especialista 2
- **Só lê e escreve em `especialista-2/`** — nunca acessa pastas do Especialista 1
- Mesmas regras de fluxo do Especialista 1
- Para falar com o Gerente: cria arquivo em `gerente/inbox/`
- Para falar com o Especialista 1: cria arquivo em `especialista-1/inbox/`
- Se travar: move para `bloqueado/` + avisa o Gerente

---

## Convenção de Nomes de Arquivos

```
[DATA]_[TIPO]_[ASSUNTO].md

Exemplos:
  2026-04-07_TICKET_NAV-001-002-sidebar-roles.md
  2026-04-07_MSG_bloqueado-conflito-layout.md
  2026-04-07_DONE_NAV-001-002-PR90.md
```

Tipos:
- `TICKET` — tarefa de desenvolvimento
- `MSG`    — mensagem / comunicação
- `DONE`   — confirmação de conclusão (gerado pelo especialista ao mover para done/)
- `BLOCK`  — bloqueio aguardando resolução

---

## WIP Limit

A pasta `fazendo/` de cada especialista **só pode ter 1 arquivo por vez.**
Se já houver um arquivo em `fazendo/`, não inicie outra tarefa — conclua ou sinalize bloqueio primeiro.

---

## Regras de Git (todos)

Consulte sempre: `docs/05-gestao/comunicacao/gerente/enviadas/2026-04-07_MSG_diretriz-gitflow.md`

Resumo:
1. `git checkout main && git pull origin main` antes de cada nova branch
2. `npx tsc --noEmit` + `npm run lint` antes de todo commit
3. `git fetch origin && git merge origin/main` antes de abrir PR
4. Nunca push direto em `main`
5. PR com conflito = tarefa não está done. Resolva localmente antes.
