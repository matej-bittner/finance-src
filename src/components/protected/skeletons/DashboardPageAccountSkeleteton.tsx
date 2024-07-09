import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

const DashboardPageAccountSkeleton = () => {
  return (
    <Skeleton className="box flex flex-col gap-2 min-[450px]:gap-3 w-full max-w-[380px] border-4 border-main-gray bg-transparent ">
      <Skeleton className="h-[28px] w-full flex flex-col" />
      <Skeleton
        className={`relative min-h-[130px] md:min-h-[110px]  flex flex-col rounded-xl min-[450px]:rounded-2xl py-2 px-1 `}
      />
    </Skeleton>
  );
};

export default DashboardPageAccountSkeleton;
