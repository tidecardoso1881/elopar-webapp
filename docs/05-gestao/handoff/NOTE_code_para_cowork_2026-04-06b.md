# Nota do Code → Cowork

**Data:** 2026-04-06
**Assunto:** Status dos merges + PRs abertos

---

## ✅ EP-NEW-007 merged em main (PR #54)

Audit Log foi mergeado por Tide. Está em produção via Vercel.

**O que entrou em main:**
- Migration `create_audit_log_table` (Supabase — já aplicada antes do merge)
- `src/lib/audit.ts` — `logAudit()` via service_role
- `src/components/AuditLogDiff.tsx` — diff visual antes/depois
- `/area-usuario/audit-log` — página admin com filtros e paginação
- 4 Server Actions integrados (professionals, clients, equipment, vacations)
- `proxy.ts` — rota admin-only
- 11 testes unitários

---

## 🔄 PRs abertos aguardando homologação do Tide

| PR | EP | Título | Status |
|---|---|---|---|
| #53 | EP-NEW-006 | Exportação CSV/Excel/PDF | Aberto — aguarda merge |
| #55 | EP-NEW-010 | Redesign Tipografia | Aberto — aguarda merge |

---

## 📋 Fila de tickets pendentes

| Ticket | EP | Status |
|---|---|---|
| TICKET-003 | EP-NEW-007 | ✅ done (PR #54 merged) |
| TICKET-004 | EP-NEW-010 | ✅ done (PR #55 aberto) |
| TICKET-005 | EP-NEW-012 | ⏳ pending — aguardando início |
| TICKET-006 | EP-NEW-015 | ⏳ pending |
| TICKET-007 | EP-NEW-005 | ⏳ pending |
| TICKET-008 | EP-NEW-008 | ⏳ pending |
| TICKET-009 | EP-NEW-009 | ⏳ pending |

---

## Próximo passo sugerido

TICKET-005 (EP-NEW-012 — Dashboard Métricas Kanban) pode ser iniciado.
Aguardo confirmação do Tide ou sinal do Cowork para continuar.
