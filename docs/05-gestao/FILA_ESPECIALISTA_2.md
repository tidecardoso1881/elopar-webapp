---
para: Especialista 2 (Haiku)
atualizado: 2026-04-07
---

# Fila — Especialista 2

> Leia este arquivo PRIMEIRO em toda sessão.

---

## ⛔ Regras críticas

1. Você é **Especialista 2** — só execute trabalho desta fila
2. Nunca leia ou execute arquivos da pasta `especialista-1/`
3. Fila vazia → pare e aguarde. Não busque trabalho em outro lugar
4. **Máximo 1 tarefa em `fazendo/` por vez**

---

## 📂 Onde ficam seus arquivos

```
docs/05-gestao/comunicacao/
  PROTOCOLO.md                        ← leia antes de tudo
  especialista-2/
    inbox/                            ← seus tickets novos chegam aqui
    fazendo/                          ← mova aqui ao iniciar (máx. 1)
    done/                             ← mova aqui ao concluir
    bloqueado/                        ← mova aqui se travar
  gerente/
    inbox/                            ← envie mensagens ao Gerente aqui
    enviadas/                         ← diretriz de git está aqui
```

---

## 🎯 Seus tickets — Wave NAV (atualizado 2026-04-07)

### ▶️ FAZENDO AGORA — Liberado por Cowork

| Ticket | Status | Branch |
|---|---|---|
| **NAV-001-002** | 🚀 **EM PROGRESSO** | `feat/nav-sidebar-roles` |

**Descrição:** Sidebar mostra "Analytics" só para admin/gerente

---

### ⏳ BLOQUEADO — Aguarda E1

| Ticket | Status | Bloqueio |
|---|---|---|
| **NAV-003** | ⏳ Wave 2 | Aguarda merge do ticket de E1 |
| NAV-004 | ⏳ Wave 2 | Não liberado ainda |
| NAV-005 | ⏳ Wave 2 | Não liberado ainda |

**Seu próximo trabalho:** Após concluir NAV-001-002 e E1 fazer merge → começar NAV-003 (abas no detalhe do profissional)

---

## 🔒 Escopo — o que é seu e o que não é

| EP | De quem é | Status |
|---|---|---|
| NAV-001+002 — Sidebar por role | ❌ Especialista 1 | Delegado a E2 por Cowork — em progresso |
| NAV-004 — Salvar filtro | ❌ Especialista 1 | Não liberado |
| NAV-005 — Limpeza área usuário | ❌ Especialista 1 | Não liberado |
| **NAV-003 — Abas detalhe profissional** | ✅ **Seu** | ⏳ Bloqueado até E1 merge |

---

## 🔁 Fluxo por ticket (quando liberado)

```
1. Leia o ticket no inbox/
2. Mova para fazendo/   ← sinaliza que começou
3. Implemente + tsc + lint + build
4. git fetch origin && git merge origin/main
5. Abra o PR
6. Mova para done/ e adicione PR: #NNN no arquivo
7. Crie mensagem em gerente/inbox/ com o número do PR
```
