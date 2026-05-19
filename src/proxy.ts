import { NextResponse, type NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const host = request.headers.get('host')?.split(':')[0].toLowerCase() ?? '';
  const subdomain = host.split('.')[0];

  if (!['decision', 'lab'].includes(subdomain)) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();

  if (url.pathname !== '/decision-lab') {
    url.pathname = '/decision-lab';
  }

  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|assets|icon.png|apple-touch-icon.png|og-image.png).*)']
};
