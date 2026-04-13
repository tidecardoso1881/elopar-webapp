---
de: Gerente (Cowork)
para: Especialista 1 (Haiku)
data: 2026-04-07
tipo: TICKET
bug: BUG-003
prioridade: URGENT
---

# TICKET — BUG-003: Abrir PR com fix gerenciar-usuarios (RPC)

## Contexto
O Gerente já corrigiu os arquivos no disco. Sua tarefa é apenas commitar e abrir o PR.

## Arquivos já modificados (não altere o conteúdo)
- `src/app/(dashboard)/area-usuario/gerenciar-usuarios/page.tsx`
- `src/lib/types/database.ts`

## O que foi feito (para o corpo do PR)
- Substituiu `createAdminClient()` por `supabase.rpc('get_users_for_admin')`
- Criou RPC `get_users_for_admin` com `SECURITY DEFINER` no Supabase (migration já aplicada)
- Atualizou `database.ts` com a assinatura da nova função
- Página funciona sem `SUPABASE_SERVICE_ROLE_KEY` no Vercel

## Comandos exatos

```bash
cd elopar-webapp
git checkout main && git pull origin main
git checkout -b fix/bug-003-gerenciar-usuarios-rpc
git add "src/app/(dashboard)/area-usuario/gerenciar-usuarios/page.tsx" src/lib/types/database.ts
git commit -m "$(cat <<'EOF'
fix(BUG-003): substituir createAdminClient por RPC SECURITY DEFINER

Elimina dependência de SUPABASE_SERVICE_ROLE_KEY no Vercel.
Cria função get_users_for_admin com SECURITY DEFINER que
acessa auth.users diretamente no postgres, com guarda is_admin().

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
git push origin fix/bug-003-gerenciar-usuarios-rpc
gh pr create \
  --title "fix(BUG-003): gerenciar-usuarios sem service role key (RPC SECURITY DEFINER)" \
  --body "$(cat <<'EOF'
## O que foi feito
- Criou RPC \`get_users_for_admin\` com SECURITY DEFINER no Supabase
- Substituiu \`createAdminClient()\` por \`supabase.rpc('get_users_for_admin')\`
- Atualizado \`database.ts\` com a assinatura da nova função
- Página funciona sem \`SUPABASE_SERVICE_ROLE_KEY\` no Vercel

## Por que funciona
A função RPC roda como postgres (acesso nativo ao auth schema), mas só é executável por usuários autenticados que sejam admin. Zero risco de exposição.

Closes BUG-003

🤖 Generated with Claude Code
EOF
)"
```

## DoD
- [ ] Branch `fix/bug-003-gerenciar-usuarios-rpc` criada
- [ ] PR aberto com número
- [ ] Responder ao Gerente com `DONE_BUG-003-pr-rpc_07042026_[hh_mm].md` com o número do PR
