import React from "react";

import { Skeleton } from "@/components/ui/skeleton";

const AccountPageItemSkeleton = () => {
  return (
    <Skeleton className="w-full flex flex-col justify-between p-2 min-[520px]:p-4 rounded-xl mx-auto gap-2 max-w-[600px] border-4 border-main-gray bg-transparent">
      {/*<div className="w-full flex flex-col justify-between p-2 min-[520px]:p-4 bg-main-gray rounded-xl mx-auto gap-2 max-w-[600px] shadow-[0_3px_10px_rgb(0,0,0,0.2)]">*/}
      <div className="flex max-[520px]:flex-col gap-4 px-2">
        <div className="flex flex-col flex-1 gap-1 max-[520px]:items-center ">
          <Skeleton className="h-[24px] w-[90px]" />
          <Skeleton className="h-[24px] w-[80px]" />
          <Skeleton className="h-[24px] w-[180px]" />
        </div>
        <div className="flex flex-col items-center text-center justify-center min-[520px]:pl-2">
          <Skeleton className="h-[48px] w-[80px]" />
        </div>
      </div>

      <Skeleton className="w-full py-1.5 h-[36px]" />
    </Skeleton>
  );
};

export default AccountPageItemSkeleton;
