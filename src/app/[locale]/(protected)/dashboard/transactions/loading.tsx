import React from "react";
import GoalItemSkeleton from "@/components/protected/skeletons/GoalItemSkeleton";
import SubscriptionItemSkeleton from "@/components/protected/skeletons/SubscriptionitemSkeleton";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { DataTable } from "@/components/protected/table/DataTable";
import { findCurrencySymbol } from "@/helpers/generalFunctions";
import { Skeleton } from "@/components/ui/skeleton";
import DataTableSkeleton from "@/components/protected/skeletons/DataTableSkeleton";

const TransactionsPageLoading = () => {
  return (
    <div className="flex flex-col  items-center gap-2">
      <Skeleton className="max-w-[250px] w-full h-[28px]" />
      <div className="w-full flex flex-col items-center xl:items-start xl:justify-center xl:gap-4 pt-2 2xl:pt-8 ">
        <div className="max-2xl:flex max-2xl:flex-col max-2xl:max-w-[800px] gap-5 w-full 2xl:grid 2xl:grid-cols-2 2xl:justify-items-center 2xl:max-w-[1560px] mx-auto 2xl:gap-y-8">
          {"abcd".split("").map((_, i) => (
            <DataTableSkeleton key={i} title />
          ))}
          <div className="flex flex-col w-full items-center gap-2 xl:mx-auto order-2  2xl:max-w-[720px] h-fit ">
            <Skeleton className="w-[100px] max-sm:text-center pb-1 2xl:pb-6 h-[28px]" />
            {/*transaction count*/}
            <div className="flex max-sm:flex-col  sm:gap-1 md:gap-4 w-full  justify-center sm:items-start items-center">
              <Skeleton className=" rounded-t-xl sm:rounded-b-xl px-4 py-2  max-sm:w-[80%] w-full  max-w-[300px] flex flex-col items-center gap-1 h-[120px]" />
              <Skeleton className=" rounded-t-xl sm:rounded-b-xl px-4 py-2  max-sm:w-[80%] w-full  max-w-[300px] flex flex-col items-center gap-1 h-[120px]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionsPageLoading;
