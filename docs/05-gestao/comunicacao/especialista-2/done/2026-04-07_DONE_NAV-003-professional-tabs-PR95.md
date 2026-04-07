# NAV-003 — Abas no Detalhe do Profissional (Histórico + Notas)

**Status:** 🟡 FAZENDO (iniciado 2026-04-07 12:00)
**Branch:** feat/nav-professional-tabs
**Base:** main
**Prioridade:** MÉDIO

---

## Descrição

A página `/profissionais/[id]` renderiza tudo em scroll vertical contínuo.
Será implementado TabBar com 3 abas:
- **Dados** — conteúdo principal (Contrato, Financeiro, Férias, Contato, Equipamento, etc.)
- **Histórico** — ProfessionalHistorico
- **Notas** — ProfessionalNotes (visível apenas para admin/gerente com badge de contagem)

---

## Arquivos a Modificar

- `src/app/(dashboard)/profissionais/[id]/page.tsx`
  - Criar componente `ProfessionalTabs` (client component com useState)
  - Extrair conteúdo para `DadosTab`
  - Mover `ProfessionalHistorico` e `ProfessionalNotes` para abas

---

## Critérios de Aceite (DoD)

✅ Página abre na aba "Dados" por padrão
✅ Aba "Histórico" funciona
✅ Aba "Notas" só aparece para admin/gerente com badge de contagem
✅ `npx tsc --noEmit` sem erros
✅ `npm run lint` sem erros
✅ `npm run build` sem erros
✅ Nenhuma prop quebrada

---

## Próximos Passos

1. Checkout para main + pull
2. Criar branch feat/nav-professional-tabs
3. Implementar ProfessionalTabs component
4. Implementar DadosTab component
5. Refatorar return de ProfessionalDetailPage
6. tsc + lint + build
7. git fetch + merge origin/main
8. Abrir PR

---

**Status:** 🟡 EM PROGRESSO
