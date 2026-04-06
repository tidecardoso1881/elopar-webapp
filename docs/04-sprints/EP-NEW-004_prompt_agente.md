# Prompt — Agente EP-NEW-004: Alertas de Renovação de Contrato

> **Cole este prompt no Claude Code para iniciar a implementação.**
> Executor: Agente (`senior-fullstack`) | Revisão: Tide (Git Bash)
> DoR aprovada em 06/04/2026 | Complexidade: L (3–5 dias)

---

## Contexto do Projeto

Você está implementando uma feature no **Elopar WebApp** — plataforma de gestão de profissionais técnicos.

Stack: Next.js 14+ (App Router) · TypeScript · Supabase · Tailwind CSS · Vercel

Leia `CLAUDE.md` e `docs/05-gestao/KANBAN.md` antes de começar.

---

## EP-NEW-004 — Alertas de Renovação de Contrato

### Objetivo
Implementar um sistema de alertas automáticos para contratos prestes a vencer. O sistema deve:
1. Exibir badges visuais na listagem de profissionais
2. Manter um centro de notificações em `/notificacoes`
3. Enviar e-mail automático via Resend
4. Rodar um job diário para verificar e gerar notificações

---

### Schema do Banco (já existente)

A tabela `professionals` já possui os campos relevantes:
- `contract_end` (date) — data de fim do contrato
- `renewal_deadline` (date) — prazo de renovação
- `client_id` (uuid) — FK para `clients`

A tabela `profiles` já existe com roles `admin` | `manager`.

---

### Migration — Criar tabela `notifications`

Crie via Supabase MCP (`apply_migration`), nome: `create_notifications_table`:

```sql
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  professional_id UUID NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL CHECK (tipo IN ('VENCE_30', 'VENCE_60', 'VENCE_90')),
  visto_em TIMESTAMPTZ NULL,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- Deduplicação: 1 notificação por profissional/tipo por dia
  UNIQUE (professional_id, tipo, date_trunc('day', criado_em))
);

-- RLS: cada user vê apenas suas próprias notificações
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_notifications" ON public.notifications
  FOR ALL USING (auth.uid() = user_id);

-- Índices
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_professional_id ON public.notifications(professional_id);
CREATE INDEX idx_notifications_visto_em ON public.notifications(visto_em) WHERE visto_em IS NULL;
```

---

### Regras de Negócio

**Badge de alerta na listagem:**
- 🔴 Vermelho: `contract_end` ≤ 30 dias a partir de hoje
- 🟡 Amarelo: `contract_end` entre 31 e 60 dias
- 🔵 Azul: `contract_end` entre 61 e 90 dias
- Sem badge: `contract_end` > 90 dias ou null

**Deduplicação:**
- Máximo 1 notificação por profissional/tipo por dia (garantido pela UNIQUE constraint)
- Job não regenera notificações já criadas no dia

**RLS:**
- Cada usuário vê apenas notificações geradas para o seu `user_id`

---

### Arquivos a criar/modificar

#### 1. `src/lib/notifications.ts` (novo)
Funções utilitárias:
```typescript
// Calcular dias até o vencimento
export function diasAteVencimento(contractEnd: Date | null): number | null

// Determinar o tipo de badge
export type BadgeTipo = 'VENCE_30' | 'VENCE_60' | 'VENCE_90' | null
export function getBadgeTipo(contractEnd: Date | null): BadgeTipo

// Buscar notificações não lidas do usuário atual
export async function getNotificacoesNaoLidas(supabase: SupabaseClient): Promise<Notification[]>

// Marcar notificação como lida
export async function marcarComoLida(supabase: SupabaseClient, notificationId: string): Promise<void>
```

#### 2. `src/components/ContractBadge.tsx` (novo)
Componente reutilizável:
```typescript
// Props:
// contractEnd: Date | null
// compact?: boolean (modo inline para tabelas)
// Renderiza o badge colorido com texto "Vence em X dias"
// ou null se não há alerta
```

#### 3. `src/app/(dashboard)/notificacoes/page.tsx` (novo)
- Server Component buscando notificações do usuário
- Filtros: Todas / Não lidas
- Botão "Marcar como lida" (client action)
- Seguir layout visual do mockup aprovado:
  `docs/00-projeto/1 - backlog de melhorias/mockups/EP-NEW-004_alertas.html`

#### 4. Modificar listagem de profissionais
Adicionar coluna "Alerta" na tabela de profissionais:
- Arquivo: `src/app/(dashboard)/profissionais/page.tsx` (ou onde estiver a listagem)
- Inserir `<ContractBadge contractEnd={prof.contract_end} compact />` na coluna de alerta
- Adicionar ícone 🔔 no header com contador de não lidas (link para `/notificacoes`)

#### 5. `src/app/api/notifications/generate/route.ts` (novo)
API Route para o job diário:
```typescript
// POST /api/notifications/generate
// Protegida por CRON_SECRET no header Authorization
// Lógica:
// 1. Buscar todos os profissionais com contract_end entre hoje+1 e hoje+90
// 2. Para cada um, determinar o tipo (VENCE_30/60/90)
// 3. Buscar todos os users com role 'admin' ou 'manager'
// 4. Inserir notificações (ON CONFLICT DO NOTHING para deduplicar)
// 5. Enviar e-mail via Resend para cada gestor
// Retorna: { generated: N, emails_sent: N }
```

#### 6. `src/lib/resend.ts` (novo ou verificar se existe)
```typescript
// Cliente Resend + função sendRenewalAlert
// Template de e-mail em PT-BR com lista de contratos vencendo
// Variável de ambiente: RESEND_API_KEY
```

#### 7. GitHub Actions — `/.github/workflows/daily-notifications.yml` (novo)
```yaml
name: Daily Contract Alerts
on:
  schedule:
    - cron: '0 0 * * *'  # Meia-noite UTC diariamente
  workflow_dispatch:      # Permite rodar manualmente
jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger notifications job
        run: |
          curl -X POST "${{ secrets.NEXT_PUBLIC_APP_URL }}/api/notifications/generate" \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}" \
            -H "Content-Type: application/json"
```

#### 8. Variáveis de ambiente (`.env.local.example`)
Adicionar:
```
RESEND_API_KEY=re_...
CRON_SECRET=gerar-um-secret-seguro
NEXT_PUBLIC_APP_URL=https://seu-app.vercel.app
```

---

### Plano de Testes

**Unitários (`src/tests/`):**
- `notifications.test.ts`: `diasAteVencimento()`, `getBadgeTipo()` com casos limítrofes (0, 1, 30, 31, 60, 61, 90, 91, null)
- `ContractBadge.test.tsx`: render correto para cada tipo + null

**Integração:**
- `notifications-api.test.ts`: POST `/api/notifications/generate` gera notificações corretamente + deduplicação

**E2E (Playwright):**
- Seed: criar profissional com `contract_end = hoje + 10 dias`
- Verificar badge 🔴 aparece na listagem
- Navegar para `/notificacoes` e conferir item listado
- Clicar "Marcar como lida" e verificar que o contador do 🔔 diminui

---

### Definition of Done

Antes de abrir o PR, rodar:
```bash
npx tsc --noEmit   # zero erros
npm run lint       # zero warnings
npm run test       # todos passando
npm run build      # build local ok
```

---

### Referências

- Mockup aprovado: `docs/00-projeto/1 - backlog de melhorias/mockups/EP-NEW-004_alertas.html`
- DoR completa: `docs/00-projeto/1 - backlog de melhorias/DoR_Must_Have_2026_04_06.docx`
- Schema atual: tabelas `professionals`, `profiles`, `clients` no Supabase
- CLAUDE.md (raiz) — comandos e regras do projeto
