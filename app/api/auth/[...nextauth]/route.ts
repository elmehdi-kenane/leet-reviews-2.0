import NextAuth, { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { providers } from "@/utils/AuthProviders";

// Initialize Prisma Client
const prisma = new PrismaClient();

// NextAuth configuration
const options: NextAuthOptions = {
  pages: {
    signIn: "/auth/signin",
  },
  providers,
  adapter: PrismaAdapter(prisma),
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("OAuth URL generated:", account?.authorizationUrl);
      console.log("42-School OAuth Callback triggered:", {
        user,
        account,
        profile,
      });
      return true;
    },
    // async session({ session, token }) {
    //   session.accessToken = token.accessToken;
    //   return session;
    // },
  },
};

// Define the NextAuth handler
const handler = NextAuth(options);

// Export handler for API routes
export { handler as GET, handler as POST };
