import React from "react";

import { Skeleton } from "@/components/ui/skeleton";

const DataTableSkeleton = ({
  full_width,
  title,
}: {
  full_width?: boolean;
  title?: boolean;
}) => {
  return (
    <div
      className={`px-2 overflow-auto w-full space-y-1 2xl:space-y-6 ${!full_width && "2xl:max-w-[720px]"}`}
    >
      {title && <Skeleton className="max-tb:text-center w-[100px] h-[28px]" />}
      <div className="flex flex-col w-full gap-1">
        <Skeleton className="w-full h-[28px] rounded-full" />
        {"abcd".split("").map((_, i) => (
          <Skeleton key={i} className="w-full rounded-full h-[41px]" />
        ))}
      </div>
    </div>
  );
};

export default DataTableSkeleton;
