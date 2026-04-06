#!/usr/bin/env bash
# =============================================================================
# sprint-transition.sh — Fecha sprint atual e abre próxima
#
# Uso:
#   bash scripts/sprint-transition.sh <sprint-atual> <próxima-sprint> [msg]
#   bash scripts/sprint-transition.sh --setup-auth
#
# Exemplos:
#   bash scripts/sprint-transition.sh 5 6
#   bash scripts/sprint-transition.sh 5 6 "EP-040/044 concluidos"
#
# O que faz:
#   0. Sanidade: recupera index corrompido, remove ghost files (NTFS)
#   1. TypeScript check (tsc --noEmit) — aborta se houver erro
#   2. Commita alterações pendentes
#   3. Push sprint-<atual> → origin
#   4. Merge sprint-<atual> → develop (--no-ff), resolve conflitos conhecidos
#   5. Push develop → origin
#   6. Cria/usa branch sprint-<próxima>
#   7. Push sprint-<próxima> → origin
# =============================================================================

set -euo pipefail

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
CYAN='\033[0;36m'; BLUE='\033[0;34m'; BOLD='\033[1m'; NC='\033[0m'

log()    { echo -e "${CYAN}[sprint-transition]${NC} $*"; }
ok()     { echo -e "${GREEN}✔${NC} $*"; }
warn()   { echo -e "${YELLOW}⚠${NC}  $*"; }
fail()   { echo -e "${RED}✘ ERRO:${NC} $*"; exit 1; }
info()   { echo -e "${BLUE}ℹ${NC}  $*"; }
header() { echo -e "\n${BOLD}$*${NC}"; }

# ---------------------------------------------------------------------------
# Recupera index git corrompido — bug NTFS/Windows (bad signature 0x00000000)
# Seguro chamar a qualquer momento: não faz nada se o index estiver OK
# ---------------------------------------------------------------------------
recover_index() {
  if ! git status &>/dev/null 2>&1; then
    warn "Índice git corrompido — recuperando com read-tree HEAD..."
    rm -f ".git/index" 2>/dev/null || true
    git read-tree HEAD 2>/dev/null || true
    git status &>/dev/null || fail "Índice irrecuperável. Rode manualmente: git read-tree HEAD"
    ok "Índice recuperado"
  fi
}

# ---------------------------------------------------------------------------
# Remove ghost files do índice (rastreados pelo git mas inacessíveis no disco)
# Causa: bug NTFS/WSL — git add falha com ENOENT mesmo o arquivo "existindo"
# ---------------------------------------------------------------------------
remove_ghost_files() {
  local ghosts=0
  while IFS= read -r file; do
    [[ -z "$file" ]] && continue
    # Tenta abrir o arquivo de verdade — ghost files passam no exists() mas falham no open()
    local ok_read
    ok_read=$(python3 -c "
import sys
try:
    open(sys.argv[1], 'rb').read(1); print('ok')
except: print('ghost' if __import__('os').path.exists(sys.argv[1]) else 'missing')
" "$file" 2>/dev/null || echo "error")
    if [[ "$ok_read" == "ghost" ]]; then
      warn "Ghost file detectado e removido do índice: ${file}"
      git update-index --force-remove "$file" 2>/dev/null || true
      ghosts=$((ghosts + 1))
    fi
  done < <(git diff --name-only 2>/dev/null)
  if [[ "$ghosts" -gt 0 ]]; then
    git commit -m "fix: remove ${ghosts} ghost file(s) do índice git (NTFS)" 2>/dev/null || true
    ok "${ghosts} ghost file(s) removido(s)"
  fi
}

# ---------------------------------------------------------------------------
# Corrige ORIG_HEAD quando é um ghost file (bloqueia git merge)
# ---------------------------------------------------------------------------
fix_orig_head() {
  local orig=".git/ORIG_HEAD"
  # Só age se o arquivo existe mas não pode ser lido (ghost)
  if python3 -c "
import sys, os; p=sys.argv[1]
if os.path.exists(p):
    try: open(p).read(); sys.exit(0)
    except: sys.exit(1)
sys.exit(2)
" "$orig" 2>/dev/null; then
    return  # OK
  elif [[ $? -eq 1 ]]; then
    local h; h=$(git rev-parse HEAD 2>/dev/null)
    python3 -c "open('$orig','w').write('$h\n')" 2>/dev/null || true
    ok "ORIG_HEAD corrigido"
  fi
}

# ---------------------------------------------------------------------------
# Resolve conflitos conhecidos após git merge
# Atualmente: middleware.ts → proxy.ts (Next.js 16 rename)
# Padrão: adicione novos conflitos recorrentes aqui
# ---------------------------------------------------------------------------
resolve_known_conflicts() {
  local has_conflicts
  has_conflicts=$(git diff --name-only --diff-filter=U 2>/dev/null || echo "")

  if [[ -z "$has_conflicts" ]]; then
    # Verifica também via MERGE_HEAD
    [[ ! -f ".git/MERGE_HEAD" ]] && return 0
    has_conflicts=$(git status --short 2>/dev/null | grep "^[UA][UA]" | awk '{print $2}' || echo "")
    [[ -z "$has_conflicts" ]] && return 0
  fi

  warn "Conflitos detectados — aplicando resoluções conhecidas..."
  local resolved=0

  # Conflito 1: rename/delete middleware.ts → proxy.ts (Next.js 16)
  # sprint-branch: renomeou middleware.ts → proxy.ts
  # develop: deletou middleware.ts (ghost file cleanup)
  if git status 2>/dev/null | grep -q "proxy.ts"; then
    if [[ -f "src/proxy.ts" ]]; then
      git add src/proxy.ts
      ok "Conflito resolvido: src/proxy.ts aceito do sprint"
      resolved=$((resolved + 1))
    fi
  fi
  # Garante que middleware.ts não está pendente
  if git ls-files --deleted 2>/dev/null | grep -q "middleware.ts"; then
    git rm --cached src/middleware.ts 2>/dev/null || true
    resolved=$((resolved + 1))
  fi

  if [[ "$resolved" -gt 0 ]]; then
    git commit --no-edit 2>/dev/null || \
      git commit -m "merge: resolve conflitos conhecidos (proxy.ts/middleware.ts)"
    ok "Merge finalizado após resolução automática"
    return 0
  fi

  # Conflitos desconhecidos — para e pede intervenção manual
  echo ""
  echo -e "${RED}✘ Conflitos que precisam de resolução manual:${NC}"
  git status --short | grep "^[UA][UA]"
  echo ""
  echo -e "  Resolva os conflitos, rode ${CYAN}git add <arquivo>${NC} e ${CYAN}git commit --no-edit${NC}"
  echo -e "  Depois continue com os passos restantes do sprint-transition."
  fail "Merge interrompido por conflitos não resolvidos"
}

# ---------------------------------------------------------------------------
# Push seguro com instrução de fallback
# ---------------------------------------------------------------------------
safe_push() {
  local branch="$1" flags="${2:--u origin}"
  if git push $flags "$branch" 2>&1; then
    ok "Push ${branch} → origin"
  else
    echo -e "${RED}✘ Push falhou.${NC}"
    echo -e "  Configure autenticação: ${CYAN}bash scripts/sprint-transition.sh --setup-auth${NC}"
    read -r -p "  Continuar sem push de ${branch}? (s/N) " skip
    [[ "$skip" =~ ^[sS]$ ]] || fail "Cancelado"
    warn "Push de ${branch} ignorado — faça manualmente"
  fi
}

# ===========================================================================
# --setup-auth: configura SSH ou PAT para GitHub com 2FA
# ===========================================================================
setup_auth() {
  header "━━━ AUTENTICAÇÃO GITHUB ━━━"
  echo -e "  GitHub com 2FA exige SSH ou PAT — senha de conta não funciona.\n"
  echo -e "    ${BOLD}1)${NC} SSH (recomendado — sem expiração)"
  echo -e "    ${BOLD}2)${NC} PAT — Personal Access Token"
  read -r -p "  Método [1/2]: " method
  case "$method" in
    1)
      KEY="$HOME/.ssh/id_ed25519"
      if [[ ! -f "$KEY" ]]; then
        local em; em=$(git config user.email)
        ssh-keygen -t ed25519 -C "$em" -f "$KEY" -N ""
      fi
      eval "$(ssh-agent -s)" &>/dev/null
      ssh-add "$KEY" 2>/dev/null
      echo -e "\n${BOLD}Adicione no GitHub → Settings → SSH keys → New SSH key:${NC}"
      cat "${KEY}.pub"
      read -r -p "  Já adicionou? (s) " c; [[ "$c" =~ ^[sS]$ ]] || exit 0
      local rurl; rurl=$(git remote get-url origin)
      [[ "$rurl" == https://* ]] && \
        git remote set-url origin "git@github.com:${rurl#https://github.com/}"
      ok "SSH configurado!"
      ;;
    2)
      read -r -p "  Cole seu PAT (não aparece): " -s PAT; echo
      [[ -z "$PAT" ]] && fail "Token vazio"
      local rurl; rurl=$(git remote get-url origin)
      local rpath; rpath=$(echo "$rurl" | sed 's|https://github.com/||;s|git@github.com:||')
      local guser; guser=$(echo "$rpath" | cut -d/ -f1)
      git remote set-url origin "https://${guser}:${PAT}@github.com/${rpath}"
      git ls-remote --exit-code origin &>/dev/null || fail "PAT inválido"
      ok "PAT configurado!"
      ;;
    *) fail "Opção inválida" ;;
  esac
}

# ===========================================================================
# MAIN
# ===========================================================================

if [[ "${1:-}" == "--setup-auth" ]]; then
  [[ -d ".git" ]] || fail "Execute na raiz do projeto"
  setup_auth; exit 0
fi

CURRENT_SPRINT="${1:-}"; NEXT_SPRINT="${2:-}"; COMMIT_MSG="${3:-}"

if [[ -z "$CURRENT_SPRINT" || -z "$NEXT_SPRINT" ]]; then
  echo -e "Uso: bash scripts/sprint-transition.sh <atual> <proxima> [msg]"
  echo -e "Ex:  bash scripts/sprint-transition.sh 5 6"
  exit 1
fi

CURRENT_BRANCH="sprint-${CURRENT_SPRINT}"
NEXT_BRANCH="sprint-${NEXT_SPRINT}"
FINAL_MSG="${COMMIT_MSG:-"feat(sprint-${CURRENT_SPRINT}): fechamento"}"

# ---- Pré-checks ----
header "━━━ PRÉ-CHECKS ━━━"
command -v git     &>/dev/null || fail "git não encontrado"
command -v node    &>/dev/null || fail "node não encontrado"
command -v python3 &>/dev/null || fail "python3 não encontrado"
[[ -d ".git" ]] || fail "Execute na raiz do projeto"

recover_index

ACTUAL=$(git rev-parse --abbrev-ref HEAD)
if [[ "$ACTUAL" != "$CURRENT_BRANCH" ]]; then
  warn "Branch atual: '${ACTUAL}'. Esperada: '${CURRENT_BRANCH}'"
  read -r -p "  Mudar para ${CURRENT_BRANCH}? (s/N) " c
  [[ "$c" =~ ^[sS]$ ]] || fail "Cancelado"
  git checkout "$CURRENT_BRANCH" || fail "Não foi possível mudar para ${CURRENT_BRANCH}"
  recover_index
fi
ok "Branch: ${CURRENT_BRANCH}"

info "Verificando remote..."
if ! git ls-remote --exit-code origin &>/dev/null 2>&1; then
  warn "Remote inacessível — rode: bash scripts/sprint-transition.sh --setup-auth"
  read -r -p "  Continuar em modo local? (s/N) " c
  [[ "$c" =~ ^[sS]$ ]] || exit 1
  LOCAL_ONLY=true
else
  LOCAL_ONLY=false; ok "Remote OK"
fi

# ---- Etapa 0: Sanidade ----
header "━━━ ETAPA 0: Sanidade do repositório ━━━"
remove_ghost_files
fix_orig_head
ok "Repositório saneado"

# ---- Etapa 1: TypeScript ----
header "━━━ ETAPA 1: TypeScript check ━━━"
info "Rodando npx tsc --noEmit..."
npx tsc --noEmit 2>&1 || fail "TypeScript com erros! Corrija antes de fechar a sprint."
ok "TypeScript: 0 erros ✅"

# ---- Etapa 2: Commit ----
header "━━━ ETAPA 2: Commit pendências ━━━"
CHANGES=$(( $(git diff --cached --name-only | wc -l) \
           + $(git diff --name-only | wc -l) \
           + $(git ls-files --others --exclude-standard | wc -l) ))
if [[ "$CHANGES" -gt 0 ]]; then
  log "Encontradas alterações: commitando..."
  git add -A
  git commit -m "${FINAL_MSG}"
  ok "Commit: '${FINAL_MSG}'"
else
  ok "Working tree limpa — nada para commitar"
fi

# ---- Etapa 3: Push sprint ----
header "━━━ ETAPA 3: Push ${CURRENT_BRANCH} ━━━"
[[ "$LOCAL_ONLY" == "false" ]] && safe_push "${CURRENT_BRANCH}" "-u origin" \
  || warn "Local-only: push ignorado"

# ---- Etapa 4: Merge → develop ----
header "━━━ ETAPA 4: Merge ${CURRENT_BRANCH} → develop ━━━"
git checkout develop
recover_index
fix_orig_head
[[ "$LOCAL_ONLY" == "false" ]] && git pull origin develop 2>/dev/null || true
if git merge --no-ff "${CURRENT_BRANCH}" -m "merge: ${CURRENT_BRANCH} → develop" 2>&1; then
  ok "Merge concluído sem conflitos"
else
  resolve_known_conflicts
fi

# ---- Etapa 5: Push develop ----
header "━━━ ETAPA 5: Push develop ━━━"
[[ "$LOCAL_ONLY" == "false" ]] && safe_push "develop" "origin" \
  || warn "Local-only: push ignorado"

# ---- Etapa 6: Próxima sprint ----
header "━━━ ETAPA 6: Branch ${NEXT_BRANCH} ━━━"
if git show-ref --verify --quiet "refs/heads/${NEXT_BRANCH}"; then
  warn "Branch '${NEXT_BRANCH}' já existe — checkout"
  git checkout "${NEXT_BRANCH}"
else
  git checkout -b "${NEXT_BRANCH}"
  ok "Branch '${NEXT_BRANCH}' criada a partir de develop"
fi

# ---- Etapa 7: Push próxima sprint ----
header "━━━ ETAPA 7: Push ${NEXT_BRANCH} ━━━"
[[ "$LOCAL_ONLY" == "false" ]] && safe_push "${NEXT_BRANCH}" "-u origin" \
  || warn "Local-only: push ignorado"

# ---- Resumo ----
header "━━━ ✅ RESUMO ━━━"
echo ""
echo -e "  ${GREEN}✔${NC} TypeScript: 0 erros"
echo -e "  ${GREEN}✔${NC} Sprint ${CURRENT_SPRINT} fechada e commitada"
echo -e "  ${GREEN}✔${NC} ${CURRENT_BRANCH} mergeado em develop (--no-ff)"
echo -e "  ${GREEN}✔${NC} Branch ${NEXT_BRANCH} pronta"
[[ "$LOCAL_ONLY" == "true" ]] && \
  echo -e "\n  ${YELLOW}⚠${NC}  Pushes pendentes — rode --setup-auth e repita"
echo ""
log "Sprint ${NEXT_SPRINT} aberta! Bom trabalho 🚀"
echo ""
