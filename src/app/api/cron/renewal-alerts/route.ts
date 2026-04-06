import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import type { Database } from '@/lib/types/database'

// Proteção da rota: requer CRON_SECRET no header Authorization
function isAuthorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret) return true // dev sem secret configurado
  const auth = req.headers.get('authorization')
  return auth === `Bearer ${secret}`
}

// Urgency baseada em days_until_expiry
function toUrgency(days: number): 'expired' | 'critical' | 'warning' | 'attention' | null {
  if (days < 0) return 'expired'
  if (days <= 30) return 'critical'
  if (days <= 60) return 'warning'
  if (days <= 90) return 'attention'
  return null // > 90 dias: sem notificação
}

export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({ error: 'Missing Supabase env vars' }, { status: 500 })
  }

  const supabase = createClient<Database>(supabaseUrl, serviceKey)

  // Buscar todos profissionais ATIVOS com vencimento ≤ 90 dias
  const { data: alerts, error } = await supabase
    .from('v_renewal_alerts')
    .select('id, name, client_name, days_until_expiry, renewal_deadline, renewal_status')
    .eq('status', 'ATIVO')
    .lte('days_until_expiry', 90)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const today = new Date().toISOString().slice(0, 10)
  let created = 0
  let skipped = 0
  let emailsSent = 0

  for (const alert of alerts ?? []) {
    if (!alert.id || alert.days_until_expiry === null) continue

    const urgency = toUrgency(alert.days_until_expiry)
    if (!urgency) continue

    // Upsert com deduplicação (unique index em professional_id + sent_at)
    const { error: upsertError, data: inserted } = await supabase
      .from('contract_notifications')
      .upsert(
        {
          professional_id: alert.id,
          professional_name: alert.name ?? '',
          client_name: alert.client_name,
          days_until_expiry: alert.days_until_expiry,
          renewal_deadline: alert.renewal_deadline,
          urgency,
          sent_at: today,
        },
        { onConflict: 'professional_id,sent_at', ignoreDuplicates: true }
      )
      .select('id')
      .maybeSingle()

    if (upsertError) {
      skipped++
      continue
    }

    if (inserted?.id) {
      created++

      // Enviar e-mail via Resend (se configurado)
      const resendKey = process.env.RESEND_API_KEY
      const notifyEmail = process.env.NOTIFY_EMAIL
      if (resendKey && notifyEmail) {
        try {
          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${resendKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: 'Elopar <noreply@elopar.com.br>',
              to: [notifyEmail],
              subject: `⚠️ Renovação: ${alert.name} vence em ${alert.days_until_expiry} dias`,
              html: `
                <p><strong>${alert.name}</strong> (${alert.client_name ?? 'Cliente não informado'})</p>
                <p>Contrato vence em <strong>${alert.days_until_expiry} dias</strong> (${alert.renewal_deadline ?? '—'}).</p>
                <p>Acesse <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/notificacoes">o centro de notificações</a> para mais detalhes.</p>
              `,
            }),
          })
          emailsSent++
        } catch {
          // Email falhou mas notificação foi criada — não bloquear
        }
      }
    } else {
      skipped++ // já existia hoje
    }
  }

  return NextResponse.json({
    ok: true,
    date: today,
    created,
    skipped,
    emailsSent,
  })
}
