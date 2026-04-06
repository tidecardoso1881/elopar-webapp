import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/types/database'

export function createClient() {
  // Workaround: @supabase/ssr v0.5.2 não propaga corretamente o generic Database
  // para @supabase/supabase-js v2.101.x — cast necessário para tipagem correta
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ) as unknown as SupabaseClient<Database>
}
