import authConfig from "./auth.config";
import NextAuth from "next-auth";

import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "./routes";

export const { auth } = NextAuth(authConfig);
export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  /*allowed all the time, cant be protected*/
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  /*anyone can see, not authenticated, public routes*/
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  /*used for authentication ill redirect logged users to setting*/
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  /*return === do not do anything*/

  if (isApiAuthRoute) {
    return;
  }
  /*if user is logged in, thant he has no access to login/register, will be redirected to default login redirect*/
  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return;
  }

  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("auth/login", nextUrl));
  }

  return;
});
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
