import React from "react";

import { Skeleton } from "@/components/ui/skeleton";

const SubscriptionItemSkeleton = () => {
  return (
    <div className=" relative w-full max-w-[90%] h-fit rounded-2xl flex flex-col px-4 py-2 gap-2 sm:py-3 sm:rounded-xl sm:gap-3 tb:max-w-[500px] md:max-w-[750px] md:px-6 2xl:h-full 2xl:justify-center border-4 border-main-gray bg-transparent">
      <div className="flex max-[350px]:flex-col w-full gap-2 max-[350px]:items-center justify-around sm:max-w-[90%] sm:mx-auto md:max-w-full md:gap-6">
        <div className="max-sm:w-[30%] min-w-fit flex items-center justify-center max-[350px]:order-2">
          <Skeleton className="w-[70px] h-[27px] sm:hidden" />
          <Skeleton className="hidden sm:flex flex-col items-center justify-center gap-2 rounded-md bg-[#B1B1B1]/40 aspect-[4/5] h-[80px] md:min-h-[100px]" />
        </div>
        <div className="flex gap-1 min-[500px]:w-[250px] sm:w-full items-center sm:justify-around md:gap-4 ">
          <div className="flex flex-col gap-1 sm:flex-1 ">
            <Skeleton className="w-[70px] h-[28px]" />
            <Skeleton className="w-[90px] h-[20px] lg:w-[100px] lg:h-[24px] " />
            <Skeleton className="w-[90px] h-[20px] lg:w-[100px] lg:h-[24px] " />
            <Skeleton className="w-[90px] h-[20px]  sm:hidden" />
          </div>
          <Skeleton className="w-[80px] h-[44px] max-sm:hidden rounded-xl py-2 px-3  lg:px-4 " />
        </div>
      </div>
    </div>
  );
};

export default SubscriptionItemSkeleton;
