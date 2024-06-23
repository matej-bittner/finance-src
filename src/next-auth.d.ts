import NextAuth, { type DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  mainCurrency: any;
  mainLanguage: any;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}
