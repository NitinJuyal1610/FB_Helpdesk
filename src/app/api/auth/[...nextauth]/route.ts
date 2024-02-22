import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import User from '@/models/User';

import { z } from 'zod';
import ts from 'typescript';

const authOptions = {
  // Configure one or more authentication providers
  // @ts-ignore
  pages: {
    signIn: '/login',
  },
  providers: [
    Credentials({
      id: 'username-login', // <- add this line
      name: 'Login',
      credentials: {
        username: { label: 'name', type: 'text', placeholder: 'jsmith' },
        password: { label: 'password', type: 'password' },
      },
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await User.findOne({ email });
          if (user && (await user.comparePassword(password))) {
            return user;
          }
          if (!user) return null;
        }

        return null;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET, // Store securely in an environment variable
  callbacks: {
    async jwt({ token, user }: any) {
      // Add custom data to the JWT token if needed
      if (user) {
        token.userData = user; // Replace with your user data structure
      }
      return token;
    },
    async session({ session, token }: any) {
      // Add custom data to the session if needed
      if (token.userData) {
        session.user = token.userData; // Replace with your session user structure
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
