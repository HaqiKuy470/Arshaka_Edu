import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import GitHub from 'next-auth/providers/github';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from '@/lib/db';
import { users, accounts, sessions, verificationTokens } from '@/lib/db/schema';
import { authConfig } from '@/lib/auth.config';
import { eq } from 'drizzle-orm';

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  session: {
    strategy: 'database',
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    // ✅ Google OAuth
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // ✅ GitHub OAuth
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (user.email === 'haqikuy470@gmail.com') {
        try {
          await db
            .update(users)
            .set({ role: 'admin', isOnboarded: true })
            .where(eq(users.email, 'haqikuy470@gmail.com'));
        } catch (err) {
          console.error('[ADMIN_SIGNIN_UPGRADE_ERROR]', err);
        }
      }
      return true;
    },
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        
        if (user.email === 'haqikuy470@gmail.com') {
          (session.user as { role?: string }).role = 'admin';
          (session.user as { isOnboarded?: boolean }).isOnboarded = true;
          
          // Pastikan di database ter-update jika terlewat
          if ((user as { role?: string }).role !== 'admin' || !(user as { isOnboarded?: boolean }).isOnboarded) {
            db.update(users)
              .set({ role: 'admin', isOnboarded: true })
              .where(eq(users.email, 'haqikuy470@gmail.com'))
              .catch(console.error);
          }
        } else {
          // Ambil role dari db user jika ada
          (session.user as { role?: string }).role =
            (user as { role?: string }).role ?? 'student';
          
          // Ambil status onboarding dari db
          (session.user as { isOnboarded?: boolean }).isOnboarded =
            (user as { isOnboarded?: boolean }).isOnboarded ?? false;
        }
      }
      return session;
    },
  },
});
