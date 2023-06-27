import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { cookies } from "next/headers";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        username: {
          label: "username",
          type: "text",
          placeholder: "jsmith"
        },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { username, password } = credentials as any;

        const res = await fetch(`${process.env.API_URL}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            username,
            password
          })
        });

        const { user } = await res.json();

        if (res.ok && user) {
          return user;
        } else {
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/login"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.token;
        cookies().set("auth-access-token", user.token);
      }

      return token;
    },
    async session({ session, token }) {
      session.user.accessToken = token.accessToken as string;

      return session;
    }
  }
});

export { handler as GET, handler as POST };
