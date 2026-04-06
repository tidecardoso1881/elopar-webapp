#!/usr/bin/env bash
# =============================================================================
# create-github-project.sh
# Cria o projeto GitHub, adiciona todas as issues existentes
#
# COMO RODAR (Windows Git Bash):
#   bash scripts/create-github-project.sh
# =============================================================================

set -euo pipefail

OWNER="tidecardoso1881"
REPO="elopar-webapp"
PROJECT_TITLE="Elopar WebApp — Board de Tasks"

echo ""
echo "============================================"
echo "  Elopar — Criar Projeto GitHub"
echo "============================================"
echo ""

# ─────────────────────────────────────────
# PASSO 1: Verificar scope project
# ─────────────────────────────────────────
echo "▶ Verificando scopes do token..."
SCOPES=$(gh auth token | xargs -I{} curl -s -o /dev/null -w "%{response_code}" \
  -H "Authorization: token {}" https://api.github.com 2>/dev/null || true)

gh auth status 2>&1 | grep -i scope || true

# Testar acesso a projects
if ! gh project list --owner "$OWNER" --limit 1 > /dev/null 2>&1; then
  echo ""
  echo "❌ Sem acesso ao Projects. Rode primeiro:"
  echo "   gh auth refresh -h github.com -s project"
  echo ""
  exit 1
fi
echo "✅ Acesso ao Projects confirmado"
echo ""

# ─────────────────────────────────────────
# PASSO 2: Criar o projeto
# ─────────────────────────────────────────
echo "▶ Verificando se projeto já existe..."

EXISTING=$(gh project list --owner "$OWNER" --limit 20 2>/dev/null | grep "$PROJECT_TITLE" || true)

if [ -n "$EXISTING" ]; then
  PROJECT_NUMBER=$(echo "$EXISTING" | awk '{print $1}')
  echo "  ✅ Projeto já existe: #$PROJECT_NUMBER"
else
  echo "  Criando projeto '$PROJECT_TITLE'..."
  gh project create --owner "$OWNER" --title "$PROJECT_TITLE"
  PROJECT_NUMBER=$(gh project list --owner "$OWNER" --limit 20 2>/dev/null \
    | grep "$PROJECT_TITLE" | awk '{print $1}')
  echo "  ✅ Projeto criado: #$PROJECT_NUMBER"
fi

echo ""

# ─────────────────────────────────────────
# PASSO 3: Vincular repositório ao projeto
# ─────────────────────────────────────────
echo "▶ Vinculando repositório..."
gh project link "$PROJECT_NUMBER" --owner "$OWNER" --repo "$OWNER/$REPO" 2>/dev/null \
  && echo "  ✅ Repositório vinculado!" \
  || echo "  ↳ Já vinculado ou permissão insuficiente (ok)"
echo ""

# ─────────────────────────────────────────
# PASSO 4: Adicionar todas as issues abertas ao projeto
# ─────────────────────────────────────────
echo "▶ Adicionando issues ao projeto..."

ISSUE_URLS=$(gh issue list --repo "$OWNER/$REPO" --state open --limit 50 \
  --json url --jq '.[].url')

COUNT=0
while IFS= read -r url; do
  if [ -n "$url" ]; then
    gh project item-add "$PROJECT_NUMBER" --owner "$OWNER" --url "$url" > /dev/null 2>&1 \
      && echo "  ✅ $url" \
      || echo "  ↳ Já no projeto: $url"
    COUNT=$((COUNT + 1))
  fi
done <<< "$ISSUE_URLS"

echo ""
echo "  $COUNT issue(s) adicionada(s) ao projeto"
echo ""

# ─────────────────────────────────────────
# RESUMO
# ─────────────────────────────────────────
echo "============================================"
echo "  ✅ Concluído!"
echo "============================================"
echo ""
echo "  Acesse o projeto em:"
echo "  https://github.com/users/$OWNER/projects/$PROJECT_NUMBER"
echo ""
echo "  Próximos passos:"
echo "  1. Abrir o projeto no GitHub"
echo "  2. Trocar para visualização 'Board'"
echo "  3. As issues aparecerão na coluna padrão"
echo ""
