import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Hardcoded demo user check
        if (credentials.username === "demo123" && credentials.password === "demo123") {
          return {
            id: "1",
            name: "Demo User",
            email: "demo@billkaro.com"
          };
        }
        return null;
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET || 'your-super-secret-key-here-minimum-32-chars',
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
      }
      return session;
    }
  }
};

export default NextAuth(authOptions); 