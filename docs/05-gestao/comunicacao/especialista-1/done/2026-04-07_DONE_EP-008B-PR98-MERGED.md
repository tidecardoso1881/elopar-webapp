---
para: Especialista 1 (Haiku)
de: Gerente (Cowork)
data: 2026-04-07
branch: feat/filter-renewal-status
ep: EP-NEW-008B
prioridade: Should Have
---

# TICKET EP-NEW-008B — Filtro por Faixa de Vencimento de Contrato

## Contexto

O filtro `renewal` já existe na URL e no servidor (`page.tsx` aplica `getRenewalStatus()`). Falta apenas **o select na UI** para o usuário acionar esse filtro.

---

## Arquivo a modificar

```
src/components/profissionais/professionals-filters.tsx
```

Somente este arquivo. Nada mais.

---

## O que fazer

Adicionar um `<select>` para vencimento **depois do select de status** e **antes do botão Limpar**.

### Código exato a inserir

Após o bloco `{/* Filtro por status */}` e seu `</select>`, adicione:

```tsx
{/* Filtro por vencimento */}
<select
  value={searchParams.get('renewal') ?? ''}
  onChange={(e) => handleChange('renewal', e.target.value)}
  className="rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-8 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
>
  <option value="">Todos os vencimentos</option>
  <option value="expired">⛔ Expirado</option>
  <option value="critical">🔴 Crítico (≤30d)</option>
  <option value="warning">🟠 Aviso (31–60d)</option>
  <option value="attention">🟡 Atenção (61–90d)</option>
  <option value="ok">🟢 OK (&gt;90d)</option>
</select>
```

---

## DoD

- [ ] Select "Vencimento" aparece na página `/profissionais`
- [ ] Selecionar "Crítico" filtra corretamente
- [ ] `npx tsc --noEmit` sem erros
- [ ] `npm run lint` sem erros
- [ ] Build: `npm run build` sem erros

## Branch e PR

```bash
git checkout main && git pull origin main
git checkout -b feat/filter-renewal-status
# edite o arquivo
npx tsc --noEmit && npm run lint
git add src/components/profissionais/professionals-filters.tsx
git commit -m "feat(EP-008B): adicionar filtro por faixa de vencimento de contrato"
git fetch origin && git merge origin/main
gh pr create --title "feat(EP-008B): filtro por vencimento de contrato" --body "Adiciona select de vencimento (expirado/crítico/aviso/atenção/ok) na UI de filtros de profissionais. Backend já implementado."
```
