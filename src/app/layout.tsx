import React from "react";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Wallet Recap",
  description: "Manage your money - effortlessly.",
  twitter: {
    card: "summary_large_image",
  },
  openGraph: {
    images: "/opengraph-image.png",
  },
};
const ErrorLayout = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export default ErrorLayout;
