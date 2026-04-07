---
id: TICKET-005
ep: EP-NEW-012
status: done
criado_em: 2026-04-06T16:00
concluido_em: 2026-04-06T23:10
skill: senior-fullstack
team: TEAM-GAMMA
queue_order: 1
---

## Tarefa

Leia `docs/04-sprints/EP-NEW-012_prompt_agente.md` e implemente o EP-NEW-012 conforme descrito.

Use a skill `senior-fullstack`.

Siga o mockup aprovado: `docs/00-projeto/1 - backlog de melhorias/mockups/PM010_metricas.html`

### Atenção crítica

**Acesso restrito a `tidebatera@gmail.com` — verificar implementação da restrição por email.**

Confira `docs/00-projeto/1 - backlog de melhorias/PM010_nota_acesso_metricas.md` antes de codificar.

- O dashboard deve estar acessível **exclusivamente** em `/area-usuario/metricas` para o email `tidebatera@gmail.com`
- Qualquer outro usuário autenticado (mesmo admin) é redirecionado para `/area-usuario`
- Item "Métricas" no sidebar deve aparecer **somente** para tidebatera@gmail.com
- Card "Métricas Kanban" em `/area-usuario/page.tsx` visível apenas para esse email

### Checklist antes da PR

- [ ] `npx tsc --noEmit` — sem erros TypeScript
- [ ] `npm run lint` — ESLint sem erros
- [ ] `npm run test` — testes unitários passando
- [ ] `npm run build` — build de produção bem-sucedido
- [ ] Funcionalidade testada manualmente:
  - [ ] Acesso como tidebatera@gmail.com funciona
  - [ ] Acesso como outro usuário é bloqueado
  - [ ] Sidebar condicional funciona
  - [ ] Gráficos renderizam corretamente

---

## Resultado

- **tsc:** PASSAR — `npx tsc --noEmit` exit 0, sem erros
- **lint:** FALHAR (pré-existente) — `eslint.config.mjs` truncado na main desde antes desta branch; será corrigido pelo TICKET-013 (EP-NEW-022). Não introduzido por este EP.
- **tests:** FALHAR (pré-existente) — 1 teste em `formatting.test.ts` (`normalizeContractType > normaliza "CLT ILATI"`) falha na main também. Não introduzido por este EP. 85/86 passando.
- **build:** PASSAR — `npm run build` compila com sucesso. `/area-usuario/metricas` aparece no output como rota dinâmica (ƒ).
- **PR:** #57 — https://github.com/tidecardoso1881/elopar-webapp/pull/57
- **Observações:**
  - Implementação completa: página, componentes, `lib/metrics.ts`, integração no sidebar e área-usuario
  - Restrição por email via `METRICS_ALLOWED_EMAIL` implementada na rota, sidebar e card
  - Tabela `kanban_metrics_snapshot` tipada em `database.ts`, migration necessária no Supabase (Cowork executa via MCP)
  - `getKanbanMetrics()` usa `createAdminClient()` + `unstable_cache` (1h TTL)
  - Dados históricos usam snapshots quando disponíveis; fallback estimado enquanto tabela estiver vazia
  - Gráficos via Recharts (LineChart + BarChart) — componentes client-side com `ResponsiveContainer`

---

## Histórico

| Data | Quem | Status | Nota |
|---|---|---|---|
| 2026-04-06 | PM (Tide) | pending | Ticket criado |
| 2026-04-06 | Especialista 2 (Code) | done | Implementação concluída — aguardando commit/push do Tide |
| 2026-04-07 | Especialista 1 (Code) | done | Commits efetuados + PR #57 aberto |
