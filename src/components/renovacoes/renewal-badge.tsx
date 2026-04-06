import { createClient } from '@/lib/supabase/server'

export async function RenewalBadge() {
  const supabase = await createClient()

  const { count, error } = await supabase
    .from('v_renewal_alerts')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'ATIVO')
    .lte('days_until_expiry', 30)

  if (error || count === null || count === 0) {
    return null
  }

  return (
    <span className="ml-2 inline-flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-white text-xs font-bold">
      {count > 99 ? '99+' : count}
    </span>
  )
}
