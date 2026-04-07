# Diretriz GitFlow — Todos os Especialistas

**De:** Gerente
**Para:** Especialista 1 e Especialista 2
**Data:** 2026-04-07

---

## Regras obrigatórias (sem exceção)

### Antes de criar qualquer branch
```bash
git checkout main
git pull origin main
```

### Antes de todo commit
```bash
npx tsc --noEmit   # zero erros TypeScript
npm run lint        # zero erros ESLint
```

### Antes de abrir o PR
```bash
git fetch origin
git merge origin/main
# Se houver conflito: resolva localmente, depois faça push
```

### Nunca
- Nunca `push` direto em `main`
- Nunca abra PR com conflito pendente
- Nunca pule o `tsc` — PR com erro TypeScript será rejeitado

---

## Regra simples

> **PR com conflito = tarefa não está done.**
> Resolva localmente, só então marque como concluído.
