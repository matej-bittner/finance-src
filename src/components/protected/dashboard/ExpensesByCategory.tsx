"use client";
import React from "react";
import Image from "next/image";
import { categories } from "@/constants";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { findCurrencySymbol } from "@/helpers/generalFunctions";

interface ExpensesByCategoryProps {
  flat?: boolean;
  mainCurrency?: string;
  usedCategoryId?: number;
  data?: {
    category: number;
    amount: number;
  }[];
}
const ExpensesByCategory = ({
  flat,
  data,
  mainCurrency,
  usedCategoryId,
}: ExpensesByCategoryProps) => {
  const t = useTranslations("category");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  function setCategory(categoryValue: number) {
    if (!flat) {
      const params = new URLSearchParams(searchParams);
      params.set("category", categoryValue.toString());

      router.push(`${pathname}/categories?${params.toString()}`, {
        scroll: false,
      });
    } else {
      const params = new URLSearchParams(searchParams);
      params.set("category", categoryValue.toString());
      params.delete("currency");
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }

  return (
    <div
      className={`${flat ? "grid grid-cols-3 max-xl:h-[110px] px-2 py-2  xl:grid-cols-1 xl:gap-2" : "grid grid-cols-1 min-[450px]:grid-cols-2 gap-2 max-w-[430px]  sm:max-w-[570px] mg:grid-cols-1 xlb:grid-cols-2  xl:h-full"} box w-full min-[330px]:w-fit mx-auto place-items-center   shadow-[0_3px_10px_rgb(0,0,0,0.2)]`}
    >
      {/*<div className="box w-full mx-auto grid grid-cols-1 min-[450px]:grid-cols-2 gap-2 max-w-[430px] sm:grid-cols-3 sm:max-w-[570px] md:grid-cols-1 lg:grid-cols-2 xl:h-full shadow-[0_3px_10px_rgb(0,0,0,0.2)] place-items-center">*/}
      {categories.map((item) => {
        const findAmount = data?.find((match) => match.category === item.id);
        const amount = findAmount
          ? Intl.NumberFormat().format(findAmount.amount)
          : "";

        return (
          <button
            onClick={() => setCategory(item.id)}
            key={item.id}
            className={`   ${flat ? "px-2 border-2" : "max-w-[250px]"} ${usedCategoryId === item.id ? "border-black/60 bg-black/5" : "border-transparent"}  flex w-full items-center justify-around md:justify-between  mx-auto h-fit  p-1 rounded-md group cursor-pointer`}
          >
            <Image
              src={`/category-icons/${item.icon}.svg`}
              alt={item.icon}
              width={30}
              height={30}
              // className={`${Number(searchParams.get("category")) === item.id && "invert"}`}
            />
            <div className="flex-1 pl-2 text-left">
              <p className="font-semibold">{t(item.value)}</p>
              {!flat && amount && mainCurrency && (
                <p className="text-sm">
                  {amount + " " + findCurrencySymbol(mainCurrency)}
                </p>
              )}
            </div>
            <Image
              src="/icons/expand-right.svg"
              alt="show more"
              width={30}
              height={30}
              className={`group-hover:scale-110 origin-center transition-all duration-300`}
              // className={`${Number(searchParams.get("category")) === item.id && "invert"} group-hover:scale-110 origin-center transition-all duration-300`}
            />
          </button>
        );
      })}
    </div>
  );
};

export default ExpensesByCategory;
