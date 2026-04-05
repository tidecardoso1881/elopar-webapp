#!/usr/bin/env bash
# =============================================================================
# sprint-transition.sh — Fecha sprint atual e abre próxima
#
# Uso:
#   bash scripts/sprint-transition.sh <sprint-atual> <próxima-sprint> [mensagem-commit]
#   bash scripts/sprint-transition.sh --setup-auth   (configura SSH ou PAT)
#
# Exemplos:
#   bash scripts/sprint-transition.sh 3 4
#   bash scripts/sprint-transition.sh 4 5 "EP-025/026/027 concluídos"
#   bash scripts/sprint-transition.sh --setup-auth
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
CYAN='\033[0;36m'; BLUE='\033[0;34m'; BOLD='\033[1m'; NC='\033[0m'

log()    { echo -e "${CYAN}[sprint-transition]${NC} $*"; }
ok()     { echo -e "${GREEN}✔${NC} $*"; }
warn()   { echo -e "${YELLOW}⚠${NC}  $*"; }
fail()   { echo -e "${RED}✘ ERRO:${NC} $*"; exit 1; }
info()   { echo -e "${BLUE}ℹ${NC}  $*"; }
header() { echo -e "\n${BOLD}$*${NC}"; }

# =============================================================================
# MODO: --setup-auth
# Configura SSH ou PAT para GitHub com 2FA
# =============================================================================
setup_auth() {
  header "━━━ CONFIGURAÇÃO DE AUTENTICAÇÃO GITHUB ━━━"
  echo ""
  echo -e "  GitHub exige SSH ou Personal Access Token (PAT) quando 2FA está ativo."
  echo -e "  Senha de conta ${RED}NÃO funciona${NC} para operações git.\n"
  echo -e "  Escolha o método:"
  echo -e "    ${BOLD}1)${NC} SSH (recomendado — funciona para sempre, sem expiração)"
  echo -e "    ${BOLD}2)${NC} PAT — Personal Access Token (mais simples de configurar agora)"
  echo ""
  read -r -p "  Método [1/2]: " method

  case "$method" in
    1) setup_ssh ;;
    2) setup_pat ;;
    *) fail "Opção inválida" ;;
  esac
}

setup_ssh() {
  header "━━━ CONFIGURAÇÃO SSH ━━━"
  echo ""

  KEY_PATH="$HOME/.ssh/id_ed25519"
  GIT_EMAIL=$(git config --global user.email 2>/dev/null || echo "")

  # 1. Verifica se já tem chave
  if [[ -f "$KEY_PATH" ]]; then
    ok "Chave SSH encontrada: ${KEY_PATH}"
  else
    info "Gerando nova chave SSH Ed25519..."
    [[ -z "$GIT_EMAIL" ]] && read -r -p "  Seu email do GitHub: " GIT_EMAIL
    ssh-keygen -t ed25519 -C "$GIT_EMAIL" -f "$KEY_PATH" -N ""
    ok "Chave gerada em ${KEY_PATH}"
  fi

  # 2. Inicia ssh-agent e adiciona chave
  eval "$(ssh-agent -s)" &>/dev/null
  ssh-add "$KEY_PATH" 2>/dev/null
  ok "Chave adicionada ao ssh-agent"

  # 3. Exibe chave pública
  echo ""
  echo -e "${BOLD}Copie a chave pública abaixo e adicione no GitHub:${NC}"
  echo -e "${YELLOW}→ GitHub.com → Settings → SSH and GPG keys → New SSH key${NC}"
  echo ""
  echo "─────────────────────────────────────────────────"
  cat "${KEY_PATH}.pub"
  echo "─────────────────────────────────────────────────"
  echo ""
  read -r -p "  Já colou a chave no GitHub? (s para continuar) " confirm
  [[ "$confirm" =~ ^[sS]$ ]] || { warn "Configure a chave no GitHub e rode novamente"; exit 0; }

  # 4. Testa conexão
  info "Testando conexão SSH com GitHub..."
  if ssh -T git@github.com 2>&1 | grep -q "successfully authenticated"; then
    ok "SSH funcionando!"
  else
    warn "Teste SSH pode ter falhado. Verifique manualmente: ssh -T git@github.com"
  fi

  # 5. Atualiza remote para SSH
  REMOTE_URL=$(git remote get-url origin 2>/dev/null || echo "")
  if [[ "$REMOTE_URL" == https://* ]]; then
    REPO_PATH=$(echo "$REMOTE_URL" | sed 's|https://github.com/||')
    SSH_URL="git@github.com:${REPO_PATH}"
    git remote set-url origin "$SSH_URL"
    ok "Remote atualizado: HTTPS → SSH"
    info "Nova URL: ${SSH_URL}"
  else
    ok "Remote já usa SSH: ${REMOTE_URL}"
  fi

  echo ""
  ok "SSH configurado! Agora rode o sprint-transition normalmente."
}

setup_pat() {
  header "━━━ CONFIGURAÇÃO PAT (Personal Access Token) ━━━"
  echo ""
  echo -e "${BOLD}Passos para criar o PAT:${NC}"
  echo -e "  1. Acesse: ${CYAN}https://github.com/settings/tokens/new${NC}"
  echo -e "  2. Em ${BOLD}Note${NC}: coloque 'elopar-webapp git push'"
  echo -e "  3. Em ${BOLD}Expiration${NC}: escolha 90 dias ou 'No expiration'"
  echo -e "  4. Em ${BOLD}Scopes${NC}: marque apenas ${BOLD}repo${NC} (acesso completo)"
  echo -e "  5. Clique ${BOLD}Generate token${NC} e ${RED}copie o token agora${NC} (não aparece de novo)"
  echo ""
  read -r -p "  Já tem o token? Cole aqui (não aparece na tela): " -s PAT
  echo ""

  [[ -z "$PAT" ]] && fail "Token não pode ser vazio"

  # Extrai usuário e repo da URL atual
  REMOTE_URL=$(git remote get-url origin 2>/dev/null || fail "Remote 'origin' não configurado")
  REPO_PATH=$(echo "$REMOTE_URL" | sed 's|https://github.com/||' | sed 's|git@github.com:||')
  GITHUB_USER=$(echo "$REPO_PATH" | cut -d'/' -f1)

  # Monta nova URL com PAT embutido
  NEW_URL="https://${GITHUB_USER}:${PAT}@github.com/${REPO_PATH}"
  git remote set-url origin "$NEW_URL"

  # Configura git credential store para não pedir senha novamente
  git config credential.helper store 2>/dev/null || true

  # Testa a autenticação
  info "Testando autenticação com PAT..."
  if git ls-remote --exit-code origin &>/dev/null; then
    ok "Autenticação com PAT funcionando!"
  else
    fail "PAT inválido ou sem permissão. Verifique os passos e tente novamente."
  fi

  echo ""
  warn "O PAT está armazenado na URL do remote. Para ver: git remote get-url origin"
  warn "Para maior segurança no futuro, prefira SSH."
  echo ""
  ok "PAT configurado! Agora rode o sprint-transition normalmente."
}

# =============================================================================
# MODO PRINCIPAL: transição de sprint
# =============================================================================

# Verifica modo --setup-auth
if [[ "${1:-}" == "--setup-auth" ]]; then
  [[ -d ".git" ]] || fail "Execute na raiz do projeto (diretório com .git)"
  setup_auth
  exit 0
fi

# ---------- Argumentos ----------
CURRENT_SPRINT="${1:-}"
NEXT_SPRINT="${2:-}"
COMMIT_MSG="${3:-}"

if [[ -z "$CURRENT_SPRINT" || -z "$NEXT_SPRINT" ]]; then
  echo -e "${BOLD}Uso:${NC}"
  echo -e "  bash scripts/sprint-transition.sh <sprint-atual> <próxima-sprint> [mensagem]"
  echo -e "  bash scripts/sprint-transition.sh --setup-auth"
  echo ""
  echo -e "${BOLD}Exemplos:${NC}"
  echo -e "  bash scripts/sprint-transition.sh 4 5"
  echo -e "  bash scripts/sprint-transition.sh 4 5 \"EP-025/026/027 concluídos\""
  echo -e "  bash scripts/sprint-transition.sh --setup-auth"
  exit 1
fi

CURRENT_BRANCH="sprint-${CURRENT_SPRINT}"
NEXT_BRANCH="sprint-${NEXT_SPRINT}"
DEFAULT_MSG="feat(sprint-${CURRENT_SPRINT}): fechamento — merge para develop"
FINAL_MSG="${COMMIT_MSG:-$DEFAULT_MSG}"

# ---------- Pré-checks ----------
header "━━━ PRÉ-CHECKS ━━━"

command -v git &>/dev/null || fail "git não encontrado"
[[ -d ".git" ]] || fail "Execute na raiz do projeto (diretório com .git)"

ACTUAL_BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "UNKNOWN")

if [[ "$ACTUAL_BRANCH" != "$CURRENT_BRANCH" ]]; then
  warn "Branch atual: '${ACTUAL_BRANCH}'. Esperada: '${CURRENT_BRANCH}'"
  read -r -p "  Mudar para ${CURRENT_BRANCH}? (s/N) " confirm
  [[ "$confirm" =~ ^[sS]$ ]] || fail "Operação cancelada"
  git checkout "$CURRENT_BRANCH" || fail "Não foi possível mudar para ${CURRENT_BRANCH}"
fi

ok "Branch: ${CURRENT_BRANCH}"

# Verifica autenticação com remote
info "Verificando acesso ao remote..."
if ! git ls-remote --exit-code origin &>/dev/null 2>&1; then
  echo ""
  warn "Sem acesso ao remote GitHub."
  echo -e "  Se você tem ${BOLD}2FA ativo${NC}, senha não funciona — precisa de SSH ou PAT."
  echo -e "  Execute: ${CYAN}bash scripts/sprint-transition.sh --setup-auth${NC}"
  echo ""
  read -r -p "  Continuar em modo local (sem push)? (s/N) " confirm
  [[ "$confirm" =~ ^[sS]$ ]] || exit 1
  LOCAL_ONLY=true
else
  LOCAL_ONLY=false
  ok "Remote acessível"
fi

# ---------- ETAPA 1: Commit pendências ----------
header "━━━ ETAPA 1: Commit pendências ━━━"

STAGED=$(git diff --cached --name-only 2>/dev/null | wc -l | tr -d ' ')
UNSTAGED=$(git diff --name-only 2>/dev/null | wc -l | tr -d ' ')
UNTRACKED=$(git ls-files --others --exclude-standard 2>/dev/null | wc -l | tr -d ' ')
TOTAL_CHANGES=$((STAGED + UNSTAGED + UNTRACKED))

if [[ "$TOTAL_CHANGES" -gt 0 ]]; then
  log "Encontradas alterações: ${STAGED} staged, ${UNSTAGED} unstaged, ${UNTRACKED} untracked"
  git add -A
  git commit -m "${FINAL_MSG}"
  ok "Commit realizado: '${FINAL_MSG}'"
else
  ok "Nada para commitar — working tree limpa"
fi

# ---------- Função auxiliar de push com tratamento de erro ----------
safe_push() {
  local branch="$1"
  local flags="${2:--u origin}"
  if git push $flags "$branch" 2>&1; then
    ok "Push ${branch} → origin"
  else
    echo ""
    echo -e "${RED}✘ Push falhou.${NC} Possíveis causas:"
    echo -e "  • ${BOLD}2FA ativo${NC}: senha não funciona, use SSH ou PAT"
    echo -e "  • ${BOLD}Sem permissão${NC}: verifique acesso ao repositório"
    echo -e ""
    echo -e "  ${CYAN}Solução:${NC} bash scripts/sprint-transition.sh --setup-auth"
    echo ""
    read -r -p "  Continuar sem push do ${branch}? (s/N) " skip
    [[ "$skip" =~ ^[sS]$ ]] || fail "Operação cancelada pelo usuário"
    warn "Push de ${branch} ignorado — faça manualmente depois"
  fi
}

# ---------- ETAPA 2: Push sprint atual ----------
header "━━━ ETAPA 2: Push ${CURRENT_BRANCH} ━━━"
[[ "$LOCAL_ONLY" == "false" ]] && safe_push "${CURRENT_BRANCH}" "-u origin" || warn "Modo local — push ignorado"

# ---------- ETAPA 3: Merge → develop ----------
header "━━━ ETAPA 3: Merge ${CURRENT_BRANCH} → develop ━━━"

git checkout develop
if [[ "$LOCAL_ONLY" == "false" ]]; then
  git pull origin develop 2>/dev/null || warn "Pull develop ignorado"
fi
git merge --no-ff "${CURRENT_BRANCH}" -m "merge: ${CURRENT_BRANCH} → develop"
ok "Merge concluído"

# ---------- ETAPA 4: Push develop ----------
header "━━━ ETAPA 4: Push develop ━━━"
[[ "$LOCAL_ONLY" == "false" ]] && safe_push "develop" "origin" || warn "Modo local — push ignorado"

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
[[ "$LOCAL_ONLY" == "false" ]] && safe_push "${NEXT_BRANCH}" "-u origin" || warn "Modo local — push ignorado"

# ---------- Resumo ----------
header "━━━ RESUMO ━━━"
echo ""
echo -e "  ${GREEN}✔${NC} Sprint ${CURRENT_SPRINT} fechada"
echo -e "  ${GREEN}✔${NC} ${CURRENT_BRANCH} → develop (merge no-ff)"
echo -e "  ${GREEN}✔${NC} Branch ${NEXT_BRANCH} pronta"
echo ""
echo -e "  ${CYAN}Branch ativa:${NC} ${NEXT_BRANCH}"
echo ""
if [[ "$LOCAL_ONLY" == "true" ]]; then
  warn "Pushes pendentes — configure auth e rode:"
  echo -e "  ${CYAN}bash scripts/sprint-transition.sh --setup-auth${NC}"
fi
log "Pronto! Pode começar a Sprint ${NEXT_SPRINT} 🚀"
echo ""
