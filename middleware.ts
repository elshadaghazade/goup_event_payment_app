import { NextRequest } from 'next/server'
import { RequestsRateLimit } from '@/app/middlewares/requests_rate_limit';
 
// Limit the middleware to paths starting with `/api/`
export const config = {
  matcher: [
    '/api/:path*'
  ],
}
 
export async function middleware(request: NextRequest) {

  switch(request.nextUrl.pathname) {
    default:
      const response = await RequestsRateLimit(request);
      return response;
  }
}