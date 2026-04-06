# CLAUDE.md — Elopar Webapp

> Lido automaticamente pelo Claude Code ao abrir este projeto.
> Atualizado em: 2026-04-06

---

## 🧭 Visão Geral do Projeto

**Elopar** é uma plataforma de gestão de profissionais técnicos.
Stack: Next.js 14+ (App Router) · TypeScript · Supabase · Tailwind CSS · Vercel

---

## 🤝 Divisão de Responsabilidades: Cowork vs Code

| Função | Ferramenta |
|---|---|
| Planejamento, backlog, EPs, DoR | Claude **Cowork** |
| Mockups, documentos, decisões de PM | Claude **Cowork** |
| Implementação de código (EPs) | Claude **Code** (sub-agentes) |
| Git: commit, push, PR, merge | Claude **Code** (via terminal do Tide) |
| Operações de banco (Supabase MCP) | Claude **Cowork** |

**Regra crítica:** nunca executar git no Cowork — o sandbox Linux corrompe repositórios NTFS.

---

## 📋 Estado do Kanban

O estado atual do projeto está em:
```
docs/05-gestao/KANBAN.md
```

Leia este arquivo antes de iniciar qualquer tarefa para entender o contexto atual, WIP limits e prioridades.

---

## 🚀 Workflow Git (via Claude Code)

Quando Tide pedir para commitar, fazer push ou abrir PR, use este fluxo:

### Commit & Push
```bash
# 1. Verificar estado
git status
git diff --staged

# 2. Adicionar arquivos (nunca git add -A sem revisar)
git add <arquivos específicos>

# 3. Commitar com co-author
git commit -m "$(cat <<'EOF'
feat(EP-XXX): descrição clara do que foi feito

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"

# 4. Push
git push origin <branch>
```

### Abrir Pull Request
```bash
gh pr create \
  --title "feat(EP-XXX): título" \
  --body "$(cat <<'EOF'
## O que foi feito
- Item 1

## Como testar
- Passo 1

## EP relacionado
Closes #XXX

🤖 Generated with Claude Code
EOF
)"
```

### Merge (apenas branches de feature → main ou sprint-X)
```bash
# Nunca force push em main
gh pr merge <número> --squash --delete-branch
```

---

## 🧪 Checklist antes de marcar EP como entregue

- [ ] `npx tsc --noEmit` sem erros
- [ ] `npm run lint` sem erros
- [ ] Testes unitários passando (`npm run test`)
- [ ] Build local ok (`npm run build`)
- [ ] Funcionalidade testada manualmente (ou E2E se aplicável)

---

## 📁 Estrutura de Diretórios Relevante

```
src/
  app/           # Next.js App Router (pages e layouts)
  components/    # Componentes reutilizáveis
  lib/           # Utilities, Supabase client, helpers
  types/         # TypeScript types globais
docs/
  00-projeto/    # Specs, brainstorm, backlog de melhorias
  01-arquitetura/ # Decisões arquiteturais (ADRs)
  04-sprints/    # Histórico de sprints
  05-gestao/     # KANBAN.md, métricas, retrospectivas
scripts/         # Seeds, migrations, setup GitHub
```

---

## ⚙️ Comandos Úteis

```bash
npm run dev          # Dev server
npm run build        # Build de produção
npm run test         # Vitest (unit tests)
npm run test:e2e     # Playwright (E2E)
npx tsc --noEmit     # Type check sem build
npm run lint         # ESLint
```

---

## 🔗 Referências

- Supabase Project: ver `.env.local` (não commitar)
- Vercel: deploy automático via push em `main`
- GitHub Project Board: configurado via `scripts/setup-github-project.sh`
- Backlog de melhorias: `docs/00-projeto/1 - backlog de melhorias/`
