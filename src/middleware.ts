import createIntlMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

import {
  DEFAULT_LOGIN_REDIRECT,
  authRoutes,
  publicRoutes,
  selectSubscriptionRoutes,
} from "./routes";
import { useLocale } from "next-intl";

const locales = ["en", "cs"];

const testPathnameRegex = (pages: string[], pathName: string): boolean => {
  return RegExp(
    `^(/(${locales.join("|")}))?(${pages.flatMap((p) => (p === "/" ? ["", "/"] : p)).join("|")})/?$`,
    "i",
  ).test(pathName);
};

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale: "en",
});

const authMiddleware = auth((req) => {
  const isAuthPage = testPathnameRegex(authRoutes, req.nextUrl.pathname);
  const isSubscriptionPage = testPathnameRegex(
    selectSubscriptionRoutes,
    req.nextUrl.pathname,
  );
  const session = req.auth;

  // Redirect to sign-in page if not authenticated
  if (!session && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (session && !session.user.hasAccess && !isSubscriptionPage) {
    return NextResponse.redirect(new URL("/subscription-select", req.nextUrl));
  }

  if (session && session.user.hasAccess && isSubscriptionPage) {
    return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, req.nextUrl));
  }

  // Redirect to home page if authenticated and trying to access auth pages
  if (session && isAuthPage) {
    return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, req.nextUrl));
  }

  return intlMiddleware(req);
});

const middleware = (req: NextRequest) => {
  const isPublicPage = testPathnameRegex(publicRoutes, req.nextUrl.pathname);
  const isAuthPage = testPathnameRegex(authRoutes, req.nextUrl.pathname);

  // if (req.nextUrl.pathname.startsWith("/api/")) {
  //   // console.log("Bypassing API route");
  //   return NextResponse.next();
  // }

  if (isAuthPage) {
    return (authMiddleware as any)(req);
  }
  if (isPublicPage) {
    return intlMiddleware(req);
  } else {
    return (authMiddleware as any)(req);
  }
};

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};

export default middleware;
