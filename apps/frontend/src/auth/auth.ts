import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { env } from '@/src/config';
import { authService } from '@/src/services/auth.service';
import { loginSchema } from '@choppi/types';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          

          const validatedFields = loginSchema.safeParse({
            email: credentials?.email,
            password: credentials?.password,
          });

          if (!validatedFields.success) {
            return null;
          }

          const { email, password } = validatedFields.data;

          const { data: loginResponse } = await authService.login({
            email,
            password,
          });

          if (!loginResponse || !loginResponse.accessToken) {
            return null;
          }

          
          return {
            id: loginResponse.user.id,
            email: loginResponse.user.email,
            name: loginResponse.user.name,
            accessToken: loginResponse.accessToken,
          };
        } catch (error) {
          console.error('Error en authorize:', error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as any).accessToken;
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  secret: env.NEXTAUTH_SECRET || undefined,
  session: {
    strategy: 'jwt',
  },
});
