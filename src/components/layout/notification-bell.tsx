import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export async function NotificationBell() {
  const supabase = await createClient()

  const { count } = await supabase
    .from('contract_notifications')
    .select('*', { count: 'exact', head: true })
    .is('read_at', null)

  const unread = count ?? 0

  return (
    <Link
      href="/notificacoes"
      className="relative inline-flex items-center justify-center w-9 h-9 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
      aria-label={`Notificações${unread > 0 ? ` (${unread} não lidas)` : ''}`}
    >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
      </svg>
      {unread > 0 && (
        <span
          className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold leading-none"
          aria-hidden="true"
        >
          {unread > 9 ? '9+' : unread}
        </span>
      )}
    </Link>
  )
}
