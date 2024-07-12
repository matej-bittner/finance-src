import NextAuth from "next-auth";

import authConfig from "@/auth.config";
import { db } from "@/lib/db";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { getUserById } from "@/data/user";
import { getAccountByUserId } from "@/data/account";

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/login",
    error: "/error",
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      //no verified email = no login on credentials
      if (account?.provider !== "credentials") return true;
      if (!user.id) return false;

      const existingUser = await getUserById(user.id);

      if (!existingUser?.emailVerified) return false;

      return true;
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.mainCurrency && session.user) {
        session.user.mainCurrency = token.mainCurrency;
      }

      if (token.mainLanguage && session.user) {
        session.user.mainLanguage = token.mainLanguage;
      }
      if (token.email && session.user) {
        session.user.email = token.email;
      }
      if (session.user) {
        session.user.name = token.name;
        session.user.isOAuth = token.isOAuth as boolean;
        session.user.hasAccess = token.hasAccess as boolean;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      const existingAccount = await getAccountByUserId(existingUser.id);

      token.isOAuth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.mainCurrency = existingUser.mainCurrency;
      token.mainLanguage = existingUser.mainLanguage;
      token.hasAccess = existingUser.hasAccess;

      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
