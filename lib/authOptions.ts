import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { providers } from "@/utils/AuthProviders";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      image?: string | null;
      name?: string | null;
      id?: string;
    };
  }

  interface User {
    id?: string;
    image?: string | null;
  }
}

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/auth/signin",
  },
  providers,
  adapter: PrismaAdapter(prisma),
  callbacks: {
    async signIn({ user, account, profile }) {
      const existingUser = await prisma.user.findUnique({
        where: { id: user.id },
      });
      if (!existingUser) {
        const githubProfile = profile as { avatar_url?: string };

        const newUser = await prisma.user.create({
          data: {
            id: user.id,
            email: user.email,
            name: user?.name || null,
            image: (githubProfile?.avatar_url as unknown as string) || null,
          },
        });
        if (account) {
          await prisma.account.create({
            data: {
              userId: newUser.id,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              type: account.type,
              access_token: account.access_token,
              refresh_token: account.refresh_token,
            },
          });
        }
      } else {
      }
      if (profile?.image) {
        await prisma.user.update({
          where: { id: user.id },
          data: { image: profile.image.link as unknown as string },
        });
      }
      console.log("signin completed!");

      return true;
    },
    async session({ session, user }) {
      const userFromDb = await prisma.user.findUnique({
        where: { id: user.id },
        select: { image: true },
      });
      session.user.image = userFromDb?.image || null;
      console.log("user", user);
      return session;
    },
  },
};
