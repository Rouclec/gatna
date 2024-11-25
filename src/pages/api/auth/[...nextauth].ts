// pages/api/auth/[...nextauth].ts
import { User } from "@/src/models";
import dbConnect from "@/src/util/db";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "your-email@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Connect to the database
        await dbConnect();

        if (!credentials) {
          throw "No credentials provided";
        }

        // Find user in database
        const user = await User.findOne({ email: credentials.email }).select(
          "+password"
        );

        // Verify password
        const isValid = await user.comparePassword(credentials.password);
        if (!isValid || !user) {
          throw "Incorrect email and password combination";
        }

        // Return user object on successful authentication
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.firstName,
          role: user.role.code,
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
  },
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  debug: true,
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
