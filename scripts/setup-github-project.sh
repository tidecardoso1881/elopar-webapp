#!/usr/bin/env bash
# =============================================================================
# setup-github-project.sh
# Cria o GitHub Project V2 para o Elopar WebApp com o fluxo completo de tasks
#
# COMO RODAR (Windows Git Bash):
#   bash scripts/setup-github-project.sh
#
# PRÉ-REQUISITO: gh CLI autenticado
#   gh auth login
# =============================================================================

set -euo pipefail

OWNER="tidecardoso1881"
REPO="elopar-webapp"
PROJECT_TITLE="Elopar WebApp — Board de Tasks"

echo ""
echo "============================================"
echo "  Elopar WebApp — GitHub Project Setup"
echo "============================================"
echo ""

# Verificar autenticação
echo "▶ Verificando autenticação no GitHub..."
gh auth status || { echo "❌ Rode 'gh auth login' primeiro."; exit 1; }
echo ""

# ─────────────────────────────────────────
# PASSO 1: Criar o projeto
# ─────────────────────────────────────────
echo "▶ Criando projeto '$PROJECT_TITLE'..."

PROJECT_URL=$(gh project create \
  --owner "$OWNER" \
  --title "$PROJECT_TITLE" \
  --format json \
  --jq '.url' 2>/dev/null)

# Extrair o número do projeto da URL
PROJECT_NUMBER=$(echo "$PROJECT_URL" | grep -oE '[0-9]+$')

echo "✅ Projeto criado: $PROJECT_URL"
echo "   Número: $PROJECT_NUMBER"
echo ""

# ─────────────────────────────────────────
# PASSO 2: Vincular o repositório ao projeto
# ─────────────────────────────────────────
echo "▶ Vinculando repositório $OWNER/$REPO..."

gh project link "$PROJECT_NUMBER" \
  --owner "$OWNER" \
  --repo "$OWNER/$REPO" 2>/dev/null \
  && echo "✅ Repositório vinculado!" \
  || echo "⚠️  Link falhou (pode já estar vinculado ou precisar de permissão)"
echo ""

# ─────────────────────────────────────────
# PASSO 3: Criar campo "Workflow" (single-select)
# com as colunas do rito de desenvolvimento
# ─────────────────────────────────────────
echo "▶ Criando campo 'Workflow' com os estágios..."

gh project field-create "$PROJECT_NUMBER" \
  --owner "$OWNER" \
  --name "Workflow" \
  --data-type SINGLE_SELECT \
  --single-select-options "📋 Backlog,🔍 Entendimento,✅ Definition of Ready,🚧 Em Desenvolvimento,🧪 Testes,👀 Code Review,🔎 Homologação (Tide),🚀 Produção" \
  && echo "✅ Campo 'Workflow' criado!" \
  || echo "⚠️  Campo 'Workflow' falhou — veja nota abaixo"
echo ""

# ─────────────────────────────────────────
# PASSO 4: Criar campo "Sprint" (text)
# ─────────────────────────────────────────
echo "▶ Criando campo 'Sprint'..."
gh project field-create "$PROJECT_NUMBER" \
  --owner "$OWNER" \
  --name "Sprint" \
  --data-type TEXT \
  && echo "✅ Campo 'Sprint' criado!" \
  || echo "⚠️  Campo 'Sprint' já pode existir"
echo ""

# ─────────────────────────────────────────
# PASSO 5: Criar campo "Story Points" (number)
# ─────────────────────────────────────────
echo "▶ Criando campo 'Story Points'..."
gh project field-create "$PROJECT_NUMBER" \
  --owner "$OWNER" \
  --name "Story Points" \
  --data-type NUMBER \
  && echo "✅ Campo 'Story Points' criado!" \
  || echo "⚠️  Campo 'Story Points' já pode existir"
echo ""

# ─────────────────────────────────────────
# PASSO 6: Criar campo "Prioridade" (single-select)
# ─────────────────────────────────────────
echo "▶ Criando campo 'Prioridade'..."
gh project field-create "$PROJECT_NUMBER" \
  --owner "$OWNER" \
  --name "Prioridade" \
  --data-type SINGLE_SELECT \
  --single-select-options "🔴 P0 - Crítico,🟠 P1 - Alto,🟡 P2 - Médio,🟢 P3 - Baixo" \
  && echo "✅ Campo 'Prioridade' criado!" \
  || echo "⚠️  Campo 'Prioridade' falhou"
echo ""

# ─────────────────────────────────────────
# RESUMO FINAL
# ─────────────────────────────────────────
echo "============================================"
echo "  ✅ Setup concluído!"
echo "============================================"
echo ""
echo "  Projeto:  $PROJECT_TITLE"
echo "  URL:      $PROJECT_URL"
echo ""
echo "  Campos criados:"
echo "    - Workflow (📋 Backlog → 🚀 Produção)"
echo "    - Sprint (texto)"
echo "    - Story Points (número)"
echo "    - Prioridade (P0 → P3)"
echo ""
echo "  Colunas do Workflow:"
echo "    📋 Backlog"
echo "    🔍 Entendimento"
echo "    ✅ Definition of Ready"
echo "    🚧 Em Desenvolvimento"
echo "    🧪 Testes"
echo "    👀 Code Review"
echo "    🔎 Homologação (Tide)"
echo "    🚀 Produção"
echo ""
echo "  Próximo passo: acesse $PROJECT_URL"
echo "  e ative a visualização 'Board' para ver as colunas."
echo ""

# ─────────────────────────────────────────
# NOTA SOBRE --single-select-options
# ─────────────────────────────────────────
echo "  ℹ️  NOTA: Se o campo 'Workflow' falhou com erro de flag desconhecida,"
echo "  rode a versão alternativa manual abaixo:"
echo ""
echo "  gh api graphql -f query='"
echo "    mutation(\$projectId: ID!) {"
echo "      createProjectV2Field(input: {"
echo "        projectId: \$projectId"
echo "        dataType: SINGLE_SELECT"
echo "        name: \"Workflow\""
echo "        singleSelectOptions: ["
echo "          {name: \"📋 Backlog\",              color: GRAY}"
echo "          {name: \"🔍 Entendimento\",          color: BLUE}"
echo "          {name: \"✅ Definition of Ready\",   color: YELLOW}"
echo "          {name: \"🚧 Em Desenvolvimento\",    color: ORANGE}"
echo "          {name: \"🧪 Testes\",                color: PURPLE}"
echo "          {name: \"👀 Code Review\",            color: PINK}"
echo "          {name: \"🔎 Homologação (Tide)\",    color: RED}"
echo "          {name: \"🚀 Produção\",              color: GREEN}"
echo "        ]"
echo "      }) {"
echo "        projectV2Field { ... on ProjectV2SingleSelectField { id name } }"
echo "      }"
echo "    }' -f projectId=\"\$PROJECT_ID\""
echo ""
