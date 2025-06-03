import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models/User';

// Demo user credentials
const DEMO_USER = {
  username: 'demo123',
  password: 'demo123',
  name: 'Demo User',
};

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          await dbConnect();

          // For demo user
          if (credentials.username === DEMO_USER.username && 
              credentials.password === DEMO_USER.password) {
            return {
              id: 'demo',
              name: DEMO_USER.name,
              username: DEMO_USER.username,
              role: 'USER',
            };
          }

          return null;
        } catch (error) {
          console.error('Auth Error:', error);
          return null;
        }
      }
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.username = token.username;
      }
      return session;
    }
  },
  debug: process.env.NODE_ENV === 'development',
}); 