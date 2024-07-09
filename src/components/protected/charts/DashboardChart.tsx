"use client";
import React, { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RANGE_OPTIONS } from "@/schemas/rangeOptions";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { findCurrencySymbol } from "@/helpers/generalFunctions";

interface ChartOneProps {
  data: { date: string; income: number; expense: number }[];
  queryRangeKey: string;
  queryCurrencyKey: string;
  selectedRange?: string;
  // selectedRangeLabel: string;
  selectedCurrencyLabel: string;
  usedCurrencies: string[];
}

const DashboardChart = ({
  data,
  queryRangeKey,
  selectedRange,
  // selectedRangeLabel,
  usedCurrencies,
  queryCurrencyKey,
  selectedCurrencyLabel,
}: ChartOneProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("chart");

  function setRange(range: keyof typeof RANGE_OPTIONS) {
    const params = new URLSearchParams(searchParams);
    params.set(queryRangeKey, range);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }
  function setCurrency(currency: string) {
    const params = new URLSearchParams(searchParams);
    params.set(queryCurrencyKey, currency);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  const currencySymbol = findCurrencySymbol(selectedCurrencyLabel);

  const locale = useLocale();
  const formatNumber = (number: number) => {
    return new Intl.NumberFormat(locale, { notation: "compact" }).format(
      number,
    );
  };

  return (
    <div className="w-full  box h-[450px] shadow-[0_3px_10px_rgb(0,0,0,0.2)] flex flex-col ">
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
                {usedCurrencies.map((usedCurr) => (
                  <DropdownMenuItem
                    className={`${usedCurr === selectedCurrencyLabel && "hidden"} hover:bg-[#BBBBBB]/60 focus:bg-[#BBBBBB]/60`}
                    onClick={() => setCurrency(usedCurr)}
                    key={usedCurr}
                  >
                    {findCurrencySymbol(usedCurr)}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="bg-[#BBBBBB] font-medium py-1 px-2 rounded-md">
                {selectedRange ? t(selectedRange) : t("last_7_days")}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#BBBBBB]/20 border-0">
              {Object.entries(RANGE_OPTIONS).map(([key]) => (
                <DropdownMenuItem
                  className={`${selectedRange ? selectedRange === key && "hidden" : key === "last_7_days" && "hidden"} hover:bg-[#BBBBBB]/60 focus:bg-[#BBBBBB]/60`}
                  onClick={() => setRange(key as keyof typeof RANGE_OPTIONS)}
                  key={key}
                >
                  {t(key)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <div className="w-full h-[32px]"></div>
      )}
      <div className="flex flex-grow pr-2">
        <ResponsiveContainer width="100%" height="100%">
          {data.length === 0 ? (
            <div className="w-full h-full flex items-center justify-center">
              {t("no-data")}
            </div>
          ) : (
            <BarChart
              width={500}
              height={200}
              data={data}
              style={{ transform: "translate(0px, 24px)" }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" stroke="#000" fontSize="13" />
              <YAxis
                fontSize="13"
                // tickFormatter={(tick) =>
                //   formatNumber(tick) + " " + currencySymbol
                // }
                tickFormatter={(tick) => formatNumber(tick)}
                // width={80}
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
              <Legend wrapperStyle={{ top: -30, left: -40 }} />
              <Bar dataKey="income" fill="#000080" name={t("income")} />
              <Bar dataKey="expense" fill="#AC0101" name={t("expense")} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardChart;
