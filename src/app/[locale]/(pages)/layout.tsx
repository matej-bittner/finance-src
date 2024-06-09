import React from "react";
import Navbar from "@/components/navbar/Navbar";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="w-full flex flex-col bg-main-bg">
      <div className="w-full bg-main-blue h-[65px] sm:h-[75px] md:h-[85px]  border-b-white border-b-2">
        <Navbar />
      </div>
      <div className="flex-1 w-full">{children}</div>
    </main>
  );
}
