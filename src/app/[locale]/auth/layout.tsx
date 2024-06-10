import React from "react";
import Navbar from "@/components/navbar/Navbar";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className=" flex flex-col bg-main-bg h-full">
      <div className="w-full bg-main-blue h-[65px] sm:h-[75px] md:h-[85px]  border-b-white border-b-2">
        <Navbar />
      </div>
      <div id="auth" className="flex-1 w-full">
        {children}
      </div>
    </section>
  );
}
