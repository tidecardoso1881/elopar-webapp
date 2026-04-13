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
5. **Arquivo `URGENT_*` no inbox = interrompa o que está fazendo e leia imediatamente**

## 📄 Nomenclatura de arquivos

```
[TIPO]_[Assunto-Breve]_[ddmmaaaa]_[hh_mm].md
```

Tipos por prioridade: `URGENT` → `BLOCK` → `DONE` → `SOLICIT` → `DIRETRIZ` → `TICKET` → `INFO`

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

## 🎯 Seus tickets — Wave Backlog (atualizado 2026-04-07)

### ✅ CONCLUÍDO

| Ticket | Status | PR |
|---|---|---|
| **EP-NEW-015** | ✅ **REVIEW** | #101 |

**Descrição:** Busca global com Command Palette (Ctrl+K)

**Status:**
- API `/api/search` ✅
- Hook `useCommandPalette` ✅
- Componente `CommandPalette` ✅
- Integração Header ✅
- Sem conflitos ✅

### ⏳ AGUARDANDO LIBERAÇÃO

| Ticket | Status | Nota |
|---|---|---|
| EP-NEW-020 | ⏳ Próxima onda | Aguardando Gerente |

---

## 🔒 Escopo — concluído vs. novo

| EP | Status |
|---|---|
| NAV-001+002 — Sidebar por role | ✅ PR #90 merged |
| NAV-003 — Abas detalhe profissional | ✅ PR #95 merged |
| **EP-NEW-015 — Busca Global** | ▶️ **SEU PRÓXIMO** |