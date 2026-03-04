import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/'

    const cookieStore = await cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) { return cookieStore.get(name)?.value },
                set(name: string, value: string, options: CookieOptions) { cookieStore.set({ name, value, ...options }) },
                remove(name: string, options: CookieOptions) { cookieStore.delete({ name, ...options }) },
            },
        }
    )

    if (code) {
        const { data, error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error && data.session) {
            return NextResponse.redirect(`${origin}${next}`)
        }

        if (error) {
            console.error('Supabase exchange error:', error.message)
            // Fallback: If code exchange failed but session already exists, just redirect
            const { data: { session } } = await supabase.auth.getSession()
            if (session) return NextResponse.redirect(`${origin}${next}`)
        }
    } else {
        // No code found - check if we are already logged in before erroring
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
            return NextResponse.redirect(`${origin}${next}`)
        }
    }

    // Still no session after exchange or no code, go to error page
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
