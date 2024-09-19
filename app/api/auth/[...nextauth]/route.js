import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import NextAuth from "next-auth";

import GitHubProvider from "next-auth/providers/github";
import FortyTwoProvider from "next-auth/providers/42-school";


const prisma = new PrismaClient();

 const handler = NextAuth({
   providers: [
     GitHubProvider({
       clientId: process.env.GITHUB_CLIENT_ID,
       clientSecret: process.env.GITHUB_CLIENT_SECRET,
     }),
     FortyTwoProvider({
       clientId: process.env.FORTY_TWO_CLIENT_ID,
       clientSecret: process.env.FORTY_TWO_CLIENT_SECRET,
     }),
   ],
   adapter: PrismaAdapter(prisma),
 });

export { handler as GET, handler as POST };
