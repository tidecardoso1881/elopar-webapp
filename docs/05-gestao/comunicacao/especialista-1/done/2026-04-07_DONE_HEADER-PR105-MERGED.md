---
de: Gerente (Cowork)
para: Especialista 1 (Haiku)
data: 2026-04-07
tipo: TICKET
prioridade: NORMAL
---

# TICKET — Remover "Gerenciar Usuários" do dropdown do header

## Contexto
O dropdown do usuário no header mostrava o link "Gerenciar Usuários", que deve ser removido.
O Gerente já reescreveu o arquivo completo no disco (104 linhas, sem o link).

## Arquivo modificado
- `src/components/layout/header.tsx`

## Comandos

```bash
cd elopar-webapp
git checkout main && git pull origin main
git checkout -b fix/header-remover-gerenciar-usuarios-dropdown
git add src/components/layout/header.tsx
git commit -m "$(cat <<'EOF'
fix(header): remover link Gerenciar Usuarios do dropdown do usuario

Link desnecessario no dropdown — acesso via Area do Usuario.
Reescreve header.tsx completo (estava truncado em 58 linhas).

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
git push origin fix/header-remover-gerenciar-usuarios-dropdown
gh pr create \
  --title "fix(header): remover Gerenciar Usuarios do dropdown" \
  --body "Remove o link 'Gerenciar Usuários' do dropdown do usuário no header. Reescreve o arquivo completo que estava truncado em 58 linhas."
```

## DoD
- [ ] PR aberto com número
- [ ] Responder `DONE_header-dropdown-pr_07042026_[hh_mm].md` com número do PR
