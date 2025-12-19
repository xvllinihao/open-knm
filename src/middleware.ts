import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'
import { locales, defaultLocale } from '@/lib/i18n'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // 1. i18n Check (Logic from proxy.ts)
  // Skip i18n redirect for internal/api/static paths
  const isExcluded =
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/auth') || // Exclude auth callback routes
    pathname.startsWith('/static') ||
    pathname.startsWith('/ingest') ||
    pathname.includes('.')

  if (!isExcluded) {
    // Check if path already has a locale
    const pathnameIsMissingLocale = locales.every(
      (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
    )

    if (pathnameIsMissingLocale) {
      const locale = defaultLocale
      // Redirect to default locale, preserving search params (important for auth callbacks)
      const redirectUrl = new URL(`/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url)
      redirectUrl.search = request.nextUrl.search // Preserve query params like ?code=xxx for auth
      return NextResponse.redirect(redirectUrl)
    }
  }

  // 2. Supabase Session Update (Auth)
  return await updateSession(request)
}

export const config = {
  matcher: [
    // Match all request paths except for the ones starting with:
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    // - images/assets extensions
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
