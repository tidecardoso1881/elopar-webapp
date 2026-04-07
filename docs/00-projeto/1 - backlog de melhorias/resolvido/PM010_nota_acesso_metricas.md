# PM-010 — Nota de Restrição de Acesso: Dashboard de Métricas

**Data:** 06/04/2026
**Decisão de:** Tide Cardoso
**Status:** Aprovado — aplicar na implementação

---

## Restrição

O Dashboard de Métricas (`/metricas`) **não deve ser visível para todos os usuários**.
Acesso restrito ao usuário: `tidebatera@gmail.com`

---

## Critério de aceite atualizado (substitui o original no DoR)

- ~~Visível somente para admin/manager~~ ❌ **revogado**
- ✅ Acesso permitido exclusivamente ao e-mail `tidebadera@gmail.com`
- Qualquer outro usuário autenticado que tente acessar `/metricas` deve ser redirecionado para `/dashboard` com mensagem "Acesso não autorizado"
- O item de menu "Métricas" no sidebar deve ser renderizado **somente** para esse e-mail (não aparecer para outros usuários)

---

## Implementação sugerida

**Opção A — Verificação direta na página (mais simples):**
```typescript
// src/app/(dashboard)/metricas/page.tsx
const { data: { user } } = await supabase.auth.getUser()
if (user?.email !== process.env.METRICS_ALLOWED_EMAIL) {
  redirect('/dashboard')
}
```

**Opção B — Variável de ambiente (recomendado para flexibilidade futura):**
```env
# .env.local
METRICS_ALLOWED_EMAIL=tidebatera@gmail.com
```

Usar variável de ambiente evita hardcode no código e facilita alterar o acesso sem redeploy caso necessário.

**Sidebar — condicional:**
```tsx
// src/components/layout/sidebar.tsx
{user.email === process.env.METRICS_ALLOWED_EMAIL && (
  <NavItem href="/metricas" label="Métricas" icon={<BarChart />} />
)}
```

---

## Nota para o agente de implementação

Ao implementar PM-010, verificar este arquivo antes de codificar.
A restrição se aplica tanto à **rota** quanto ao **item de menu no sidebar**.
Adicionar `METRICS_ALLOWED_EMAIL` ao `.env.local` e ao `.env.example`.
