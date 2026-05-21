import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import GitHub from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from '@/lib/db';
import { users, accounts, sessions, verificationTokens, whitelistedEmails } from '@/lib/db/schema';
import { authConfig } from '@/lib/auth.config';
import { eq } from 'drizzle-orm';
import { compare } from 'bcryptjs';

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    // ✅ Credentials Provider (Email & Password)
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email as string))
          .limit(1);

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await compare(credentials.password as string, user.password);
        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          isOnboarded: user.isOnboarded,
          image: user.image,
        };
      },
    }),

    // ✅ Google OAuth
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          scope: 'openid email profile https://www.googleapis.com/auth/classroom.courses.readonly https://www.googleapis.com/auth/classroom.rosters.readonly',
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),

    // ✅ GitHub OAuth
    GitHub({
      clientId: process.env.LOGIN_GIT!,
      clientSecret: process.env.LOGIN_GIT_SECRET!,
      allowDangerousEmailAccountLinking: true,
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
      } else if (user.email) {
        try {
          // Cek apakah email terdaftar di whitelist sekolah/kampus terverifikasi
          const isWhitelisted = await db.query.whitelistedEmails.findFirst({
            where: eq(whitelistedEmails.email, user.email),
          });

          if (isWhitelisted) {
            // Upgrade secara otomatis ke role: 'teacher' (Guru) terverifikasi & selesaikan onboarding
            await db
              .update(users)
              .set({ role: 'teacher', isOnboarded: true })
              .where(eq(users.email, user.email));
          }
        } catch (err) {
          console.error('[WHITELIST_SIGNIN_UPGRADE_ERROR]', err);
        }
      }
      return true;
    },
    async jwt({ token, user, trigger }) {
      // Saat sign-in awal atau saat update di-trigger, ambil data fresh dari DB
      if (user || trigger === 'update') {
        const lookupId = user?.id ?? (token.id as string | undefined);
        if (lookupId) {
          try {
            const [dbUser] = await db
              .select()
              .from(users)
              .where(eq(users.id, lookupId))
              .limit(1);

            if (dbUser) {
              token.id = dbUser.id;
              token.role = dbUser.role;
              token.isOnboarded = dbUser.isOnboarded;
            }
          } catch (err) {
            console.error('[JWT_DB_LOOKUP_ERROR]', err);
            if (user) {
              token.id = user.id;
              token.role = (user as any).role ?? 'student';
              token.isOnboarded = (user as any).isOnboarded ?? false;
            }
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        (session.user as any).role = (token.role as string) ?? 'student';
        (session.user as any).isOnboarded = (token.isOnboarded as boolean) ?? false;
      }
      return session;
    },
  },
});
