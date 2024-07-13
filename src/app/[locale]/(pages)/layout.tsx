import React from "react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/main/Footer";
import LanguageSelectDialog from "@/components/main/LanguageSelectDialog";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="w-full flex flex-col bg-main-bg">
      <div className="absolute bg-red-700 ">
        <LanguageSelectDialog />
      </div>
      <div className="w-full bg-main-blue h-[65px] sm:h-[75px] md:h-[85px]  border-b-white border-b-2">
        <Navbar />
      </div>
      <div id="pages" className="flex-1 w-full ">
        {children}
      </div>
      <Footer />
    </main>
  );
}
