import React from "react";

import { Skeleton } from "@/components/ui/skeleton";

const GoalItemSkeleton = () => {
  return (
    <div className="flex aspect-square relative w-full max-w-[220px] min-[350px]:max-w-[250px] sm:max-w-[290px] ">
      <div className="w-[78%] left-[11%] h-[78%] top-[11%] absolute flex flex-col items-center py-3 justify-between">
        <div className="flex flex-col items-center flex-1 ">
          <span className="w-[65px] h-[20px]" />
          <Skeleton className="w-[35px] h-[20px]" />
          <div className="flex  flex-1 flex-col items-center justify-center">
            <Skeleton className="h-[36px] w-[60px]" />
            <span className="h-[25px] aspect-square sm:w-[55px] lg:w-[60px] "></span>
          </div>
        </div>
        <span className=" min-h-10 w-full"></span>
      </div>
      <div className="aspect-square   w-full h-full resize-none overflow-auto animate-pulse ">
        <svg viewBox={`0 0 200 200`}>
          <circle
            cx="100"
            cy="100"
            strokeWidth="13px"
            r="85"
            className="fill-none stroke-[#D9D9D9]"
          />
        </svg>
      </div>
    </div>
  );
};

export default GoalItemSkeleton;
