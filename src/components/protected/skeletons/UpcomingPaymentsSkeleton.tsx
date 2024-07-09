import React from "react";

import { Skeleton } from "@/components/ui/skeleton";

const UpcomingPaymentsSkeleton = () => {
  return (
    <div className="box flex flex-col gap-2 min-[450px]:gap-3 w-full max-w-[380px] border-4 border-main-gray bg-transparent">
      {"ab".split("").map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="flex items-center">
            <Skeleton className="flex flex-col items-center justify-around rounded-md  bg-[#B1B1B1]/40  aspect-[4/5] h-[50px]" />
            <div className="flex flex-col flex-1 pl-2 min-[350px]:pl-4 min-[400px]:pl-5 sm:pl-2">
              <Skeleton className="w-full h-[40px]" />
            </div>
          </div>
        </div>
      ))}
      <Skeleton className="w-[80px] h-[20px] mx-auto" />
    </div>
  );
};

export default UpcomingPaymentsSkeleton;
