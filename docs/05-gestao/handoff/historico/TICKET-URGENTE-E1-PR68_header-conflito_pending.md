---
id: TICKET-URGENTE-E1-PR68
status: pending
prioridade: 🚨 URGENTE — fazer ANTES de qualquer outro ticket
especialista: 1 (Haiku)
pr: "#68"
branch: fix/header-remove-breadcrumb
arquivo_alvo: src/components/layout/header.tsx
criado_em: 2026-04-07
---

# 🚨 [E1] Resolver conflito PR #68 — Remover breadcrumb central do header

## O que você vai fazer

O PR #68 resolve o conflito no arquivo `src/components/layout/header.tsx`.
A branch `fix/header-remove-breadcrumb` tem conflito com a main.
Você vai sincronizar com a main e resolver o conflito manualmente.

---

## Passo a passo — execute EXATAMENTE na ordem

### 1. Entrar na branch correta

```bash
git checkout fix/header-remove-breadcrumb
git fetch origin
git merge origin/main
```

> Se o merge abrir um editor (vim), pressione `:q!` para sair sem salvar, depois siga o passo 2.

---

### 2. Abrir o arquivo com conflito

O arquivo com conflito é:

```
src/components/layout/header.tsx
```

O git vai marcar a zona de conflito assim:

```
<<<<<<< HEAD
  (seu código da branch fix/header-remove-breadcrumb)
=======
  (código que veio da main)
>>>>>>> origin/main
```

---

### 3. Objetivo da resolução

O PR #68 quer **remover** o bloco central de título/breadcrumb do header.

Antes (main tem isso — **DEVE SER REMOVIDO**):
```tsx
{/* Center: Page Title + Breadcrumb */}
<div className="flex-1 min-w-0 md:text-center">
  <h1 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">{pageTitle}</h1>
  <nav className="hidden sm:flex md:justify-center items-center gap-2 mt-0.5 text-xs text-gray-400">
    {/* breadcrumb content */}
  </nav>
</div>
```

Depois (o que deve ficar no header):
- **Manter**: bloco esquerdo (logo + "Grupo Elopar")
- **Manter**: bloco direito (dropdown de usuário / notificações)
- **Remover**: bloco central inteiro (o div com `flex-1 min-w-0 md:text-center`)

---

### 4. Como resolver o conflito no arquivo

Abra `src/components/layout/header.tsx` e:

1. Procure as marcações `<<<<<<<`, `=======`, `>>>>>>>`
2. Apague as 3 linhas de marcação
3. Do conteúdo conflitante, mantenha a versão que **não tem** o bloco central (o div `flex-1 min-w-0 md:text-center`)
4. Se ambas as versões têm o bloco central, apague-o manualmente

Resultado esperado: o `<header>` deve ter apenas 2 filhos diretos:
- `{/* Mobile Menu Button */}` ou o logo à esquerda
- O bloco de usuário à direita

---

### 5. Finalizar após resolver

```bash
# Verificar que não há mais marcadores de conflito
grep -n "<<<<<<\|=======\|>>>>>>>" src/components/layout/header.tsx
# Se o comando acima não mostrar nada, está ok

# Verificar TypeScript
npx tsc --noEmit

# Stage e commit
git add src/components/layout/header.tsx
git commit -m "fix: resolve conflito de merge com main no PR #68 — remove breadcrumb central"
git push origin fix/header-remove-breadcrumb
```

---

### 6. Verificação final

Antes de fazer push, confirme:

- [ ] O arquivo `src/components/layout/header.tsx` não tem `<<<<<<< HEAD`
- [ ] O bloco `{/* Center: Page Title + Breadcrumb */}` foi removido
- [ ] `npx tsc --noEmit` sem erros
- [ ] `git push` executado com sucesso

---

## DoD (Definition of Done)

✅ Branch `fix/header-remove-breadcrumb` foi sincronizada com main
✅ Conflito em `header.tsx` resolvido (sem marcadores de conflito)
✅ Breadcrumb central removido
✅ TypeScript sem erros
✅ Push feito → PR #68 no GitHub mostrando "This branch has no conflicts"

---

## Após concluir

Escreva um arquivo em `docs/05-gestao/handoff/`:
```
NOTE_e1_pr68_done_2026-04-07.md
```
Com o conteúdo: "PR #68 resolvido. Branch sincronizada e push feito."

---

## ⚠️ Regras para Haiku

- **NÃO** crie novos arquivos além do que está aqui
- **NÃO** faça git em outras branches
- **NÃO** faça push na main
- **NÃO** mude funcionalidade — só resolve conflito
- Se travar, escreva `NOTE_e1_pr68_BLOQUEADO.md` explicando onde travou
