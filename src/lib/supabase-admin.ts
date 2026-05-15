import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'

let adminClient: SupabaseClient | null = null

function getAdminClient(): SupabaseClient | null {
  if (adminClient) return adminClient

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceRoleKey) return null

  adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey,
    { auth: { persistSession: false } }
  )
  return adminClient
}

export async function getMutationClient(): Promise<SupabaseClient> {
  const admin = getAdminClient()
  if (admin) return admin

  const { createClient } = await import('@/lib/supabase-server')
  return createClient()
}
