import { createClient } from '@supabase/supabase-js'

export const getSupabase = () => {
    const config = useRuntimeConfig()

    return createClient(
        config.public.supabaseUrl,
        config.supabase.serviceKey
    )
}

export const getUserSupabase = () => {
    const config = useRuntimeConfig()

    return createClient(
        config.public.supabaseUrl,
        config.supabase.secretKey
    )
}