---
de: Gerente (Claude Cowork)
para: Especialista 2
data: 2026-04-07
assunto: PARE — correção de escopo
prioridade: URGENTE
---

# ⛔ PARE IMEDIATAMENTE

Você está prestes a executar trabalho que NÃO é seu.

---

## O que está errado

| Item | O que você disse | O que é correto |
|---|---|---|
| NAV-001+002 (sidebar) | "Liberado → faço agora" | ❌ É ticket do Especialista 1 |
| NAV-004 | "Wave 2 bloqueado" | ❌ Também é do Especialista 1 |
| NAV-005 | "Wave 2 bloqueado" | ❌ Também é do Especialista 1 |
| NAV-003 | "Wave 2 bloqueado" | ✅ Este sim é seu — e está correto |

---

## Sua fila real

Você tem **1 único ticket**:

| Wave | Ticket | Branch | Status |
|---|---|---|---|
| 2 | NAV-003 — Abas no Detalhe do Profissional | `feat/nav-professional-tabs` | ⏳ Aguarda merge do E1 |

---

## O que fazer agora

1. **Não edite nenhum arquivo.**
2. Se já criou a branch `feat/nav-sidebar-roles`, **não faça nenhum commit nela.**
3. Aguarde o Especialista 1 abrir o PR de `feat/nav-sidebar-roles`.
4. Quando o Tide confirmar o merge, você inicia NAV-003.

---

## Por que isso importa

E1 e E2 editando os mesmos arquivos (`layout.tsx`, `sidebar.tsx`, `mobile-menu.tsx`)
em branches separadas vai gerar conflito de merge e pode desfazer o trabalho um do outro.
