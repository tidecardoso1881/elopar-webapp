---
para: Especialista 1 (Haiku)
atualizado: 2026-04-07
---

# Fila — Especialista 1

> Leia este arquivo PRIMEIRO em toda sessão.

---

## ⛔ Regras críticas

1. Você é **Especialista 1** — só execute trabalho desta fila
2. Nunca leia ou execute arquivos da pasta `especialista-2/`
3. Fila vazia → pare e aguarde. Não busque trabalho em outro lugar
4. **Máximo 1 tarefa em `fazendo/` por vez**

---

## 📂 Onde ficam seus arquivos

```
docs/05-gestao/comunicacao/
  PROTOCOLO.md                        ← leia antes de tudo
  especialista-1/
    inbox/                            ← seus tickets novos chegam aqui
    fazendo/                          ← mova aqui ao iniciar (máx. 1)
    done/                             ← mova aqui ao concluir
    bloqueado/                        ← mova aqui se travar
  gerente/
    inbox/                            ← envie mensagens ao Gerente aqui
    enviadas/                         ← diretriz de git está aqui
```

---

## 🎯 Seus tickets — Wave 1 (agora)

| Arquivo no inbox | Status |
|---|---|
| `2026-04-07_TICKET_NAV-001-002-sidebar-roles.md` | ▶️ **FAZER AGORA** |
| `2026-04-07_TICKET_NAV-004-save-filter-ux.md` | ⏳ Após NAV-001+002 merged |
| `2026-04-07_TICKET_NAV-005-area-usuario-cleanup.md` | ⏳ Após NAV-001+002 merged |

**Caminho completo do primeiro ticket:**
`docs/05-gestao/comunicacao/especialista-1/inbox/2026-04-07_TICKET_NAV-001-002-sidebar-roles.md`

---

## 🔁 Fluxo por ticket

```
1. Leia o ticket no inbox/
2. Mova para fazendo/   ← sinaliza que começou
3. Implemente + tsc + lint + build
4. git fetch origin && git merge origin/main
5. Abra o PR
6. Mova para done/ e adicione PR: #NNN no arquivo
7. Crie mensagem em gerente/inbox/ com o número do PR
8. Leia o próximo ticket do inbox/
```
