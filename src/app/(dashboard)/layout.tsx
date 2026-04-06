import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { RenewalBadge } from '@/components/renovacoes/renewal-badge'
import { NotificationBell } from '@/components/layout/notification-bell'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role')
    .eq('id', user.id)
    .single()

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Hidden on mobile, visible on md+ */}
      <div className="hidden md:flex">
        <Sidebar user={{ email: user.email ?? '' }} profile={profile} renewalBadge={<RenewalBadge />} />
      </div>

      <main className="flex-1 flex flex-col overflow-hidden">
        <Header user={{ email: user.email ?? '' }} profile={profile} notificationBell={<NotificationBell />} />

        <div className="flex-1 overflow-auto p-4 sm:p-6">
          {children}
        </div>
      </main>
    </div>
  )
}