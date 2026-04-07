import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANTE: Não escreva nenhum código entre createServerClient e
  // supabase.auth.getUser(). Um erro simples pode dificultar muito a depuração
  // de problemas com usuários sendo desconectados aleatoriamente.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl
  const isLoginPage = pathname === '/login'
  const isAuthCallback = pathname.startsWith('/auth/')
  const isPasswordReset = pathname === '/reset-password'
  const isPasswordUpdate = pathname === '/update-password'

  // Usuário não autenticado tentando acessar página protegida → redirecionar para login
  if (!user && !isLoginPage && !isAuthCallback && !isPasswordReset && !isPasswordUpdate) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Usuário autenticado tentando acessar página de login → redirecionar para dashboard
  if (user && isLoginPage) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // Rotas que requerem role admin ou gerente (analytics + audit log)
  const adminOrManagerRoutes = [
    '/area-usuario/metricas',
    '/area-usuario/saude-testes',
    '/area-usuario/audit-log',
  ]

  // Rota que requer role admin exclusivamente
  const adminOnlyRoutes = [
    '/area-usuario/gerenciar-usuarios',
  ]

  const requiresAdminOrManager = adminOrManagerRoutes.some(r => pathname.startsWith(r))
  const requiresAdmin = adminOnlyRoutes.some(r => pathname.startsWith(r))

  if (user && (requiresAdminOrManager || requiresAdmin)) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const role = profile?.role ?? ''
    const isAdminOrManager = role === 'admin' || role === 'gerente' || role === 'manager'
    const isAdmin = role === 'admin'

    if (requiresAdmin && !isAdmin) {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }

    if (requiresAdminOrManager && !isAdminOrManager) {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
