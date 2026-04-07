# Nota: Especialista 2 → Cowork (PM)

**Data:** 2026-04-07
**Assunto:** EP-NEW-012 validado e pronto para PR

---

## Status

TICKET-005 (EP-NEW-012 — Dashboard de Métricas Kanban) está **implementado, validado e pronto para PR**.

- Implementação: Especialista 1 (commits `3087716` e `bc2e23f`)
- Validação DoD: Especialista 2 (esta sessão) — tsc, lint, tests, build

Aguardando Tide fazer `git push` + `gh pr create`.

---

## Ação necessária pelo Cowork (MCP Supabase)

Executar a migration no banco de produção:

```sql
CREATE TABLE public.kanban_metrics_snapshot (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_date DATE NOT NULL DEFAULT CURRENT_DATE,
  lead_time_avg NUMERIC(5, 2),
  cycle_time_avg NUMERIC(5, 2),
  throughput INT,
  wip_total INT,
  rework_rate NUMERIC(5, 2),
  efficiency_rate NUMERIC(5, 2),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (metric_date)
);

CREATE INDEX idx_kanban_metrics_date ON public.kanban_metrics_snapshot(metric_date DESC);

ALTER TABLE public.kanban_metrics_snapshot ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Somente owner lê métricas"
  ON public.kanban_metrics_snapshot
  FOR SELECT
  USING (auth.jwt() ->> 'email' = current_setting('app.metrics_allowed_email', true));
```

**Alternativa simples para RLS:** deixar policy `FOR SELECT USING (true)` — a rota já está protegida por email no nível da página e via `createAdminClient()` (service_role). A tabela não contém PII sensível.

---

## Issues pré-existentes (não introduzidos por este EP)

1. **lint** — `eslint.config.mjs` truncado (afeta toda a `main`). TICKET-013 (EP-NEW-022/BETA) resolve isso.
2. **test** — `formatting.test.ts > normalizeContractType > normaliza "CLT ILATI"` falhando na `main`. 85/86 testes passam. Também escopo do TICKET-013.

---

## Arquivos modificados nesta branch

**Criados:**
- `src/lib/metrics.ts`
- `src/app/(dashboard)/area-usuario/metricas/page.tsx`
- `src/app/(dashboard)/area-usuario/metricas/period-filter.tsx`
- `src/components/metrics/KPICard.tsx`
- `src/components/metrics/MetricsLineChart.tsx`
- `src/components/metrics/MetricsBarChart.tsx`
- `src/components/metrics/WIPVisualization.tsx`

**Modificados:**
- `src/app/(dashboard)/area-usuario/page.tsx` — card "Métricas Kanban" condicional
- `src/app/(dashboard)/layout.tsx` — `showMetrics` prop para Sidebar
- `src/components/layout/sidebar.tsx` — item "Métricas" condicional
- `src/lib/types/database.ts` — tipo `kanban_metrics_snapshot`
- `.env.example` — `METRICS_ALLOWED_EMAIL=tidebatera@gmail.com`
