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
    async signIn() {
      return true;
    },
    async jwt({ token, user, trigger }) {
      const lookupId = user?.id ?? (token.id as string | undefined);
      const lookupEmail = user?.email ?? (token.email as string | undefined);
      const isHaqi = lookupEmail === 'haqikuy470@gmail.com';

      // Jalankan query database jika:
      // 1. Baru login (user didefinisikan)
      // 2. Ada update trigger manual
      // 3. User belum onboarded (agar mendeteksi perubahan status onboarding)
      // 4. User adalah haqi tapi rolenya di session belum terupdate menjadi admin
      if (
        user ||
        trigger === 'update' ||
        !token.isOnboarded ||
        (isHaqi && token.role !== 'admin')
      ) {
        if (lookupId) {
          try {
            const [dbUser] = await db
              .select()
              .from(users)
              .where(eq(users.id, lookupId))
              .limit(1);

            if (dbUser) {
              let needsUpdate = false;
              let updatedRole = dbUser.role;
              let updatedIsOnboarded = dbUser.isOnboarded;

              // Auto upgrade haqikuy470@gmail.com menjadi admin
              if (dbUser.email === 'haqikuy470@gmail.com') {
                if (dbUser.role !== 'admin' || !dbUser.isOnboarded) {
                  updatedRole = 'admin';
                  updatedIsOnboarded = true;
                  needsUpdate = true;
                }
              } else if (dbUser.email) {
                // Cek apakah email terdaftar di whitelist sekolah/kampus terverifikasi
                const isWhitelisted = await db.query.whitelistedEmails.findFirst({
                  where: eq(whitelistedEmails.email, dbUser.email),
                });

                if (isWhitelisted) {
                  if (dbUser.role !== 'teacher' || !dbUser.isOnboarded) {
                    updatedRole = 'teacher';
                    updatedIsOnboarded = true;
                    needsUpdate = true;
                  }
                }
              }

              if (needsUpdate) {
                await db
                  .update(users)
                  .set({ role: updatedRole, isOnboarded: updatedIsOnboarded })
                  .where(eq(users.id, dbUser.id));
              }

              token.id = dbUser.id;
              token.role = updatedRole;
              token.isOnboarded = updatedIsOnboarded;
            }
          } catch (err) {
            console.error('[JWT_DB_LOOKUP_ERROR]', err);
            if (user) {
              token.id = user.id;
              token.role = (user as { role?: string }).role ?? 'student';
              token.isOnboarded = (user as { isOnboarded?: boolean }).isOnboarded ?? false;
            }
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        (session.user as { role?: string }).role = (token.role as string) ?? 'student';
        (session.user as { isOnboarded?: boolean }).isOnboarded = (token.isOnboarded as boolean) ?? false;
      }
      return session;
    },
  },
});
