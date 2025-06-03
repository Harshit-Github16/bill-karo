import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Demo user credentials check
        if (credentials.username === "demo123" && credentials.password === "demo123") {
          return {
            id: 1,
            name: "Demo User",
            email: "demo@billkaro.com",
            role: "demo"
          };
        }
        return null;
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET || "NEXTAUTH_SECRET",
  pages: {
    signIn: '/login'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role;
      }
      return session;
    }
  }
}); 