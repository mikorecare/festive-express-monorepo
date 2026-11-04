import { createClient, type SupabaseClient } from '@supabase/supabase-js'

export const getSupabase = () => {
    const config = useRuntimeConfig()

    return createClient<any>(
        config.public.supabaseUrl,
        config.supabase.secretKey
    )
}

let adminClient: SupabaseClient<any> | null = null

export function getSupabaseAdmin() {
    if (!adminClient) {
        const config = useRuntimeConfig()
        adminClient = createClient<any>(
            config.public.supabaseUrl,
            config.supabase.serviceKey,
            { auth: { persistSession: false, autoRefreshToken: false } },
        )
    }
    return adminClient
}