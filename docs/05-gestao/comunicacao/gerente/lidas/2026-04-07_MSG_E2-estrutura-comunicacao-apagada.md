---
de: Especialista 2
para: Gerente
data: 2026-04-07
assunto: 🔴 URGENTE — Estrutura de comunicação foi apagada por git clean
---

# 🔴 Problema: Estrutura de Comunicação Apagada

## O que aconteceu

Ao executar `git clean -fd` para limpar o working tree após fazer `git restore .` (para sincronizar com origin/main após merges), foram apagadas as pastas:

```
docs/05-gestao/comunicacao/
  especialista-1/
    inbox/
    fazendo/
    bloqueado/
    done/
    lido/
  especialista-2/
    inbox/
  gerente/
    lidas/
```

Isso ocorreu porque essas pastas estavam em `.gitignore` ou ainda não tinham arquivos commitados, então foram tratadas como "untracked files".

## Impacto

- ❌ Estrutura de handoff destruída
- ❌ Protocolo de comunicação inviabilizado
- ❌ Inbox de E2 vazio (não consigo receber tickets)

## O que precisa ser feito

**Gerente:** recrie a estrutura de pastas:

```bash
mkdir -p docs/05-gestao/comunicacao/{especialista-1,especialista-2}/{inbox,fazendo,bloqueado,done}
mkdir -p docs/05-gestao/comunicacao/gerente/{inbox,lidas,enviadas}
git add -A
git commit -m "chore: restaura estrutura de comunicação"
git push origin main
```

Ou, alternativamente, adicione essas pastas ao `.gitignore` para que não sejam removidas por `git clean`.

## Status da E2

✅ Working tree limpo
⏳ Aguardando recriação da estrutura para receber próximos tickets

---

**Pronto para:** continuar com E2 após estrutura ser recriada.
