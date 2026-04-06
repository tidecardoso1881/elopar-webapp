import { createServerClient, type CookieMethodsServer } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/types/database'

type SetAllCookies = Parameters<NonNullable<CookieMethodsServer['setAll']>>[0]

export async function createClient(): Promise<SupabaseClient<Database>> {
  const cookieStore = await cookies()

  // Workaround: @supabase/ssr v0.5.2 was built against supabase-js v2.43.x.
  // In v2.101.x the SupabaseClient type gained a new SchemaNameOrClientOptions
  // param at position 2, shifting Schema to position 3. SSR passes the Schema
  // object where supabase-js now expects a string SchemaName, resolving to
  // `never`. Casting to SupabaseClient<Database> lets TypeScript use its own
  // defaults and correctly infer Row/Insert types from database.ts.
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: SetAllCookies) {
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
