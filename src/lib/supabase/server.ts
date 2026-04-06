import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/types/database'

export async function createClient() {
  const cookieStore = await cookies()

  // Workaround: @supabase/ssr v0.5.2 não propaga corretamente o generic Database
  // para @supabase/supabase-js v2.101.x — cast necessário para tipagem correta
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // setAll chamado de um Server Component — pode ser ignorado com segurança
            // se há middleware atualizando as sessões de usuário
          }
        },
      },
    }
  ) as unknown as SupabaseClient<Database>
}
