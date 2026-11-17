export function detectEnvironment(host: string): 'local' | 'staging' | 'production' {
    if (host.includes('localhost') || host.includes('127.0.0.1')) return 'local'
    if (host.includes('vercel') || host.includes('stg') || host.includes('preview')) return 'staging'
    return 'production'
}