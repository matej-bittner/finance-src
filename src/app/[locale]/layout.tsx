import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import React from "react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
const manrope = Manrope({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Wallet Recap",
  description: "Manage your money - effortlessly.",
  twitter: {
    card: "summary_large_image",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_APP_URL}/opengraph-image.png`,
        width: 1200,
        height: 630,
      },
    ],
  },
  openGraph: {
    title: "Wallet Recap",
    description: "Manage your money - effortlessly.",
    type: "website",
    url: `${process.env.NEXT_PUBLIC_APP_URL}`,
    siteName: "WalletRecap",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_APP_URL}/opengraph-image.png`,
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default async function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const messages = await getMessages();
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <html lang={locale}>
        <body className={`${manrope.className}`}>
          <NextIntlClientProvider messages={messages}>
            {children}
            <Analytics />
            <SpeedInsights />
          </NextIntlClientProvider>
        </body>
      </html>
    </SessionProvider>
  );
}
