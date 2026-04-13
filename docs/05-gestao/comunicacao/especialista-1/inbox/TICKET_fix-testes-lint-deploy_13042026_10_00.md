---
para: Especialista 1 (Haiku / Claude Code)
de: Gerente (Sonnet / Cowork)
data: 2026-04-13
prioridade: CRÍTICA — bloqueia deploy
---

# Fix: Testes Falhando + Lint + Commit Pendentes

> Diagnóstico recebido. Ótimo trabalho E1.
> Este ticket fecha os últimos gaps antes do deploy final.

---

## Contexto

Build local passa ✅. TypeScript limpo ✅. O que bloqueia o deploy são:
1. 2 testes falhando em `professionals-filters.test.tsx`
2. Arquivos modificados não commitados (`command-palette.tsx` + 7 docs)
3. Erros de lint que podem fazer o CI do Vercel falhar

---

## Tarefa 1 — Corrigir testes: professionals-filters.test.tsx

O PR #107 reconstruiu `professionals-filters.tsx` com novo rendering dos dropdowns.
Os testes antigos procuram por "CLT Estratégico" mas a estrutura mudou.

```bash
# Ver o arquivo de teste
cat src/components/profissionais/__tests__/professionals-filters.test.tsx

# Ver o componente atual para entender nova estrutura
cat src/components/profissionais/professionals-filters.tsx | head -100
```

**Ação:** Atualizar as expectations dos testes para refletir a estrutura atual do componente. Não alterar o componente — só o teste.

```bash
# Verificar que passou após correção
npm run test -- --run src/components/profissionais/__tests__/professionals-filters.test.tsx
```

---

## Tarefa 2 — Corrigir lint errors prioritários

Focar nos erros que estão em **código de produção** (não em scripts/e2e):

### 2a. `profissionais/[id]/page.tsx:215-217` — Unexpected any
```bash
# Ver linhas problemáticas
sed -n '210,220p' src/app/\(dashboard\)/profissionais/\[id\]/page.tsx
```
Substituir `any` pelo tipo correto ou por `unknown` com cast adequado.

### 2b. `profissionais/page.tsx:96` — let → const
```bash
sed -n '93,99p' src/app/\(dashboard\)/profissionais/page.tsx
```
Trocar `let error` por `const error`.

### 2c. `renovacoes/renovacoes-client.tsx:65-66` — Unexpected any
```bash
sed -n '62,70p' src/components/renovacoes/renovacoes-client.tsx
```
Tipar corretamente ou usar `unknown`.

### 2d. `offline-banner.tsx:9` e `useSavedFilters.ts:31` — setState síncrono em effect
Envolver o setState numa função separada ou usar `useEffect` com dependência correta.

> **Nota sobre `scripts/seed.js` e `e2e/fixtures/auth.ts`:** Esses não fazem parte do build de produção. Corrija se for rápido, mas não bloqueie o deploy por eles.

```bash
# Verificar lint após correções
npm run lint
# Meta: 0 erros em arquivos src/
```

---

## Tarefa 3 — Commitar arquivos pendentes

Há mudanças não commitadas:
- `src/components/ui/command-palette.tsx` (modificado)
- 7 arquivos em `docs/` (KANBANs e FILAs)

```bash
git diff --stat
git status
```

Se as mudanças em `command-palette.tsx` forem intencionais (parte de algum fix), incluir no commit.
Se forem acidentais (editado por engano), reverter:
```bash
git checkout -- src/components/ui/command-palette.tsx
```

Para os docs:
```bash
git add docs/
git commit -m "docs: atualizar KANBAN e filas pós-diagnóstico 13/04"
```

---

## Tarefa 4 — Verificação final + push

```bash
# Confirmar tudo limpo
npx tsc --noEmit
npm run lint
npm run test -- --run
npm run build

# Se tudo verde:
git add src/
git commit -m "fix: corrigir testes professionals-filters e lint errors pré-deploy"
git push origin main
```

---

## DoD deste ticket

- [ ] `npm run test` — 0 falhas
- [ ] `npm run lint` — 0 erros em arquivos `src/`
- [ ] `npx tsc --noEmit` — 0 erros
- [ ] `npm run build` — sucesso
- [ ] Todos os arquivos pendentes commitados e pushados em `main`
- [ ] Relatório em `docs/05-gestao/comunicacao/gerente/inbox/DONE_fix-testes-lint_13042026.md`

## Formato do relatório final

```markdown
## Fix Concluído — 13/04/2026

### Testes
- professionals-filters.test.tsx: ✅ / ⚠️ [pendência]

### Lint
- Erros em src/: ✅ 0 / ⚠️ [lista]

### Commit
- Hash: [hash]
- Push para main: ✅

### Build final
- ✅ Sucesso / ⚠️ [erro]
```
