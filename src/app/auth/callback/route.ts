import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// Helper to normalize origin for consistent cookie handling
// In development, always use localhost to avoid cookie domain mismatches
function normalizeOrigin(origin: string): string {
  if (origin.includes('0.0.0.0')) {
    return origin.replace('0.0.0.0', 'localhost')
  }
  return origin
}

export async function GET(request: NextRequest) {
  const { searchParams, origin: rawOrigin } = new URL(request.url)
  const origin = normalizeOrigin(rawOrigin)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  let next = searchParams.get('next') ?? '/'

  // Determine locale from next param or referer
  let locale = 'zh' // default

  // Check if next path starts with a locale
  const nextLocaleMatch = next.match(/^\/(zh|en)(\/|$)/)
  if (nextLocaleMatch) {
    locale = nextLocaleMatch[1]
  } else {
    // Try to extract locale from referer
    const referer = request.headers.get('referer')
    if (referer) {
      const match = referer.match(/\/(zh|en)(\/|$)/)
      if (match) locale = match[1]
    }
  }

  // Special handling for reset-password which might not have locale in 'next' yet
  if (next === '/reset-password') {
    next = `/${locale}/reset-password`
  }

  if (code) {
    const forwardedHost = request.headers.get('x-forwarded-host')
    const isLocalEnv = process.env.NODE_ENV === 'development'
    const redirectUrl = isLocalEnv
      ? `${origin}${next}`
      : forwardedHost
        ? `https://${forwardedHost}${next}`
        : `${origin}${next}`

    // Create the redirect response FIRST, then write cookies onto it.
    // Using cookieStore.set() from next/headers does NOT attach cookies to
    // NextResponse.redirect(), so the session would be lost after the redirect.
    const response = NextResponse.redirect(redirectUrl)

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options)
            })
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return response
    }
  }

  // return the user to login page with error
  return NextResponse.redirect(`${origin}/${locale}/login?error=AuthCodeError`)
}

