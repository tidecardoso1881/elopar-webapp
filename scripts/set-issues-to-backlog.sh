#!/usr/bin/env bash
# =============================================================================
# set-issues-to-backlog.sh
# Move todas as issues do projeto #4 para "Status Kanban = 📋 Backlog"
# =============================================================================

set -euo pipefail

OWNER="tidecardoso1881"
PROJECT_NUMBER=4

# IDs fixos extraídos via list-project-fields.sh
FIELD_ID="PVTSSF_lADOBdJKls4A8qfizgwrCKI"   # será sobrescrito abaixo
OPTION_ID="32f3c2c6"                           # 📋 Backlog no campo Status Kanban

echo ""
echo "============================================"
echo "  Elopar — Mover issues para 📋 Backlog"
echo "============================================"
echo ""

# ── 1. Buscar PROJECT_ID e FIELD_ID reais ─────────────────────
echo "▶ Buscando IDs do projeto..."

RAW=$(gh api graphql -f query='
  query($owner: String!, $number: Int!) {
    user(login: $owner) {
      projectV2(number: $number) {
        id
        fields(first: 30) {
          nodes {
            ... on ProjectV2SingleSelectField { id name }
          }
        }
        items(first: 100) {
          nodes {
            id
            content {
              ... on Issue { title number }
              ... on PullRequest { title number }
            }
          }
        }
      }
    }
  }' -f owner="$OWNER" -F number=$PROJECT_NUMBER)

PROJECT_ID=$(echo "$RAW" | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['user']['projectV2']['id'])")
FIELD_ID=$(echo "$RAW"   | python3 -c "
import sys,json
fields = json.load(sys.stdin)['data']['user']['projectV2']['fields']['nodes']
f = next(f for f in fields if f.get('name') == 'Status Kanban')
print(f['id'])")

echo "  ✅ Project ID : $PROJECT_ID"
echo "  ✅ Field ID   : $FIELD_ID"
echo "  ✅ Option     : 📋 Backlog ($OPTION_ID)"
echo ""

# ── 2. Coletar IDs dos itens ───────────────────────────────────
ITEMS=$(echo "$RAW" | python3 -c "
import sys, json
items = json.load(sys.stdin)['data']['user']['projectV2']['items']['nodes']
for item in items:
    c = item.get('content') or {}
    title = c.get('title', '(draft)')
    print(item['id'] + '|||' + title)
")

# ── 3. Atualizar cada item ─────────────────────────────────────
echo "▶ Atualizando issues..."
COUNT=0

while IFS='|||' read -r item_id title; do
  [ -z "$item_id" ] && continue
  gh api graphql -f query='
    mutation($pid: ID!, $iid: ID!, $fid: ID!, $oid: String!) {
      updateProjectV2ItemFieldValue(input: {
        projectId: $pid
        itemId:    $iid
        fieldId:   $fid
        value:     { singleSelectOptionId: $oid }
      }) { projectV2Item { id } }
    }' \
    -f pid="$PROJECT_ID" \
    -f iid="$item_id" \
    -f fid="$FIELD_ID" \
    -f oid="$OPTION_ID" > /dev/null 2>&1 \
    && echo "  ✅ $title" \
    || echo "  ⚠️  Falhou: $title"
  COUNT=$((COUNT + 1))
done <<< "$ITEMS"

echo ""
echo "============================================"
echo "  ✅ $COUNT issues → 📋 Backlog"
echo "============================================"
echo ""
echo "  https://github.com/users/$OWNER/projects/$PROJECT_NUMBER"
echo ""
