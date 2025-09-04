import NextAuth from 'next-auth';
import { authConfig } from './lib/auth';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;

  // For now, we'll protect all routes except the auth routes themselves.
  const isAuthRoute = nextUrl.pathname.startsWith('/api/auth') || nextUrl.pathname.startsWith('/auth');

  if (isAuthRoute) {
    return; // Don't perform any checks on auth routes
  }

  if (!isLoggedIn) {
    // Redirect to the sign-in page, preserving the intended destination
    return Response.redirect(new URL(`/auth/signin?callbackUrl=${nextUrl.pathname}`, nextUrl));
  }
});

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
