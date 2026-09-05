import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PROTECTED_ROUTES = ['/dashboard', '/transactions', '/budget', '/analytics', '/settings']
const LOGIN_ROUTE = '/login'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route))

  if (isProtected) {
    const token = request.cookies.get('auth_token')?.value

    if (!token) {
      const loginUrl = new URL(LOGIN_ROUTE, request.url)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/transactions/:path*', '/budget/:path*', '/analytics/:path*', '/settings/:path*'],
}
