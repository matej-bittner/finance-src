import React from "react";

import { Skeleton } from "@/components/ui/skeleton";

const ExpensesByCategorySkeleton = ({ flat }: { flat?: boolean }) => {
  return (
    <div
      className={`${flat ? "grid grid-cols-3 max-xl:h-[110px] px-2 py-2  xl:grid-cols-1 xl:gap-2" : "grid grid-cols-1 min-[450px]:grid-cols-2 gap-2 max-w-[430px]  sm:max-w-[570px] mg:grid-cols-1 xlb:grid-cols-2  xl:h-full"} box w-full min-[330px]:w-fit mx-auto place-items-center  border-4 border-main-gray bg-transparent`}
    >
      {"abcdef".split("").map((_, i) => {
        return (
          <button
            key={i}
            className={`${flat ? "px-2 border-2 border-transparent" : "max-w-[250px]"} flex w-full items-center justify-around md:justify-between  mx-auto h-fit  p-1 rounded-md group cursor-pointer`}
          >
            <Skeleton className="w-[30px] aspect-square" />
            <div className="flex-1 pl-2 ">
              <Skeleton className="w-[130px] h-[24px]" />
            </div>
            {/*<Skeleton className="w-[30px] aspect-square" />*/}
          </button>
        );
      })}
    </div>
  );
};

export default ExpensesByCategorySkeleton;
