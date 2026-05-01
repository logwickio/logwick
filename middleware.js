import { NextResponse } from 'next/server'

export function middleware(req) {
  const { pathname } = req.nextUrl

  // Content negotiation — serve markdown to agents
  const accept = req.headers.get('accept') || ''
  if (accept.includes('text/markdown') && (pathname === '/' || pathname === '/docs')) {
    const url = req.nextUrl.clone()
    url.pathname = '/api/content'
    url.searchParams.set('format', 'md')
    url.searchParams.set('page', pathname === '/docs' ? 'docs' : 'home')
    return NextResponse.rewrite(url)
  }

  const response = NextResponse.next()

  // RFC 8288 Link headers for agent discovery
  if (!pathname.startsWith('/api/')) {
    response.headers.set('Link', [
      '</sitemap.xml>; rel="sitemap"; type="application/xml"',
      '</llms.txt>; rel="alternate"; type="text/plain"; title="LLMs.txt"',
      '</llms-full.txt>; rel="alternate"; type="text/plain"; title="Full LLMs documentation"',
      '</index.md>; rel="alternate"; type="text/markdown"',
      '</openapi.json>; rel="service.desc"; type="application/openapi+json"',
    ].join(', '))
  }

  return response
}

export const config = {
  matcher: ['/', '/docs', '/about', '/contact', '/compare', '/blog/:path*'],
}
