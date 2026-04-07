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

  // Rotas exclusivas para admin — verificar role no banco
  const adminOnlyRoutes = ['/area-usuario/gerenciar-usuarios', '/area-usuario/audit-log']

  // Rota exclusiva para tidebatera@gmail.com
  if (user && pathname.startsWith('/area-usuario/metricas')) {
    if (user.email !== process.env.METRICS_ALLOWED_EMAIL) {
      const url = request.nextUrl.clone()
      url.pathname = '/area-usuario'
      return NextResponse.redirect(url)
    }
  }
  if (user && adminOnlyRoutes.some(r => pathname.startsWith(r))) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      const url = request.nextUrl.clone()
      url.pathname = '/area-usuario'
      return NextResponse.redirect(url)
    }
  }

  // IMPORTANTE: Retornar supabaseResponse para que os cookies de sessão
  // sejam propagados corretamente
  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
