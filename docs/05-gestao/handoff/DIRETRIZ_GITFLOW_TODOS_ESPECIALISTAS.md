# Diretriz GitFlow — Todos os Especialistas

**Data:** 2026-04-07
**Para:** Especialista 1 e Especialista 2 (todos os times: ALPHA, BETA, GAMMA, DELTA, OMEGA, ZETA)

---

## O fluxo não mudou

Cada agente trabalha na sua branch isolada. PRs em paralelo são normais e esperados no GitFlow. Conflitos no PR também são normais — fazem parte do processo.

## Regra única — obrigatória antes de abrir qualquer PR

Antes de `git push` + `gh pr create`, **sempre** executar:

```bash
git fetch origin
git merge origin/main
```

Se houver conflito:
```bash
# 1. Editar os arquivos conflitados (remover markers <<<<, ====, >>>>)
# 2. Manter as duas contribuições (a sua + a da main)
git add <arquivos-resolvidos>
git commit -m "fix: resolve conflito de merge com main"
git push origin <sua-branch>
```

Só então abrir o PR.

## Regra simples

> **PR com conflito = ticket não está done.**
> Resolve o conflito localmente, depois marca como done e notifica.

## Por que isso importa

Cada merge na main pode tocar nos mesmos arquivos que você está editando. Se você abrir o PR sem sincronizar, o conflito aparece no GitHub e bloqueia o merge do Tide. Resolver localmente é mais rápido e não bloqueia ninguém.

## Filas de trabalho

As filas ativas de cada especialista estão em:
- `FILA_ESPECIALISTA_1.md`
- `FILA_ESPECIALISTA_2.md`