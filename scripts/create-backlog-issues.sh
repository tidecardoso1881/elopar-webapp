#!/usr/bin/env bash
# =============================================================================
# create-backlog-issues.sh
# Cria as issues do backlog catalogado em 06/04/2026 e adiciona ao GitHub Project
#
# COMO RODAR (Windows Git Bash):
#   bash scripts/create-backlog-issues.sh
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
echo "  Elopar — Criação de Issues do Backlog"
echo "============================================"
echo ""

# Verificar autenticação
echo "▶ Verificando autenticação..."
gh auth status || { echo "❌ Rode 'gh auth login' primeiro."; exit 1; }
echo ""

# ─────────────────────────────────────────
# PASSO 1: Criar labels se não existirem
# ─────────────────────────────────────────
echo "▶ Criando labels..."

create_label_if_missing() {
  local name="$1" color="$2" desc="$3"
  gh label list --repo "$OWNER/$REPO" --json name --jq '.[].name' \
    | grep -qx "$name" \
    && echo "  ↳ Label '$name' já existe" \
    || gh label create "$name" --color "$color" --description "$desc" --repo "$OWNER/$REPO" \
    && echo "  ✅ Label '$name' criada"
}

create_label_if_missing "must-have"   "d73a4a" "Must Have — implementação obrigatória"
create_label_if_missing "should-have" "e4a400" "Should Have — alta prioridade"
create_label_if_missing "could-have"  "0075ca" "Could Have — desejável"
create_label_if_missing "won't-have"  "cccccc" "Won't Have — fora do escopo atual"
create_label_if_missing "bug"         "ee0701" "Bug reportado"
create_label_if_missing "feature"     "a2eeef" "Nova funcionalidade"
create_label_if_missing "ux"          "bfd4f2" "Melhoria de UX/UI"
create_label_if_missing "infra"       "fef2c0" "Infraestrutura e DevOps"
create_label_if_missing "security"    "b60205" "Segurança e autenticação"
create_label_if_missing "data"        "c5def5" "Dados e banco de dados"

echo ""

# ─────────────────────────────────────────
# PASSO 2: Encontrar (ou criar) o projeto
# ─────────────────────────────────────────
echo "▶ Buscando projeto '$PROJECT_TITLE'..."

PROJECT_NUMBER=$(gh project list --owner "$OWNER" --format json \
  --jq ".projects[] | select(.title == \"$PROJECT_TITLE\") | .number" 2>/dev/null | head -1)

if [ -z "$PROJECT_NUMBER" ]; then
  echo "  Projeto não encontrado. Criando..."
  PROJECT_NUMBER=$(gh project create \
    --owner "$OWNER" \
    --title "$PROJECT_TITLE" \
    --format json \
    --jq '.number' 2>/dev/null)
  echo "  ✅ Projeto criado: #$PROJECT_NUMBER"
else
  echo "  ✅ Projeto encontrado: #$PROJECT_NUMBER"
fi

echo ""

# ─────────────────────────────────────────
# PASSO 3: Criar issues e adicionar ao projeto
# ─────────────────────────────────────────
echo "▶ Criando issues..."

create_issue_and_add() {
  local title="$1"
  local body="$2"
  local labels="$3"

  # Criar a issue
  local issue_url
  issue_url=$(gh issue create \
    --repo "$OWNER/$REPO" \
    --title "$title" \
    --body "$body" \
    --label "$labels" \
    2>/dev/null)

  # Adicionar ao projeto
  gh project item-add "$PROJECT_NUMBER" \
    --owner "$OWNER" \
    --url "$issue_url" \
    > /dev/null 2>&1

  echo "  ✅ $title"
  echo "     → $issue_url"
}

echo ""
echo "  🔴 MUST HAVE"
echo "  ─────────────"

create_issue_and_add \
  "[EP-NEW-001] 🔑 Esqueci Minha Senha / Primeiro Acesso" \
  "## Descrição
Fluxo de recuperação de senha via token por e-mail e onboarding de primeiro acesso.

## Cenário Atual
A autenticação de e-mail e senha está funcionando, mas não existe fluxo para recuperar acesso.

## Cenário Proposto

### Esqueci Minha Senha
- Tela onde o usuário informa o e-mail
- Token é gerado e enviado por e-mail
- Usuário informa o token no sistema e pode trocar a senha

### Primeiro Acesso / Onboarding
- Cadastro de senha inicial na primeira entrada
- Somente administradores podem cadastrar novos usuários
- Integrar com a Área de Usuário (EP-NEW-005)

## Critérios de Aceite
- [ ] Usuário consegue solicitar reset de senha pelo e-mail
- [ ] Token expira após uso ou após X minutos
- [ ] Primeiro acesso exige criação de senha
- [ ] Fluxo funciona em produção (Vercel + Supabase Auth)

## MoSCoW
**Must Have** — Sem isso usuários ficam travados sem suporte manual.

## Fonte
Backlog_Melhorias_0604_não feitas.docx + Sugestoes_PM_2026_04_06.docx (PM-002)" \
  "must-have,feature,security"

create_issue_and_add \
  "[EP-NEW-002] 🗄️ Higienização da Base de Dados" \
  "## Descrição
Eliminar registros duplicados na base de profissionais.

## Cenário Atual
Existem nomes duplicados na base. O responsável precisa editar manualmente após remoção.

## Cenário Proposto
- Identificar duplicatas por nome e/ou CPF
- Interface para admin revisar e confirmar a remoção
- Manter somente 1 registro por profissional
- Log de operações realizadas
- (Evolução futura) job agendado para detecção contínua

## Critérios de Aceite
- [ ] Admin consegue visualizar lista de possíveis duplicatas
- [ ] Admin confirma qual registro manter
- [ ] Registro removido vai para log auditável
- [ ] Operação não remove dados sem confirmação explícita

## MoSCoW
**Must Have** — Previne corrupção silenciosa dos dados.

## Fonte
Backlog_Melhorias_0604_não feitas.docx + Sugestoes_PM_2026_04_06.docx (PM-003)" \
  "must-have,feature,data"

create_issue_and_add \
  "[EP-NEW-003] 🔒 Dashboard de Saúde dos Testes" \
  "## Descrição
Painel na área de usuário com indicadores de qualidade dos testes do sistema.

## Cenário Proposto
- % de cobertura unitária
- Status dos testes de integração
- Data e resultado do último E2E
- Indicadores visuais: verde / amarelo / vermelho por camada
- Histórico em gráfico de linha semanal

## Critérios de Aceite
- [ ] Painel visível para admins na área de usuário
- [ ] Indicadores atualizados a cada deploy
- [ ] Histórico das últimas 4 semanas disponível

## MoSCoW
**Must Have** — Suporte à qualidade contínua do produto.

## Fonte
Sugestoes_PM_2026_04_06.docx (PM-001)" \
  "must-have,feature"

create_issue_and_add \
  "[EP-NEW-004] ⚠️ Alertas de Renovação de Contrato" \
  "## Descrição
Notificações para contratos vencendo em 30, 60 e 90 dias.

## Cenário Proposto
- Notificações in-app ao acessar o sistema
- Notificações por e-mail (configurável)
- Badge visual na listagem de profissionais
- Centro de notificações com histórico de alertas

## Critérios de Aceite
- [ ] Notificação in-app para contratos vencendo em 30, 60, 90 dias
- [ ] Badge numérico visível na listagem
- [ ] E-mail enviado automaticamente (pelo menos para 30 dias)
- [ ] Usuário pode marcar alerta como 'visto'

## MoSCoW
**Must Have** — Evita perda de prazo por falta de visibilidade.

## Fonte
Sugestoes_PM_2026_04_06.docx (PM-004)" \
  "must-have,feature"

echo ""
echo "  🟠 SHOULD HAVE"
echo "  ───────────────"

create_issue_and_add \
  "[EP-NEW-005] 🎨 Área de Usuário Unificada" \
  "## Descrição
Consolidar informações duplicadas em um único dropdown no canto superior direito.

## Cenário Atual
Existem informações repetidas na área superior direita e na área inferior esquerda, gerando confusão cognitiva.

## Cenário Proposto
- Dropdown único no canto superior direito
- Submenus: Dados do Usuário, Trocar Foto, Gerenciar Usuários
- Remover a área duplicada do menu inferior

## Critérios de Aceite
- [ ] Apenas um ponto de acesso às informações do usuário
- [ ] Foto do usuário visível no avatar do dropdown
- [ ] Admin consegue gerenciar usuários pelo submenu
- [ ] Layout responsivo mantido

## MoSCoW
**Should Have** — Reduz confusão cognitiva, melhora UX.

## Fonte
Backlog_Melhorias_0604_não feitas.docx + Sugestoes_PM_2026_04_06.docx (PM-005)" \
  "should-have,feature,ux"

create_issue_and_add \
  "[EP-NEW-006] 📊 Exportação de Dados CSV / Excel / PDF" \
  "## Descrição
Botão de exportação na listagem de profissionais com filtros aplicados.

## Cenário Proposto
- Formatos: CSV (dados brutos), Excel (formatado), PDF (relatório)
- Exportação respeita os filtros ativos na tela
- Arquivo gerado com nome e data

## Critérios de Aceite
- [ ] Botão de exportação visível na listagem de profissionais
- [ ] Exportação em CSV funcional
- [ ] Exportação em Excel funcional (com cabeçalhos formatados)
- [ ] Exportação em PDF funcional (layout de relatório)
- [ ] Filtros aplicados refletidos no arquivo exportado

## MoSCoW
**Should Have** — Elimina dependência de planilhas manuais.

## Fonte
Sugestoes_PM_2026_04_06.docx (PM-006)" \
  "should-have,feature"

create_issue_and_add \
  "[EP-NEW-007] 🔍 Audit Log — Histórico de Ações" \
  "## Descrição
Registro auditável de todas as ações realizadas no sistema.

## Cenário Proposto
- Registrar: criações, edições, deleções e logins
- Exibir: quem fez, o quê, quando
- Visível apenas para admins
- Tabela \`audit_logs\` no Supabase

## Critérios de Aceite
- [ ] Toda ação CRUD registra entrada em audit_logs
- [ ] Login/logout registrado
- [ ] Interface de consulta disponível para admins
- [ ] Registros não podem ser deletados pelo usuário

## MoSCoW
**Should Have** — Essencial para compliance e rastreabilidade.

## Fonte
Sugestoes_PM_2026_04_06.docx (PM-007)" \
  "should-have,feature,security,data"

create_issue_and_add \
  "[EP-NEW-008] ⚡ Filtros Avançados de Profissionais" \
  "## Descrição
Filtros combinados e busca full-text na listagem de profissionais.

## Cenário Proposto
- Filtros por: cliente, status de contrato, faixa de vencimento, senioridade, tecnologia
- Salvar filtros favoritos por usuário
- Busca full-text nos dados do profissional

## Critérios de Aceite
- [ ] Filtros combinados funcionam sem recarregar a página
- [ ] Usuário pode salvar até 5 filtros favoritos
- [ ] Busca full-text retorna resultados em < 500ms
- [ ] Filtros refletem na exportação (EP-NEW-006)

## MoSCoW
**Should Have** — Acelera localização em bases grandes.

## Fonte
Sugestoes_PM_2026_04_06.docx (PM-008)" \
  "should-have,feature,ux"

create_issue_and_add \
  "[EP-NEW-009] 🔐 Gestão de Permissões Granular" \
  "## Descrição
Papéis e controles de acesso além de admin/user.

## Cenário Proposto
- Novos papéis: visualizador, editor por cliente, gestor
- Controle de quais clientes cada usuário acessa
- Admin define permissões por usuário

## Critérios de Aceite
- [ ] Pelo menos 3 papéis distintos implementados
- [ ] Editor por cliente só vê os profissionais do seu cliente
- [ ] Admin consegue atribuir papéis na área de usuário
- [ ] Mudança de papel tem efeito imediato

## MoSCoW
**Should Have** — Evita vazamento de dados entre gestores de clientes.

## Fonte
Sugestoes_PM_2026_04_06.docx (PM-009)" \
  "should-have,feature,security"

echo ""
echo "  🟢 COULD HAVE"
echo "  ──────────────"

create_issue_and_add \
  "[EP-NEW-010] 🎨 Redesign de Tipografia e Densidade Visual" \
  "## Descrição
Ajuste de fontes e densidade de informação em todas as telas.

## Cenário Atual
As fontes de todas as telas estão muito grandes, tornando a interface menos profissional.

## Cenário Proposto
- Reduzir tamanho das fontes em ~20%
- Aumentar densidade de informação por tela
- Revisar hierarquia visual dos cabeçalhos
- Ajuste de espaçamentos e margens

## MoSCoW
**Could Have** — Melhora percepção de qualidade do produto.

## Fonte
Backlog_Melhorias_0604_não feitas.docx + Sugestoes_PM_2026_04_06.docx (PM-014)" \
  "could-have,ux"

create_issue_and_add \
  "[EP-NEW-011] 🧹 Toolbar Única (remover duplicata)" \
  "## Descrição
O sistema possui 2 toolbars. Manter somente a da parte superior.

## Cenário Atual
Existe duplicidade de toolbar no layout atual.

## Cenário Proposto
- Manter apenas a toolbar da parte superior
- Remover a toolbar redundante
- Garantir que todas as ações da toolbar removida estejam acessíveis na toolbar mantida

## Observação
Item separado de EP-NEW-005 (Área de Usuário Unificada), apesar de serem ambos relacionados ao layout superior.

## MoSCoW
**Could Have**

## Fonte
Backlog_Melhorias_0604_não feitas.docx" \
  "could-have,ux"

create_issue_and_add \
  "[EP-NEW-012] 📈 Dashboard de Métricas Kanban" \
  "## Descrição
Painel com métricas de processo do time de desenvolvimento.

## Cenário Proposto
- Lead Time e Cycle Time por card
- Throughput semanal
- WIP por coluna
- Gráfico de cumulative flow e burn-up
- Visível para gestores

## MoSCoW
**Could Have** — Suporte à melhoria contínua com dados reais do processo.

## Fonte
Sugestoes_PM_2026_04_06.docx (PM-010)" \
  "could-have,feature"

create_issue_and_add \
  "[EP-NEW-013] 📋 Histórico de Alterações por Profissional" \
  "## Descrição
Timeline visual na ficha do profissional com todas as mudanças históricas.

## Cenário Proposto
- Mudanças de cliente
- Renovações de contrato
- Edições de dados cadastrais
- Exibição em timeline cronológica

## MoSCoW
**Could Have** — Facilita auditorias e contestações.

## Fonte
Sugestoes_PM_2026_04_06.docx (PM-011)" \
  "could-have,feature,data"

create_issue_and_add \
  "[EP-NEW-014] 💬 Notas e Comentários por Profissional" \
  "## Descrição
Campo de observações livres vinculado à ficha de cada profissional.

## Cenário Proposto
- Campo de texto livre por profissional
- Exibir autor e data de cada nota
- Visível apenas para gestores
- Substitui anotações externas (e-mail, post-it)

## MoSCoW
**Could Have** — Centraliza informações contextuais sobre o profissional.

## Fonte
Sugestoes_PM_2026_04_06.docx (PM-012)" \
  "could-have,feature"

create_issue_and_add \
  "[EP-NEW-015] ⚡ Busca Global — Command Palette (Ctrl+K)" \
  "## Descrição
Busca global com atalho de teclado para navegação rápida.

## Cenário Proposto
- Atalho Ctrl+K abre modal de busca global
- Busca em: profissionais, clientes, funcionalidades do sistema
- Resultado em tempo real com highlight
- Padrão de UX moderno

## MoSCoW
**Could Have** — Acelera navegação em bases com muitos dados.

## Fonte
Sugestoes_PM_2026_04_06.docx (PM-013)" \
  "could-have,feature,ux"

create_issue_and_add \
  "[EP-NEW-016] 📱 PWA — Acesso Mobile Offline" \
  "## Descrição
Configurar o sistema como Progressive Web App para acesso mobile.

## Cenário Proposto
- Instalável no celular via navegador
- Cache das últimas consultas para uso offline
- Notificações push nativas
- Útil para gestores em campo

## Observação
Substitui a necessidade de app nativo (Won't Have).

## MoSCoW
**Could Have**

## Fonte
Sugestoes_PM_2026_04_06.docx (PM-015)" \
  "could-have,feature"

# ─────────────────────────────────────────
# RESUMO FINAL
# ─────────────────────────────────────────
echo ""
echo "============================================"
echo "  ✅ Backlog criado com sucesso!"
echo "============================================"
echo ""
echo "  Issues criadas: 16"
echo "  Projeto: #$PROJECT_NUMBER — $PROJECT_TITLE"
echo ""
echo "  Distribuição:"
echo "    🔴 Must Have:   4 issues (EP-NEW-001 a 004)"
echo "    🟠 Should Have: 5 issues (EP-NEW-005 a 009)"
echo "    🟢 Could Have:  7 issues (EP-NEW-010 a 016)"
echo ""
echo "  Próximo passo:"
echo "  Acesse o projeto no GitHub e mova as issues"
echo "  para a coluna '📋 Backlog'."
echo ""
echo "  https://github.com/$OWNER/$REPO/projects"
echo ""
