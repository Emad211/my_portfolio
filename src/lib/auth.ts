import NextAuth from 'next-auth';
import type { NextAuthConfig } from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from '@/lib/db';

// Note: The Email provider requires a configured mail server for production.
// Vercel automatically handles this for deployments when using a custom domain.
// For local development, you'd need to set up an SMTP server or use a service like Mailgun.

export const authConfig = {
  adapter: DrizzleAdapter(db),
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
    // Can add Google provider here later
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // }),
  ],
  pages: {
    signIn: '/auth/signin',
    verifyRequest: '/auth/verify-request', // (e.g. a page telling the user to check their email)
    error: '/auth/error', // Error page
  },
  callbacks: {
    async session({ session, user }) {
      // Add user ID and role to the session object
      session.user.id = user.id;
      // session.user.role = user.role; // Assuming 'role' is on the user model
      return session;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
