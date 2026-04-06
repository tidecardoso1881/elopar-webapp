#!/usr/bin/env bash
# =============================================================================
# sync-github-cards.sh
# Cria issues no GitHub para cada EP do backlog Elopar
# e adiciona ao Project Board com campos Workflow + Prioridade preenchidos.
#
# COMO RODAR (Windows Git Bash):
#   bash scripts/sync-github-cards.sh
#
# PRÉ-REQUISITO:
#   gh auth login  (gh CLI autenticado)
#   Project Board já criado (rode setup-github-project.sh antes)
#
# O script é IDEMPOTENTE: verifica se a issue já existe antes de criar.
# =============================================================================

set -euo pipefail

OWNER="tidecardoso1881"
REPO="elopar-webapp"

echo ""
echo "============================================"
echo "  Elopar — Sync GitHub Project Cards"
echo "============================================"
echo ""

# Verificar autenticação
echo "▶ Verificando autenticação no GitHub..."
gh auth status || { echo "❌ Rode 'gh auth login' primeiro."; exit 1; }
echo ""

# ─────────────────────────────────────────
# Localizar o projeto pelo título
# ─────────────────────────────────────────
echo "▶ Buscando Project Board..."

PROJECT_NUMBER=$(gh project list \
  --owner "$OWNER" \
  --format json \
  --jq '.projects[] | select(.title | test("Elopar WebApp")) | .number' 2>/dev/null | head -1)

if [[ -z "$PROJECT_NUMBER" ]]; then
  echo "❌ Project Board não encontrado."
  echo "   Rode primeiro: bash scripts/setup-github-project.sh"
  exit 1
fi

echo "✅ Project encontrado: #$PROJECT_NUMBER"
echo ""

# ─────────────────────────────────────────
# Função auxiliar: criar ou reusar issue
# Retorna o número da issue
# ─────────────────────────────────────────
create_or_get_issue() {
  local title="$1"
  local body="$2"
  local labels="$3"

  # Verificar se issue com esse título já existe
  EXISTING=$(gh issue list \
    --repo "$OWNER/$REPO" \
    --state all \
    --search "\"$title\" in:title" \
    --json number,title \
    --jq ".[] | select(.title == \"$title\") | .number" 2>/dev/null | head -1)

  if [[ -n "$EXISTING" ]]; then
    echo "$EXISTING"
    return
  fi

  # Criar nova issue (gh issue create retorna a URL, extrair o número)
  NEW_URL=$(gh issue create \
    --repo "$OWNER/$REPO" \
    --title "$title" \
    --body "$body" \
    --label "$labels" 2>/dev/null)

  NEW=$(echo "$NEW_URL" | grep -oE '[0-9]+$')
  echo "$NEW"
}

# ─────────────────────────────────────────
# Função auxiliar: adicionar issue ao project
# e setar campo Workflow + Prioridade
# ─────────────────────────────────────────
add_to_project() {
  local issue_number="$1"
  local workflow="$2"
  local prioridade="$3"

  ISSUE_URL="https://github.com/$OWNER/$REPO/issues/$issue_number"

  # Adicionar ao projeto
  ITEM_ID=$(gh project item-add "$PROJECT_NUMBER" \
    --owner "$OWNER" \
    --url "$ISSUE_URL" \
    --format json \
    --jq '.id' 2>/dev/null)

  if [[ -z "$ITEM_ID" ]]; then
    # Item pode já estar no projeto — buscar pelo URL
    ITEM_ID=$(gh project item-list "$PROJECT_NUMBER" \
      --owner "$OWNER" \
      --format json \
      --jq ".items[] | select(.content.url == \"$ISSUE_URL\") | .id" 2>/dev/null | head -1)
  fi

  if [[ -z "$ITEM_ID" ]]; then
    echo "  ⚠️  Não foi possível obter o item ID para issue #$issue_number"
    return
  fi

  # Setar campo Status Kanban
  gh project item-edit \
    --project-id "$(get_project_id)" \
    --id "$ITEM_ID" \
    --field-id "$(get_field_id "Status Kanban")" \
    --single-select-option-id "$(get_option_id "Status Kanban" "$workflow")" \
    2>/dev/null || echo "  ⚠️  Falha ao setar Status Kanban para '$workflow'"

  # Setar campo MoSCoW
  gh project item-edit \
    --project-id "$(get_project_id)" \
    --id "$ITEM_ID" \
    --field-id "$(get_field_id "MoSCoW")" \
    --single-select-option-id "$(get_option_id "MoSCoW" "$prioridade")" \
    2>/dev/null || echo "  ⚠️  Falha ao setar MoSCoW para '$prioridade'"
}

# ─────────────────────────────────────────
# Cache de IDs (para não repetir chamadas GraphQL)
# ─────────────────────────────────────────
PROJECT_ID=""
declare -A FIELD_IDS
declare -A OPTION_IDS

get_project_id() {
  if [[ -z "$PROJECT_ID" ]]; then
    PROJECT_ID=$(gh api graphql -f query='
      query($owner: String!, $number: Int!) {
        user(login: $owner) {
          projectV2(number: $number) { id }
        }
      }' -f owner="$OWNER" -F number="$PROJECT_NUMBER" \
      --jq '.data.user.projectV2.id' 2>/dev/null)
  fi
  echo "$PROJECT_ID"
}

get_field_id() {
  local field_name="$1"
  if [[ -z "${FIELD_IDS[$field_name]:-}" ]]; then
    FIELD_IDS[$field_name]=$(gh api graphql -f query='
      query($projectId: ID!) {
        node(id: $projectId) {
          ... on ProjectV2 {
            fields(first: 20) {
              nodes {
                ... on ProjectV2SingleSelectField { id name }
              }
            }
          }
        }
      }' -f projectId="$(get_project_id)" \
      --jq ".data.node.fields.nodes[] | select(.name == \"$field_name\") | .id" 2>/dev/null)
  fi
  echo "${FIELD_IDS[$field_name]}"
}

get_option_id() {
  local field_name="$1"
  local option_name="$2"
  local cache_key="${field_name}::${option_name}"
  if [[ -z "${OPTION_IDS[$cache_key]:-}" ]]; then
    OPTION_IDS[$cache_key]=$(gh api graphql -f query='
      query($projectId: ID!) {
        node(id: $projectId) {
          ... on ProjectV2 {
            fields(first: 20) {
              nodes {
                ... on ProjectV2SingleSelectField {
                  name
                  options { id name }
                }
              }
            }
          }
        }
      }' -f projectId="$(get_project_id)" \
      --jq ".data.node.fields.nodes[] | select(.name == \"$field_name\") | .options[] | select(.name | test(\"$option_name\")) | .id" 2>/dev/null | head -1)
  fi
  echo "${OPTION_IDS[$cache_key]}"
}

# =============================================================================
# LABELS — garantir que existam
# =============================================================================
echo "▶ Criando labels necessárias..."
for label_def in \
  "must-have:🔴 Must Have:FF0000" \
  "should-have:🟠 Should Have:FFA500" \
  "could-have:🟢 Could Have:00AA00" \
  "pm-task:📋 PM Task:0075CA" \
  "entregue:✅ Entregue:00AA00" \
  "pronto-para-dev:🚀 Pronto para Dev:FBCA04"
do
  lname=$(echo "$label_def" | cut -d: -f1)
  ldesc=$(echo "$label_def" | cut -d: -f2)
  lcolor=$(echo "$label_def" | cut -d: -f3)
  gh label create "$lname" \
    --repo "$OWNER/$REPO" \
    --description "$ldesc" \
    --color "$lcolor" \
    --force 2>/dev/null \
    && echo "  ✅ $lname" || echo "  — $lname (já existe)"
done
echo ""

# =============================================================================
# ISSUES — criar e posicionar
# =============================================================================

echo "▶ Criando/sincronizando issues..."
echo ""

# ─────────────────────────────────────────
# EP-NEW-001 — ✅ Entregue → Produção
# ─────────────────────────────────────────
echo "  EP-NEW-001 — Esqueci Minha Senha..."
N=$(create_or_get_issue \
  "[EP-NEW-001] Esqueci Minha Senha" \
  "## Descrição
Recuperação de senha via token por e-mail. Rotas \`/reset-password\` e \`/update-password\`.

## Status
✅ **Entregue** — \`/reset-password\` + \`/update-password\` já existiam; corrigido \`proxy.ts\` (rotas públicas) + login link text.

## Mockup
\`docs/00-projeto/1 - backlog de melhorias/mockups/EP-NEW-001_forgot_password.html\`

## Skill utilizada
\`nextjs-supabase-auth\`" \
  "must-have,entregue")
add_to_project "$N" "Produção" "Must Have"
echo "     Issue #$N → 🚀 Produção"

# ─────────────────────────────────────────
# EP-NEW-002 — ✅ Entregue → Produção
# ─────────────────────────────────────────
echo "  EP-NEW-002 — Templates Excel para Importação..."
N=$(create_or_get_issue \
  "[EP-NEW-002] Templates Excel para Importação da Base" \
  "## Descrição
Templates Excel + script Python de importação idempotente no Supabase.

## Status
✅ **Entregue** — \`docs/importacao/\` + \`scripts/import/import_from_excel.py\`

## Entregáveis
- \`docs/importacao/1_template_clientes.xlsx\`
- \`scripts/import/import_from_excel.py\`
- Ordem de importação: clientes → profissionais → equipamentos → férias. Idempotente.

## Skill utilizada
\`senior-fullstack\`" \
  "must-have,entregue")
add_to_project "$N" "Produção" "Must Have"
echo "     Issue #$N → 🚀 Produção"

# ─────────────────────────────────────────
# EP-NEW-003 — ✅ Entregue → Produção
# ─────────────────────────────────────────
echo "  EP-NEW-003 — Dashboard de Saúde dos Testes..."
N=$(create_or_get_issue \
  "[EP-NEW-003] Dashboard de Saúde dos Testes" \
  "## Descrição
Painel na Área do Usuário (admin only): % cobertura, status integração/E2E, gráfico histórico semanal.

## Status
✅ **Entregue** — migration \`test_health_logs\` aplicada, seed 8 semanas, rotas \`/area-usuario\` + \`/area-usuario/saude-testes\`, chart Recharts.

## Mockup
\`docs/00-projeto/1 - backlog de melhorias/mockups/EP-NEW-003_saude_testes.html\`

## Skill utilizada
\`senior-fullstack\`" \
  "must-have,entregue")
add_to_project "$N" "Produção" "Must Have"
echo "     Issue #$N → 🚀 Produção"

# ─────────────────────────────────────────
# EP-NEW-004 — 🟢 Pronto para Dev → Definition of Ready
# ─────────────────────────────────────────
echo "  EP-NEW-004 — Alertas de Renovação de Contrato..."
N=$(create_or_get_issue \
  "[EP-NEW-004] Alertas de Renovação de Contrato" \
  "## Descrição
Badges na listagem (≤90 dias), centro de notificações \`/notificacoes\`, e-mail automático via Resend, job diário.

## Status
🟢 **Pronto para Desenvolver** — DoR aprovada, mockup aprovado.

## Mockup
\`docs/00-projeto/1 - backlog de melhorias/mockups/EP-NEW-004_alertas.html\`

## Critérios de Aceite
- [ ] Badge visual na listagem para contratos vencendo em ≤90 dias
- [ ] Centro de notificações em \`/notificacoes\`
- [ ] E-mail automático via Resend
- [ ] Job diário rodando no Supabase/Vercel Cron

## Skill sugerida
\`senior-fullstack\`" \
  "must-have,pronto-para-dev")
add_to_project "$N" "Definition of Ready" "Must Have"
echo "     Issue #$N → ✅ Definition of Ready"

# ─────────────────────────────────────────
# EP-NEW-005 — Should Have → Backlog
# ─────────────────────────────────────────
echo "  EP-NEW-005 — Área de Usuário Unificada..."
N=$(create_or_get_issue \
  "[EP-NEW-005] Área de Usuário Unificada" \
  "## Descrição
Consolidar informações duplicadas (barra superior direita + menu inferior esquerdo) em um único dropdown no canto superior direito.

Submenus: Dados do Usuário, Trocar Foto, Gerenciar Usuários.

## Status
⏳ Backlog — aguarda entrada no Kanban.

## Mockup
\`docs/00-projeto/1 - backlog de melhorias/mockups/PM005_area_usuario.html\`

## Dependências
- Precede EP-NEW-005A (Criação de Usuários no Admin)" \
  "should-have")
add_to_project "$N" "Backlog" "Should Have"
echo "     Issue #$N → 📋 Backlog"

# ─────────────────────────────────────────
# EP-NEW-005A — Must Have → Backlog (bloqueado)
# ─────────────────────────────────────────
echo "  EP-NEW-005A — Criação de Usuários na Área do Admin..."
N=$(create_or_get_issue \
  "[EP-NEW-005A] Criação de Usuários na Área do Admin" \
  "## Descrição
Dentro da Área do Usuário (admin): listar usuários, criar novo perfil (nome, e-mail, role), Supabase envia convite, admin pode desativar/remover.

## Status
⏳ Rascunho — aguarda PM-TASK-001 (Detalhar Perfis & Permissões).

## Bloqueadores
- **PM-TASK-001** — Especificação de perfis e permissões
- **EP-NEW-005** — Área de Usuário Unificada

## Skill sugerida
\`senior-fullstack\`" \
  "must-have")
add_to_project "$N" "Backlog" "Must Have"
echo "     Issue #$N → 📋 Backlog"

# ─────────────────────────────────────────
# EP-NEW-006 — Should Have → Backlog
# ─────────────────────────────────────────
echo "  EP-NEW-006 — Exportação CSV/Excel/PDF..."
N=$(create_or_get_issue \
  "[EP-NEW-006] Exportação de Dados CSV/Excel/PDF" \
  "## Descrição
Botão de exportação na listagem de profissionais com filtros aplicados.
Formatos: CSV (dados brutos), Excel (formatado), PDF (relatório).

## Status
⏳ Backlog — aguarda entrada no Kanban." \
  "should-have")
add_to_project "$N" "Backlog" "Should Have"
echo "     Issue #$N → 📋 Backlog"

# ─────────────────────────────────────────
# EP-NEW-007 — Should Have → Backlog
# ─────────────────────────────────────────
echo "  EP-NEW-007 — Audit Log..."
N=$(create_or_get_issue \
  "[EP-NEW-007] Audit Log — Histórico de Ações" \
  "## Descrição
Registro de criações, edições, deleções e logins. Visível apenas para admins.
Tabela \`audit_logs\` no Supabase.

## Status
⏳ Backlog — aguarda entrada no Kanban." \
  "should-have")
add_to_project "$N" "Backlog" "Should Have"
echo "     Issue #$N → 📋 Backlog"

# ─────────────────────────────────────────
# EP-NEW-008 — Should Have → Backlog
# ─────────────────────────────────────────
echo "  EP-NEW-008 — Filtros Avançados de Profissionais..."
N=$(create_or_get_issue \
  "[EP-NEW-008] Filtros Avançados de Profissionais" \
  "## Descrição
Filtros combinados por cliente, status de contrato, faixa de vencimento, senioridade, tecnologia.
Salvar filtros favoritos. Busca full-text.

## Status
⏳ Backlog — aguarda entrada no Kanban." \
  "should-have")
add_to_project "$N" "Backlog" "Should Have"
echo "     Issue #$N → 📋 Backlog"

# ─────────────────────────────────────────
# EP-NEW-009 — Should Have → Backlog
# ─────────────────────────────────────────
echo "  EP-NEW-009 — Gestão de Permissões Granular..."
N=$(create_or_get_issue \
  "[EP-NEW-009] Gestão de Permissões Granular" \
  "## Descrição
Papéis além de admin/user: visualizador, editor por cliente, gestor.
Controle de quais clientes cada usuário acessa.

## Status
⏳ Backlog — aguarda entrada no Kanban.

## Dependências
- PM-TASK-001 (Detalhar Perfis & Permissões)" \
  "should-have")
add_to_project "$N" "Backlog" "Should Have"
echo "     Issue #$N → 📋 Backlog"

# ─────────────────────────────────────────
# EP-NEW-010 — Could Have → Backlog
# ─────────────────────────────────────────
echo "  EP-NEW-010 — Redesign de Tipografia..."
N=$(create_or_get_issue \
  "[EP-NEW-010] Redesign de Tipografia e Densidade Visual" \
  "## Descrição
Fontes de todas as telas estão muito grandes. Reduzir ~20%, aumentar densidade, revisar hierarquia visual dos cabeçalhos e espaçamentos.

## Status
⏳ Backlog.

## Mockup
\`docs/00-projeto/1 - backlog de melhorias/mockups/PM014_tipografia.html\`" \
  "could-have")
add_to_project "$N" "Backlog" "Could Have"
echo "     Issue #$N → 📋 Backlog"

# ─────────────────────────────────────────
# EP-NEW-011 — Could Have → Backlog
# ─────────────────────────────────────────
echo "  EP-NEW-011 — Toolbar Única..."
N=$(create_or_get_issue \
  "[EP-NEW-011] Toolbar Única (remover duplicata)" \
  "## Descrição
Sistema está com 2 toolbars. Manter somente a da parte superior.
Item separado de EP-NEW-005 (Área de Usuário).

## Status
⏳ Backlog." \
  "could-have")
add_to_project "$N" "Backlog" "Could Have"
echo "     Issue #$N → 📋 Backlog"

# ─────────────────────────────────────────
# EP-NEW-012 — Could Have → Backlog
# ─────────────────────────────────────────
echo "  EP-NEW-012 — Dashboard de Métricas Kanban..."
N=$(create_or_get_issue \
  "[EP-NEW-012] Dashboard de Métricas Kanban" \
  "## Descrição
Lead Time, Cycle Time, Throughput e WIP por coluna. Gráfico de cumulative flow e burn-up. Visível para gestores.

## Status
⏳ Backlog.

## Mockup
\`docs/00-projeto/1 - backlog de melhorias/mockups/PM010_metricas.html\`

## Observação
Acesso restrito a tidebatera@gmail.com via METRICS_ALLOWED_EMAIL." \
  "could-have")
add_to_project "$N" "Backlog" "Could Have"
echo "     Issue #$N → 📋 Backlog"

# ─────────────────────────────────────────
# EP-NEW-013 — Could Have → Backlog
# ─────────────────────────────────────────
echo "  EP-NEW-013 — Histórico de Alterações por Profissional..."
N=$(create_or_get_issue \
  "[EP-NEW-013] Histórico de Alterações por Profissional" \
  "## Descrição
Timeline visual na ficha do profissional mostrando todas as alterações: mudanças de cliente, renovações, edições de dados.

## Status
⏳ Backlog." \
  "could-have")
add_to_project "$N" "Backlog" "Could Have"
echo "     Issue #$N → 📋 Backlog"

# ─────────────────────────────────────────
# EP-NEW-014 — Could Have → Backlog
# ─────────────────────────────────────────
echo "  EP-NEW-014 — Notas e Comentários por Profissional..."
N=$(create_or_get_issue \
  "[EP-NEW-014] Notas e Comentários por Profissional" \
  "## Descrição
Campo de observações livres vinculado a cada profissional, com autor e data.
Visível apenas para gestores.

## Status
⏳ Backlog." \
  "could-have")
add_to_project "$N" "Backlog" "Could Have"
echo "     Issue #$N → 📋 Backlog"

# ─────────────────────────────────────────
# EP-NEW-015 — Could Have → Backlog
# ─────────────────────────────────────────
echo "  EP-NEW-015 — Busca Global / Command Palette..."
N=$(create_or_get_issue \
  "[EP-NEW-015] Busca Global / Command Palette" \
  "## Descrição
Atalho Ctrl+K, busca profissionais, clientes, funcionalidades em tempo real com highlight.

## Status
⏳ Backlog.

## Mockup
\`docs/00-projeto/1 - backlog de melhorias/mockups/PM013_busca_global.html\`" \
  "could-have")
add_to_project "$N" "Backlog" "Could Have"
echo "     Issue #$N → 📋 Backlog"

# ─────────────────────────────────────────
# EP-NEW-016 — Could Have → Backlog
# ─────────────────────────────────────────
echo "  EP-NEW-016 — PWA — Acesso Mobile Offline..."
N=$(create_or_get_issue \
  "[EP-NEW-016] PWA — Acesso Mobile Offline" \
  "## Descrição
Configurar como Progressive Web App para instalação no celular.
Cache das últimas consultas para uso offline. Notificações push nativas.

## Status
⏳ Backlog." \
  "could-have")
add_to_project "$N" "Backlog" "Could Have"
echo "     Issue #$N → 📋 Backlog"

# ─────────────────────────────────────────
# PM-TASK-001 — PM Task → Backlog
# ─────────────────────────────────────────
echo "  PM-TASK-001 — Detalhar Perfis & Permissões..."
N=$(create_or_get_issue \
  "[PM-TASK-001] PM: Detalhar Perfis & Permissões" \
  "## Descrição
Task de PM (não é desenvolvimento).
Documentar perfis (admin/manager/viewer/etc.), permissões por tela, mapeamento para RLS Supabase, impacto em rotas e menus.

## Entregável
\`DoR_Perfis_Permissoes_[data].docx\` em \`docs/00-projeto/\`

## Status
⏳ Aguarda execução pelo PM autônomo.

## Referência para
- EP-NEW-003 (Dashboard de Testes)
- EP-NEW-005A (Criação de Usuários no Admin)" \
  "pm-task,could-have")
add_to_project "$N" "Backlog" "Should Have"
echo "     Issue #$N → 📋 Backlog"

# =============================================================================
# RESUMO
# =============================================================================
echo ""
echo "============================================"
echo "  ✅ Sync concluído!"
echo "============================================"
echo ""
echo "  Cards criados/atualizados:"
echo "    🚀 Produção      → EP-NEW-001, EP-NEW-002, EP-NEW-003"
echo "    ✅ DoR           → EP-NEW-004"
echo "    📋 Backlog       → EP-NEW-005, 005A, 006..016, PM-TASK-001"
echo ""
echo "  Próximo passo:"
echo "    Acesse https://github.com/orgs/$OWNER/projects ou"
echo "    https://github.com/$OWNER/$REPO/projects"
echo "    e ative a visualização 'Board' para conferir."
echo ""
