import React from "react";
import Navbar from "@/components/protected/navbar/Navbar";
import Sidebar from "@/components/protected/navbar/Sidebar";
import { Toaster } from "@/components/ui/toaster";
import { currentUser, userAccounts } from "@/helpers/current-user";
import { UserAccount } from "@/types";

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await currentUser();
  const allUserAccounts: UserAccount = await userAccounts();

  return (
    <main id="protected" className="flex  relative w-full ">
      <Sidebar />
      <div className="flex-1 w-full bg-main-bg space-y-2 limited-width-big  min-h-screen">
        <Navbar
          userAccounts={allUserAccounts}
          defaultCurrency={user?.mainCurrency}
        />
        {children}
        <Toaster />
      </div>
    </main>
  );
}
