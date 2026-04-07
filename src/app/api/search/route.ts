import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')?.trim()
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '5', 10), 10)

  if (!q || q.length < 2) {
    return NextResponse.json({ professionals: [], clients: [], equipment: [] })
  }

  const supabase = await createClient()

  const pattern = `%${q}%`

  const [profResult, clientResult, equipResult] = await Promise.all([
    supabase
      .from('professionals')
      .select('id, name, position, status, client_id')
      .ilike('name', pattern)
      .limit(limit),

    supabase
      .from('clients')
      .select('id, name')
      .ilike('name', pattern)
      .limit(limit),

    supabase
      .from('equipment')
      .select('id, machine_model, machine_type, professional_name, company')
      .or(`machine_model.ilike.${pattern},professional_name.ilike.${pattern}`)
      .limit(limit),
  ])

  // Enrich professionals with client name
  const clientIds = [
    ...new Set((profResult.data ?? []).map((p) => p.client_id).filter(Boolean)),
  ]

  let clientNames: Record<string, string> = {}
  if (clientIds.length > 0) {
    const { data: clientsData } = await supabase
      .from('clients')
      .select('id, name')
      .in('id', clientIds)
    clientNames = Object.fromEntries(
      (clientsData ?? []).map((c) => [c.id, c.name])
    )
  }

  const professionals = (profResult.data ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    subtitle: [p.position, clientNames[p.client_id]].filter(Boolean).join(' · '),
    status: p.status,
  }))

  const clients = (clientResult.data ?? []).map((c) => ({
    id: c.id,
    name: c.name,
    subtitle: 'Cliente',
  }))

  const equipment = (equipResult.data ?? []).map((e) => ({
    id: e.id,
    name: e.machine_model ?? e.machine_type ?? 'Equipamento',
    subtitle: [e.machine_type, e.professional_name].filter(Boolean).join(' · '),
  }))

  return NextResponse.json({ professionals, clients, equipment })
}
