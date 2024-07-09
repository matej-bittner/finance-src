import React from "react";
import AccountPageItemSkeleton from "@/components/protected/skeletons/AccountPageItemSkeleton";

const AccountPageLoading = () => {
  return (
    <div className="flex flex-col gap-4 md:gap-6 lg:gap-8 xl:gap-10 max-w-[1260px] mx-auto">
      {"abc".split("").map((_, i) => (
        <div
          key={i}
          className="grid grid-cols-1 place-items-center gap-2 lg:grid-cols-2 px-4 min-[520px]:px-6 lg:px-2"
        >
          <AccountPageItemSkeleton />
          <AccountPageItemSkeleton />
        </div>
      ))}
    </div>
  );
};

export default AccountPageLoading;
