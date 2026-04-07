---
id: TICKET-003
ep: EP-NEW-007
status: pending
criado_em: 2026-04-06T15:30
observacao: marcado done incorretamente — arquivos nao foram criados. Resetado para pending em 2026-04-06T19:30
skill: senior-fullstack
---

# TICKET-003: Implementar EP-NEW-007 (Audit Log)

## Tarefa

Você é um agente **`senior-fullstack`** responsável por implementar o **EP-NEW-007: Audit Log — Histórico de Ações** no Elopar WebApp.

**Leia primeiro:** `docs/04-sprints/EP-NEW-007_prompt_agente.md`

Neste documento você encontrará:
- Objetivo e contexto completo do EP
- Requirements funcionais detalhados
- Schema da migration `create_audit_log_table`
- Arquivos a criar e modificar
- Plano de testes
- Checklist de conclusão (DoD)

### Resumo Executivo

Implementar um sistema que registra automaticamente todas as operações (CREATE, UPDATE, DELETE) em:
- professionals
- clients
- equipment
- vacations

Com captura de: quem fez, quando, e o que mudou (antes/depois em JSON).

**Outputs esperados:**
1. Migration aplicada via Supabase (`create_audit_log_table`)
2. Módulo `src/lib/audit.ts` com função `logAudit()`
3. Integração em 4 Server Actions (professionals, clients, equipment, vacations)
4. Página `/area-usuario/audit-log` (admin-only) com tabela + modal de diff
5. Componente `AuditLogDiff` para visualizar mudanças

### Regras de Negócio Críticas

- ✅ Apenas **admin** acessa a tela de audit log
- ✅ Logs são **imutáveis** via RLS (sem UPDATE/DELETE)
- ✅ Retenção padrão: últimos 90 dias (filtro na página)
- ✅ Nomenclatura e textos em **PT-BR**
- ✅ TypeScript strict (sem `any`)

### Condições de Conclusão (DoD)

Antes de marcar como **done**, garantir:

```bash
npx tsc --noEmit          # ✅ Sem erros TS
npm run lint              # ✅ Sem erros ESLint
npm run test              # ✅ Testes passando
npm run build             # ✅ Build OK
```

Além de:
- [ ] Migration aplicada no banco
- [ ] Funcionalidade testada manualmente (criar/editar/deletar entidade → verificar log)
- [ ] Admin acessa `/area-usuario/audit-log` sem erros
- [ ] Manager tenta acessar → é redirecionado
- [ ] Modal "Ver Diff" abre e exibe corretamente
- [ ] Código limpo (sem console.log, sem debugging)

### Como Proceder

1. **Aplicar migration** (use Supabase MCP):
   - Nome: `create_audit_log_table`
   - SQL: ver `EP-NEW-007_prompt_agente.md` seção 3.1

2. **Gerar tipos TypeScript:**
   ```bash
   # Após migration aplicada
   npx supabase gen types typescript
   ```

3. **Implementar na sequência:**
   - [ ] `src/lib/audit.ts` (função logAudit)
   - [ ] `src/actions/professionals.ts` (integração)
   - [ ] `src/actions/clients.ts` (integração)
   - [ ] `src/actions/equipment.ts` (integração)
   - [ ] `src/actions/vacations.ts` (integração)
   - [ ] `src/app/(dashboard)/area-usuario/audit-log/page.tsx` (página)
   - [ ] `src/components/AuditLogDiff.tsx` (componente)

4. **Testes:**
   - Unitários para `logAudit()` e `AuditLogDiff`
   - Integração: criar/editar/deletar → verificar log no banco
   - E2E: admin acessa tela, vê registros, clica "Ver Diff"

5. **Validação final:**
   - Rodar checks (tsc + lint + test + build)
   - Testar manualmente (criar profissional, editar, deletar)
   - Verificar RLS (manager bloqueado de /area-usuario/audit-log)

6. **Entregar:**
   - Abrir PR via `gh pr create` (Tide faz commit + push)
   - Atualizar este ticket para `status: done`
   - Preencher seção "Resultado" abaixo

### Referências Importantes

- **Especificação:** `docs/04-sprints/EP-NEW-007_prompt_agente.md`
- **DoR de Perfis:** `docs/00-projeto/DoR_Perfis_Permissoes_2026_04_06.docx`
- **Padrão Server Action:** `src/actions/professionals.ts`
- **KANBAN:** `docs/05-gestao/KANBAN.md`
- **CLAUDE.md:** Leia antes de começar (setup, comandos, checklist)

---

## Resultado

_Preencher após conclusão do EP:_

### Validação do DoD

**TypeScript (tsc --noEmit):**
```
[Status: ✅ SUCESSO / ❌ ERRO]
Detalhes (se houver erros):
```

**Linting (npm run lint):**
```
[Status: ✅ SUCESSO / ❌ ERRO]
Detalhes (se houver erros):
```

**Testes (npm run test):**
```
[Status: ✅ SUCESSO / ❌ ERRO]
Testes passando:
- [ ] logAudit() insere registro
- [ ] logAudit() retorna erro se user_id inválido
- [ ] AuditLogDiff renderiza corretamente
- [ ] Diff oculta campos sem mudança
[Detalhes adicionais:]
```

**Build (npm run build):**
```
[Status: ✅ SUCESSO / ❌ ERRO]
Detalhes (se houver erros):
```

### Funcionalidade Validada

- [ ] Migration aplicada (create_audit_log_table)
- [ ] Criar profissional → log registrado com acao: 'CREATE'
- [ ] Editar profissional → log com dados_antes e dados_depois
- [ ] Deletar cliente → log com acao: 'DELETE'
- [ ] Admin acessa `/area-usuario/audit-log` → tela carrega
- [ ] Manager tenta acessar `/area-usuario/audit-log` → redirecionado para /dashboard
- [ ] Modal "Ver Diff" abre e exibe mudanças corretamente
- [ ] Paginação funciona (20 registros por página)
- [ ] Filtros funcionam (por entidade, data, user)

### Observações

_Espaço para notas sobre dificuldades, decisões arquiteturais, ou desvios do escopo:_

```
[Notas do agente]
```

### PR e Merge

**URL da PR:** `[gh pr view <número> ou URL completa]`

**Merged por:** `[Tide via Code ou Git Bash]`

**Data de conclusão:** `[data/hora]`

---

**Próximos passos:** Após merge em main, EP-NEW-007 move para coluna "Produção" do KANBAN. Atualizar `do