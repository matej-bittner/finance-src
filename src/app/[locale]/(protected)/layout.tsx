import React from "react";
import Navbar from "@/components/protected/navbar/Navbar";
import Sidebar from "@/components/protected/navbar/Sidebar";

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main id="protected" className="flex  relative w-full bg-orange-400">
      <Sidebar />
      <div className="flex-1 w-full bg-main-bg space-y-2 limited-width-big  min-h-screen">
        <Navbar />

        {children}
      </div>
    </main>
  );
}
