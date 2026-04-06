# Catálogo de Backlog — Elopar

> Atualizado em: 06/04/2026 v2 | Ajustes Tide aplicados: EP-NEW-001 rescopo, EP-NEW-002 rescopo, EP-NEW-003 ajuste acesso | Novas tasks: EP-NEW-005A, PM-TASK-001

---

## Resumo Executivo

| Prioridade | Qtd | Status |
|---|---|---|
| 🔴 Must Have | 6 | 1 Pronto para Dev (EP-NEW-002), 3 aguardam mockup, 2 aguardam PM-TASK-001 |
| 🟠 Should Have | 5 | Pendente desenvolvimento |
| 🟢 Could Have | 7 | Pendente desenvolvimento |
| ⚫ Won't Have | 3 | Fora do escopo atual |
| 🐛 Bug | 1 | ✅ Resolvido (commit 4aab1e1) |

---

## 🔴 MUST HAVE

### EP-NEW-001 — Esqueci Minha Senha
**Fonte:** `Backlog_Melhorias_0604_não feitas.docx` + PM-002
**Descrição:** Recuperação de senha via token por e-mail. Rotas /reset-password e /update-password.
**Mockup:** ✅ Aprovado — `EP-NEW-001_forgot_password.html`
**Executor:** Agente (skill: nextjs-supabase-auth)
**Status:** ✅ Entregue — `/reset-password` + `/update-password` já existiam; corrigido proxy.ts (rotas públicas) + login link text

### EP-NEW-002 — Templates Excel para Importação da Base
**Fonte:** `Backlog_Melhorias_0604_não feitas.docx` + PM-003
**Descrição:** Templates Excel + script Python de importação idempotente no Supabase.
**Mockup:** N/A — backend/script
**Executor:** Agente (skill: senior-fullstack)
**Status:** ✅ Entregue — `docs/importacao/` + `scripts/import/import_from_excel.py`

### EP-NEW-003 — Dashboard de Saúde dos Testes
**Fonte:** PM-001
**Descrição:** Painel na Área do Usuário (admin only): % cobertura, status integração/E2E, gráfico histórico semanal.
**Mockup:** ✅ Aprovado — `EP-NEW-003_saude_testes.html`
**Executor:** Agente (skill: senior-fullstack)
**Status:** ✅ Entregue — migration `test_health_logs` aplicada, seed 8 semanas, rotas `/area-usuario` + `/area-usuario/saude-testes`, chart Recharts

### EP-NEW-004 — Alertas de Renovação de Contrato
**Fonte:** PM-004
**Descrição:** Badges na listagem (≤90 dias), centro de notificações /notificacoes, e-mail automático via Resend, job diário.
**Mockup:** ✅ Aprovado — `EP-NEW-004_alertas.html`
**Executor:** Agente (skill: senior-fullstack)
**Status:** 🟢 Pronto para Desenvolver

---

## 🟠 SHOULD HAVE

### EP-NEW-005 — Área de Usuário Unificada
**Fonte:** `Backlog_Melhorias_0604_não feitas.docx` + PM-005
**Descrição:** Consolidar informações duplicadas (barra superior direita + menu inferior esquerdo) em um único dropdown no canto superior direito. Submenus: Dados do Usuário, Trocar Foto, Gerenciar Usuários.
**Status:** ✅ Aprovado — aguarda entrada no Kanban

### EP-NEW-006 — Exportação de Dados CSV/Excel/PDF
**Fonte:** PM-006
**Descrição:** Botão de exportação na listagem de profissionais com filtros aplicados. Formatos: CSV (dados brutos), Excel (formatado), PDF (relatório).
**Status:** ✅ Aprovado — aguarda entrada no Kanban

### EP-NEW-007 — Audit Log — Histórico de Ações
**Fonte:** PM-007
**Descrição:** Registro de criações, edições, deleções e logins. Visível apenas para admins. Tabela `audit_logs` no Supabase.
**Status:** ✅ Aprovado — aguarda entrada no Kanban

### EP-NEW-008 — Filtros Avançados de Profissionais
**Fonte:** PM-008
**Descrição:** Filtros combinados por cliente, status de contrato, faixa de vencimento, senioridade, tecnologia. Salvar filtros favoritos. Busca full-text.
**Status:** ✅ Aprovado — aguarda entrada no Kanban

### EP-NEW-009 — Gestão de Permissões Granular
**Fonte:** PM-009
**Descrição:** Papéis além de admin/user: visualizador, editor por cliente, gestor. Controle de quais clientes cada usuário acessa.
**Status:** ✅ Aprovado — aguarda entrada no Kanban

---

## 🟢 COULD HAVE

### EP-NEW-010 — Redesign de Tipografia e Densidade Visual
**Fonte:** `Backlog_Melhorias_0604_não feitas.docx` + PM-014
**Descrição:** Fontes de todas as telas estão muito grandes. Reduzir ~20%, aumentar densidade, revisar hierarquia visual dos cabeçalhos e espaçamentos.
**Status:** ✅ Aprovado — aguarda entrada no Kanban

### EP-NEW-011 — Toolbar Única (remover duplicata)
**Fonte:** `Backlog_Melhorias_0604_não feitas.docx`
**Descrição:** Sistema está com 2 toolbars. Manter somente a da parte superior. Item separado de EP-NEW-005 (Área de Usuário).
**Status:** ✅ Aprovado — aguarda entrada no Kanban

### EP-NEW-012 — Dashboard de Métricas Kanban
**Fonte:** PM-010
**Descrição:** Lead Time, Cycle Time, Throughput e WIP por coluna. Gráfico de cumulative flow e burn-up. Visível para gestores.
**Status:** ✅ Aprovado — aguarda entrada no Kanban

### EP-NEW-013 — Histórico de Alterações por Profissional
**Fonte:** PM-011
**Descrição:** Timeline visual na ficha do profissional mostrando todas as alterações: mudanças de cliente, renovações, edições de dados.
**Status:** ✅ Aprovado — aguarda entrada no Kanban

### EP-NEW-014 — Notas e Comentários por Profissional
**Fonte:** PM-012
**Descrição:** Campo de observações livres vinculado a cada profissional, com autor e data. Visível apenas para gestores.
**Status:** ✅ Aprovado — aguarda entrada no Kanban

### EP-NEW-015 — Busca Global / Command Palette
**Fonte:** PM-013
**Descrição:** Atalho Ctrl+K, busca profissionais, clientes, funcionalidades em tempo real com highlight.
**Status:** ✅ Aprovado — aguarda entrada no Kanban

### EP-NEW-016 — PWA — Acesso Mobile Offline
**Fonte:** PM-015
**Descrição:** Configurar como Progressive Web App para instalação no celular. Cache das últimas consultas para uso offline. Notificações push nativas.
**Status:** ✅ Aprovado — aguarda entrada no Kanban

---

## ⚫ WON'T HAVE (ciclos futuros)

| ID | Título | Motivo |
|---|---|---|
| PM-016 | Integração com Folha de Pagamento | Alta complexidade, requer compliance de RH |
| PM-017 | App Mobile Nativo (iOS/Android) | PWA cobre o caso de uso com muito menos custo |
| PM-018 | Módulo de Recrutamento | Fora da proposta de valor atual |

---

## 🐛 BUGS RESOLVIDOS

### BUG-001 — Bug Vercel ✅ RESOLVIDO
**Fonte:** `Bug Vercel.docx` (movido para `resolvido/`)
**Erro:** `npm ci` falhando — `package-lock.json` corrompido no branch sprint-5
**Resolução:** Commit `4aab1e1` em 05/04/2026 — regenera package-lock.json + .gitattributes LF

---

---

## 🔴 MUST HAVE — Novas Tasks (geradas em revisão 06/04/2026)

### EP-NEW-005A — Criação de Usuários na Área do Admin
**Origem:** Ajuste EP-NEW-001 (Tide remove Primeiro Acesso e centraliza criação de usuários no admin)
**Descrição:** Dentro da Área do Usuário (admin): listar usuários, criar novo perfil (nome, e-mail, role), Supabase envia convite, admin pode desativar/remover.
**Dependências:** EP-NEW-005 (Área de Usuário) | PM-TASK-001 (Perfis & Permissões)
**Status:** ⏳ Rascunho — aguarda PM-TASK-001

---

## 🟢 COULD HAVE — Novas Tasks (geradas em revisão 06/04/2026)

### PM-TASK-001 — PM: Detalhar Perfis & Permissões
**Origem:** Ajuste EP-NEW-003 (Dashboard de Testes requer roles; EP-NEW-005A também depende)
**Tipo:** Task de PM — especificação, não desenvolvimento
**MoSCoW:** 🟢 Could Have *(ajuste Tide 06/04/2026)*
**Descrição:** Documentar perfis (admin/manager/viewer/etc.), permissões por tela, mapeamento para RLS Supabase, impacto em rotas e menus.
**Entregável:** DoR_Perfis_Permissoes_[data].docx em docs/00-projeto/
**Referência para:** EP-NEW-003, EP-NEW-005A
**Status:** ⏳ Aguarda execução pelo PM autônomo

---

*Atualizado em 06/04/2026 v2 — ajustes Tide aplicados, 2 novas tasks adicionadas*
