import React, { Suspense } from "react";
import { userAccounts } from "@/helpers/current-user";
import AccountItem from "@/components/protected/AccountItem";
import AccountPageItemSkeleton from "@/components/protected/skeletons/AccountPageItemSkeleton";

const AccountsPage = async () => {
  const accounts = await userAccounts();
  const currentAndSavingsAccounts = accounts
    .filter((account) => account.type === 1 || account.type === 3)
    .sort((a, b) => a.type - b.type);
  const creditAccounts = accounts.filter((account) => account.type === 2);
  const investAccounts = accounts.filter((account) => account.type === 4);

  return (
    <div className="flex flex-col gap-4 md:gap-6 lg:gap-8 xl:gap-10 max-w-[1260px] mx-auto">
      <div className="grid grid-cols-1 place-items-center gap-2 lg:grid-cols-2 px-4 min-[520px]:px-6 lg:px-2">
        {currentAndSavingsAccounts.map((acc, i) => (
          <AccountItem key={i} data={acc} />
        ))}
      </div>
      <div className="grid grid-cols-1 place-items-center gap-2 lg:grid-cols-2 px-4 min-[520px]:px-6 lg:px-2">
        {creditAccounts.map((acc, i) => (
          <AccountItem key={i} data={acc} />
        ))}
      </div>
      <div className="grid grid-cols-1 place-items-center gap-2 lg:grid-cols-2 px-4 min-[520px]:px-6 lg:px-2">
        {investAccounts.map((acc, i) => (
          <AccountItem key={i} data={acc} />
        ))}
      </div>
    </div>
  );
};

export default AccountsPage;
