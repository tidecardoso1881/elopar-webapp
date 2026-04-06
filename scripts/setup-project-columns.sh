#!/usr/bin/env bash
# =============================================================================
# setup-project-columns.sh
# Configura as colunas do Kanban no projeto GitHub #4
#
# COMO RODAR (Windows Git Bash):
#   bash scripts/setup-project-columns.sh
# =============================================================================

set -euo pipefail

OWNER="tidecardoso1881"
PROJECT_NUMBER=4

echo ""
echo "============================================"
echo "  Elopar — Configurar Colunas do Kanban"
echo "============================================"
echo ""

# ─────────────────────────────────────────
# PASSO 1: Buscar o ID do projeto via GraphQL
# ─────────────────────────────────────────
echo "▶ Buscando ID do projeto #$PROJECT_NUMBER..."

PROJECT_ID=$(gh api graphql -f query='
  query($owner: String!, $number: Int!) {
    user(login: $owner) {
      projectV2(number: $number) {
        id
        title
      }
    }
  }' -f owner="$OWNER" -F number=$PROJECT_NUMBER \
  --jq '.data.user.projectV2.id')

echo "  ✅ Project ID: $PROJECT_ID"
echo ""

# ─────────────────────────────────────────
# PASSO 2: Criar campo "Status" com as colunas do Kanban
# (substitui o Status padrão do GitHub)
# ─────────────────────────────────────────
echo "▶ Criando campo 'Status' com colunas Kanban..."

gh api graphql -f query='
  mutation($projectId: ID!) {
    createProjectV2Field(input: {
      projectId: $projectId
      dataType: SINGLE_SELECT
      name: "Status Kanban"
      singleSelectOptions: [
        {name: "📋 Backlog",              color: GRAY,   description: "Aguardando priorização"}
        {name: "🔍 Entendimento",          color: BLUE,   description: "Análise e refinamento"}
        {name: "✅ Definition of Ready",   color: YELLOW, description: "Pronto para desenvolver"}
        {name: "🚧 Em Desenvolvimento",    color: ORANGE, description: "Em progresso"}
        {name: "🧪 Testes",               color: PURPLE, description: "Validação técnica"}
        {name: "👀 Code Review",           color: PINK,   description: "Revisão de código"}
        {name: "🔎 Homologação",           color: RED,    description: "Validação por Tide"}
        {name: "🚀 Produção",             color: GREEN,  description: "Entregue"}
      ]
    }) {
      projectV2Field {
        ... on ProjectV2SingleSelectField {
          id
          name
        }
      }
    }
  }' -f projectId="$PROJECT_ID" \
  --jq '.data.createProjectV2Field.projectV2Field.name' \
  && echo "  ✅ Campo 'Status Kanban' criado com 8 colunas!" \
  || echo "  ⚠️  Falhou — campo pode já existir"

echo ""

# ─────────────────────────────────────────
# PASSO 3: Criar campo "MoSCoW"
# ─────────────────────────────────────────
echo "▶ Criando campo 'MoSCoW'..."

gh api graphql -f query='
  mutation($projectId: ID!) {
    createProjectV2Field(input: {
      projectId: $projectId
      dataType: SINGLE_SELECT
      name: "MoSCoW"
      singleSelectOptions: [
        {name: "🔴 Must Have",   color: RED,    description: "Obrigatório"}
        {name: "🟠 Should Have", color: ORANGE, description: "Alta prioridade"}
        {name: "🟢 Could Have",  color: GREEN,  description: "Desejável"}
        {name: "⚫ Wont Have",   color: GRAY,   description: "Fora do escopo"}
      ]
    }) {
      projectV2Field {
        ... on ProjectV2SingleSelectField { id name }
      }
    }
  }' -f projectId="$PROJECT_ID" \
  --jq '.data.createProjectV2Field.projectV2Field.name' \
  && echo "  ✅ Campo 'MoSCoW' criado!" \
  || echo "  ⚠️  Falhou — campo pode já existir"

echo ""

# ─────────────────────────────────────────
# PASSO 4: Criar campo "Tipo"
# ─────────────────────────────────────────
echo "▶ Criando campo 'Tipo'..."

gh api graphql -f query='
  mutation($projectId: ID!) {
    createProjectV2Field(input: {
      projectId: $projectId
      dataType: SINGLE_SELECT
      name: "Tipo"
      singleSelectOptions: [
        {name: "✨ Feature",  color: BLUE,   description: "Nova funcionalidade"}
        {name: "🐛 Bug",      color: RED,    description: "Correção de bug"}
        {name: "🎨 UX/UI",    color: PINK,   description: "Melhoria visual"}
        {name: "🔐 Segurança",color: ORANGE, description: "Segurança"}
        {name: "🗄️ Dados",    color: PURPLE, description: "Banco de dados"}
        {name: "⚙️ Infra",    color: GRAY,   description: "Infraestrutura"}
      ]
    }) {
      projectV2Field {
        ... on ProjectV2SingleSelectField { id name }
      }
    }
  }' -f projectId="$PROJECT_ID" \
  --jq '.data.createProjectV2Field.projectV2Field.name' \
  && echo "  ✅ Campo 'Tipo' criado!" \
  || echo "  ⚠️  Falhou — campo pode já existir"

echo ""

# ─────────────────────────────────────────
# RESUMO
# ─────────────────────────────────────────
echo "============================================"
echo "  ✅ Colunas configuradas!"
echo "============================================"
echo ""
echo "  Acesse: https://github.com/users/$OWNER/projects/$PROJECT_NUMBER"
echo ""
echo "  Para ver o Board:"
echo "  1. Clique em '+ New view'"
echo "  2. Selecione 'Board'"
echo "  3. Agrupar por 'Status Kanban'"
echo ""
