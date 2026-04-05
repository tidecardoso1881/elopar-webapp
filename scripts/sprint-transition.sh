#!/usr/bin/env bash
# =============================================================================
# sprint-transition.sh — Fecha sprint atual e abre próxima
#
# Uso:
#   bash scripts/sprint-transition.sh <sprint-atual> <próxima-sprint> [mensagem-commit]
#
# Exemplos:
#   bash scripts/sprint-transition.sh 3 4
#   bash scripts/sprint-transition.sh 3 4 "EP-012/017/018/019 concluídos"
#
# O que faz:
#   1. Valida que está na branch sprint-<atual>
#   2. Commita alterações pendentes (se houver)
#   3. Push sprint-<atual> → origin
#   4. Merge sprint-<atual> → develop
#   5. Push develop → origin
#   6. Cria branch sprint-<próxima> a partir do develop
#   7. Push sprint-<próxima> → origin
#   8. Exibe resumo
# =============================================================================

set -euo pipefail

# ---------- Cores ----------
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
CYAN='\033[0;36m'; BOLD='\033[1m'; NC='\033[0m'

log()    { echo -e "${CYAN}[sprint-transition]${NC} $*"; }
ok()     { echo -e "${GREEN}✔${NC} $*"; }
warn()   { echo -e "${YELLOW}⚠${NC}  $*"; }
fail()   { echo -e "${RED}✘ ERRO:${NC} $*"; exit 1; }
header() { echo -e "\n${BOLD}$*${NC}"; }

# ---------- Argumentos ----------
CURRENT_SPRINT="${1:-}"
NEXT_SPRINT="${2:-}"
COMMIT_MSG="${3:-}"

if [[ -z "$CURRENT_SPRINT" || -z "$NEXT_SPRINT" ]]; then
  fail "Uso: bash scripts/sprint-transition.sh <sprint-atual> <próxima-sprint> [mensagem]"
fi

CURRENT_BRANCH="sprint-${CURRENT_SPRINT}"
NEXT_BRANCH="sprint-${NEXT_SPRINT}"
DEFAULT_MSG="feat(sprint-${CURRENT_SPRINT}): fechamento — merge para develop"
FINAL_MSG="${COMMIT_MSG:-$DEFAULT_MSG}"

# ---------- Pré-checks ----------
header "━━━ PRÉ-CHECKS ━━━"

# Verifica se git está disponível
command -v git &>/dev/null || fail "git não encontrado"

# Verifica se está no diretório correto
[[ -d ".git" ]] || fail "Execute na raiz do projeto (diretório com .git)"

# Verifica branch atual
ACTUAL_BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "UNKNOWN")

if [[ "$ACTUAL_BRANCH" != "$CURRENT_BRANCH" ]]; then
  warn "Branch atual: '${ACTUAL_BRANCH}'. Esperada: '${CURRENT_BRANCH}'"
  read -r -p "  Mudar para ${CURRENT_BRANCH}? (s/N) " confirm
  [[ "$confirm" =~ ^[sS]$ ]] || fail "Operação cancelada"
  git checkout "$CURRENT_BRANCH" || fail "Não foi possível mudar para ${CURRENT_BRANCH}"
fi

ok "Branch: ${CURRENT_BRANCH}"

# Verifica conexão com remote
if ! git ls-remote --exit-code origin &>/dev/null; then
  warn "Sem acesso ao remote — rodando em modo local (sem push)"
  LOCAL_ONLY=true
else
  LOCAL_ONLY=false
  ok "Remote acessível"
fi

# ---------- ETAPA 1: Commit pendências ----------
header "━━━ ETAPA 1: Commit pendências ━━━"

STAGED=$(git diff --cached --name-only 2>/dev/null | wc -l)
UNSTAGED=$(git diff --name-only 2>/dev/null | wc -l)
UNTRACKED=$(git ls-files --others --exclude-standard 2>/dev/null | wc -l)

TOTAL_CHANGES=$((STAGED + UNSTAGED + UNTRACKED))

if [[ "$TOTAL_CHANGES" -gt 0 ]]; then
  log "Encontradas alterações: ${STAGED} staged, ${UNSTAGED} unstaged, ${UNTRACKED} untracked"
  git add -A
  git commit -m "${FINAL_MSG}"
  ok "Commit realizado: '${FINAL_MSG}'"
else
  ok "Nada para commitar — working tree limpa"
fi

# ---------- ETAPA 2: Push sprint atual ----------
header "━━━ ETAPA 2: Push ${CURRENT_BRANCH} ━━━"

if [[ "$LOCAL_ONLY" == "false" ]]; then
  git push -u origin "${CURRENT_BRANCH}"
  ok "Push ${CURRENT_BRANCH} → origin"
else
  warn "Modo local — push ignorado"
fi

# ---------- ETAPA 3: Merge → develop ----------
header "━━━ ETAPA 3: Merge ${CURRENT_BRANCH} → develop ━━━"

git checkout develop
git pull origin develop 2>/dev/null || warn "Pull develop ignorado (sem remote)"
git merge --no-ff "${CURRENT_BRANCH}" -m "merge: ${CURRENT_BRANCH} → develop"
ok "Merge concluído"

# ---------- ETAPA 4: Push develop ----------
header "━━━ ETAPA 4: Push develop ━━━"

if [[ "$LOCAL_ONLY" == "false" ]]; then
  git push origin develop
  ok "Push develop → origin"
else
  warn "Modo local — push ignorado"
fi

# ---------- ETAPA 5: Criar próxima sprint ----------
header "━━━ ETAPA 5: Criar ${NEXT_BRANCH} ━━━"

if git show-ref --verify --quiet "refs/heads/${NEXT_BRANCH}"; then
  warn "Branch '${NEXT_BRANCH}' já existe — apenas realizando checkout"
  git checkout "${NEXT_BRANCH}"
else
  git checkout -b "${NEXT_BRANCH}"
  ok "Branch '${NEXT_BRANCH}' criada a partir do develop"
fi

# ---------- ETAPA 6: Push nova branch ----------
header "━━━ ETAPA 6: Push ${NEXT_BRANCH} ━━━"

if [[ "$LOCAL_ONLY" == "false" ]]; then
  git push -u origin "${NEXT_BRANCH}"
  ok "Push ${NEXT_BRANCH} → origin"
else
  warn "Modo local — push ignorado"
fi

# ---------- Resumo ----------
header "━━━ RESUMO ━━━"
echo ""
echo -e "  ${GREEN}✔${NC} Sprint ${CURRENT_SPRINT} fechada"
echo -e "  ${GREEN}✔${NC} ${CURRENT_BRANCH} → develop (merge no-ff)"
echo -e "  ${GREEN}✔${NC} Branch ${NEXT_BRANCH} pronta"
echo ""
echo -e "  ${CYAN}Branch ativa:${NC} ${NEXT_BRANCH}"
echo ""
log "Pronto! Pode começar a Sprint ${NEXT_SPRINT} 🚀"
echo ""
