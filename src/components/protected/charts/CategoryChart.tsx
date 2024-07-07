"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { findCurrencySymbol } from "@/helpers/generalFunctions";

interface CategoryChartProps {
  data: { date: Date; totalAmount: number }[];
  selectedCurrencyLabel: string;
  usedCurrencies: string[];
}
const CategoryChart = ({
  data,
  selectedCurrencyLabel,
  usedCurrencies,
}: CategoryChartProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("chart");
  function setCurrency(currency: string) {
    const params = new URLSearchParams(searchParams);
    params.set("currency", currency);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  const currencySymbol = findCurrencySymbol(selectedCurrencyLabel);

  const locale = useLocale();
  const formatNumber = (number: number) => {
    return new Intl.NumberFormat(locale, { notation: "compact" }).format(
      number,
    );
  };

  const existsAnyTotalAmount = data.some((o) => o.totalAmount > 0);

  return (
    <div className="w-full  box h-[300px] border-2 border-black flex flex-col ">
      {usedCurrencies.length > 0 ? (
        <div className="flex w-full   justify-end gap-2 px-2">
          {usedCurrencies.length > 1 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="bg-[#BBBBBB] font-medium py-1 px-2 rounded-md">
                  {currencySymbol}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="min-w-0 bg-[#BBBBBB]/20 border-0">
                {usedCurrencies.map((usedCurr) => {
                  return (
                    <DropdownMenuItem
                      className={`${usedCurr === selectedCurrencyLabel && "hidden"} hover:bg-[#BBBBBB]/60 focus:bg-[#BBBBBB]/60`}
                      onClick={() => setCurrency(usedCurr)}
                      key={usedCurr}
                    >
                      {findCurrencySymbol(usedCurr)}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      ) : (
        <div className="w-full h-[32px]"></div>
      )}
      <div className="flex flex-grow pr-2">
        <ResponsiveContainer width="100%" height="100%">
          {!existsAnyTotalAmount ? (
            <div className="w-full h-full flex items-center justify-center  text-center">
              {t("no-data")}
            </div>
          ) : (
            <BarChart width={500} height={200} data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" stroke="#000" fontSize="13" />
              <YAxis
                fontSize="13"
                tickFormatter={(tick) =>
                  formatNumber(tick) + " " + currencySymbol
                }
                stroke="#000"
              />
              <Tooltip
                formatter={(value: number) =>
                  new Intl.NumberFormat().format(value) + " " + currencySymbol
                }
                contentStyle={{
                  backgroundColor: "rgba(187, 187, 187, 0.8)",
                  borderRadius: "10px",
                  border: "2px solid #E0E0E0",
                }}
              />

              <Bar
                dataKey="totalAmount"
                fill="#000080"
                name={t("total-amount")}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CategoryChart;
