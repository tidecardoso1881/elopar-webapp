---
para: Especialista 1 (Haiku / Claude Code)
de: Gerente (Sonnet / Cowork)
data: 2026-04-13
prioridade: CRÍTICA
---

# Fix Deploy Vercel + Diagnóstico Completo

## Contexto

O painel Vercel mostra um build com falha num deploy de **Preview** da branch `sprint-5`:
- Erro: `Command "npm ci" exited with 1`
- Causa identificada: `package-lock.json` dessincronizado — flags `--include-workspace-root` e `--install-links` indicam lockfile gerado com npm diferente do que o Vercel usa
- Este é um deploy preview antigo (5 de abril). Precisamos garantir que `main` está deployado em produção e funcional.

---

## Passo 1 — Verificar estado atual do repo

```bash
cd <caminho do projeto>
git status
git log --oneline origin/main -10
git branch -a | grep -v 'HEAD'
gh pr list --state open
```

Reporte: commits recentes em main, branches abertas, PRs pendentes.

---

## Passo 2 — Corrigir package-lock.json (fix do npm ci)

O `npm ci` falha quando o lockfile está dessincronizado. Solução:

```bash
git checkout main
git pull origin main

# Regenerar o lockfile com a versão atual do npm
rm -f package-lock.json
npm install

# Verificar se funcionaria com npm ci
npm ci
```

Se `npm ci` passar com sucesso após regenerar, commitar:

```bash
git add package-lock.json
git commit -m "fix: regenerar package-lock.json para compatibilidade com Vercel (npm ci)"
git push origin main
```

> ⚠️ Só fazer push direto em main se não houver PRs abertos conflitantes. Se houver, criar branch `fix/package-lock-sync` e abrir PR.

---

## Passo 3 — Verificar TypeScript e lint antes do push

```bash
npx tsc --noEmit
npm run lint
npm run test -- --run
```

Zero erros antes de qualquer push.

---

## Passo 4 — Confirmar deploy em produção

Após o push em main, verificar que o Vercel dispara o build automaticamente:

```bash
# Aguardar ~2 minutos e verificar
vercel ls
# ou
gh run list --limit 5
```

Se o Vercel não disparar automaticamente (webhook desconfigurado), rodar:

```bash
vercel --prod
```

---

## Passo 5 — Verificar env vars no Vercel

Havia nota no KANBAN (07/04) de env var faltando para `/gerenciar-usuarios`. Verificar se as seguintes estão configuradas para **Production** no painel Vercel:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXTAUTH_SECRET` (se aplicável)
- `NEXTAUTH_URL` (se aplicável)

```bash
vercel env ls
```

---

## DoD deste ticket

- [ ] `package-lock.json` atualizado e commitado em main
- [ ] `npx tsc --noEmit` — zero erros
- [ ] `npm run lint` — zero erros
- [ ] Build Vercel em `main` passando (verde)
- [ ] Env vars de produção verificadas
- [ ] Relatório em `docs/05-gestao/comunicacao/gerente/inbox/DONE_diagnostico-deploy_13042026.md`

## Formato do relatório final

```markdown
## Resultado Diagnóstico — 13/04/2026

### Git
- Commits recentes em main: [lista]
- Branches abertas: [lista ou "nenhuma"]
- PRs abertos: [lista ou "nenhum"]

### Build Fix
- package-lock.json regenerado: ✅ / ⚠️
- npm ci passou: ✅ / ⚠️

### Qualidade
- tsc: ✅ / ⚠️ [erros]
- lint: ✅ / ⚠️
- testes: ✅ / ⚠️

### Vercel Produção
- Build status: ✅ / ⚠️
- Commit em produção: [hash]
- URL: https://...

### Env Vars
- Status: ✅ todas presentes / ⚠️ faltando: [lista]

### Pendências restantes
- [lista ou "nenhuma"]
```
