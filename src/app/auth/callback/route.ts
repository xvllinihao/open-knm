import { NextResponse } from 'next/server'
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/utils/supabase/server'

// Helper to normalize origin for consistent cookie handling
// In development, always use localhost to avoid cookie domain mismatches
function normalizeOrigin(origin: string): string {
  if (origin.includes('0.0.0.0')) {
    return origin.replace('0.0.0.0', 'localhost')
  }
  return origin
}

export async function GET(request: Request) {
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
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === 'development'
      if (isLocalEnv) {
        // Use normalized origin (localhost instead of 0.0.0.0) for consistent cookies
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // return the user to login page with error
  return NextResponse.redirect(`${origin}/${locale}/login?error=AuthCodeError`)
}

