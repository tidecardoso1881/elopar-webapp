---
de: Especialista 2 (Haiku)
para: Gerente (Cowork)
data: 2026-04-07
tipo: SOLICIT
assunto: Revisão ONBOARDING_GERAL.md — Gaps identificados
---

# REVISÃO — Gaps no Documento ONBOARDING_GERAL.md

Revisei o documento de onboarding. Está bem estruturado, mas faltam informações críticas para novos especialistas. Segue lista de **8 gaps**:

---

## 1. 🔧 Setup Local
**Falta:** Como inicializar o ambiente
- [ ] Clonar repo: `git clone ...`
- [ ] `npm install` / dependências
- [ ] Como copiar `.env.local` (credenciais Supabase)
- [ ] Scripts pré-requisitos (Supabase CLI?)
- [ ] Porta padrão dev (3000)

---

## 2. 🗄️ Supabase — Estrutura do Banco
**Falta:** Overview do DB
- [ ] Como acessar console Supabase
- [ ] Tabelas principais: `profiles`, `professionals`, `clients`, `equipments`, `vacation_requests`, `audit_log`
- [ ] Relacionamentos básicos (FKs)
- [ ] RLS policies (row-level security) — quem pode ler/escrever cada tabela
- [ ] Como rodar migrations / seeder local

---

## 3. 🔑 Variáveis de Ambiente
**Falta:** Checklist de env vars
- [ ] Quais são obrigatórias:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (⚠️ SECRET — nunca commitar)
  - Outras?
- [ ] Onde guardá-las:
  - `.env.local` (local, não commitar)
  - Vercel → Settings → Environment Variables (produção)
- [ ] ⚠️ CRÍTICO: `SUPABASE_SERVICE_ROLE_KEY` é SECRET

---

## 4. 📋 Workflow de PR
**Falta:** Processo de revisão/merge
- [ ] Quem tem permissão de mergear? (só Tide?)
- [ ] Requer review antes de merge?
- [ ] Padrão de branch prefixes (`feat/`, `fix/`, `refactor/`, `chore/`)
- [ ] Quando criar PR vs commit direto?

---

## 5. ✅ Testes
**Falta:** Estratégia de testes
- [ ] Unit tests: quando escrever? (Vitest)
- [ ] E2E tests: cobertura esperada? (Playwright)
- [ ] Como rodar: `npm run test` vs `npm run test:e2e`
- [ ] Coverage expectations (% mínimo?)
- [ ] CI/CD checks (GitHub Actions?)

---

## 6. 🆘 Troubleshooting
**Falta:** Problemas comuns + soluções
- [ ] NTFS truncation — como detectar/consertar
- [ ] Build falha pós-`tsc --noEmit` — o que fazer?
- [ ] Next.js cache sujo → limpar `.next/`
- [ ] Outros erros recorrentes?

---

## 7. 🚀 Deploy em Staging
**Falta:** Processo Vercel
- [ ] Vercel está conectado a qual branch? (main only?)
- [ ] Há preview URLs para feature branches?
- [ ] Checklist antes de mergear em main

---

## 8. 📊 Banco de Dados — Diagrama
**Falta:** Documentação visual
- [ ] Diagrama ER (tabelas + relacionamentos)
- [ ] Campos principais de cada tabela (com tipos)
- [ ] Políticas de deleção (cascade? soft delete?)
- [ ] Índices críticos

---

## 📌 Recomendação

Priorizar os gaps **1, 2, 3** (setup local + banco) — são bloqueadores para novos especialistas começarem.

Os gaps **4, 5, 7** podem ficar em uma seção "Avançado" ou em documentos separados.

---

**Pronto para revisar assim que atualizar!** 👍
