import React from "react";

import AccountInfoDisplay from "@/components/protected/dashboard/AccountInfoDisplay";
import UpcomingPayments from "@/components/protected/dashboard/UpcomingPayments";
import ExpensesByCategory from "@/components/protected/dashboard/ExpensesByCategory";
import Image from "next/image";
import {
  currentUser,
  dashboardTransactions,
  userAccounts,
  userPeriodicPayments,
} from "@/helpers/current-user";
import { convertCurrency } from "@/app/api/convert-currency/route";
import Link from "next/link";
import { currencies } from "@/constants";
import { getTranslations } from "next-intl/server";
import ChartOne from "@/components/protected/charts/ChartOne";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { eachDayOfInterval, interval } from "date-fns";
import { UserAccount } from "@/types";

const DashboardPage = async () => {
  const t = await getTranslations("dashboard");

  const accountsNew = await userAccounts();
  const user = await currentUser();
  const userCurrencyConvert = await convertCurrency(user?.mainCurrency);
  const upcomingPaymentsData = await userPeriodicPayments();
  const userTransactionsLimited = await dashboardTransactions();
  const mainCurrency = user?.mainCurrency;

  const currentAndSavingsAccounts = accountsNew
    .filter((account) => account.type === 1 || account.type === 3)
    .sort((a, b) => a.type - b.type);
  const creditAccounts = accountsNew.filter((account) => account.type === 2);
  const investAccounts = accountsNew.filter((account) => account.type === 4);

  // const getData = async (
  //   createdAfter: Date | null,
  //   createdBefore: Date | null,
  // ) => {
  //   const createdAtQuery: Prisma.TransactionWhereInput["date"] = {};
  //   if (createdAfter) createdAtQuery.gte = createdAfter;
  //   if (createdBefore) createdAtQuery.lte = createdBefore;
  //
  //   const chartData = await db.transaction.findMany({
  //     select: { date: true, amount: true },
  //     where: { transactionType: { not: 3 } },
  //     orderBy: { date: "asc" },
  //   });
  //
  //   const dayArray = eachDayOfInterval(
  //     interval(createdAfter || chartData[0].date, createdBefore || new Date()),
  //   ).map((day) => {
  //     return { date: 0, totalSales: 0 };
  //   });
  // };
  return (
    <div
      id="dashboard"
      // className="px-2 flex max-lg:flex-col items-center lg:items-start  gap-2 sm:gap-4 2xl:gap-8  xl:justify-center bg-red-300 "
      className="px-2 flex max-lg:flex-col   gap-2 sm:gap-4 2xl:gap-8  xl:justify-center  "
    >
      {/*hidden transaction till 1800px*/}
      <div className="hidden min-[1800px]:flex  w-[300px] flex-col  gap-y-8">
        <div className="w-full flex flex-col space-y-4">
          <h2 className="max-sm:text-center  lg:text-center text-transparent">
            xx
          </h2>
          <div className="box h-[170px] shadow-[0_3px_10px_rgb(0,0,0,0.2)]"></div>
        </div>
        <div className="w-full flex flex-col space-y-4 flex-1 ">
          <h2 className="max-sm:text-center  lg:text-center">
            {t(`last-transaction`)}
          </h2>
          <div className="box flex flex-col h-full shadow-[0_3px_10px_rgb(0,0,0,0.2)] ">
            {userTransactionsLimited.map((tran, i) => {
              return (
                <div key={i} className="py-1">
                  <div className="flex w-full py-1 text-sm">
                    <p className="min-w-[40px]">
                      {new Intl.DateTimeFormat("default", {
                        day: "numeric",
                        month: "numeric",
                      }).format(tran.date)}
                    </p>
                    <p className="flex-1 text-center font-medium ">
                      {tran.name}
                    </p>
                    <div className="flex items-start font-medium gap-2">
                      <Image
                        src={
                          tran.accountFromId && tran.accountToId
                            ? "/icons/transaction-swap.svg"
                            : tran.accountFromId
                              ? "/icons/transaction-send.svg"
                              : "/icons/transaction-received.svg"
                        }
                        alt="transaction type"
                        width={20}
                        height={20}
                      />
                      <p
                        className={`min-w-[60px] text-right ${
                          tran.accountFromId && tran.accountToId
                            ? ""
                            : tran.accountFromId
                              ? "text-main-error"
                              : "text-main-success"
                        }`}
                      >
                        {Intl.NumberFormat().format(tran.amount)}{" "}
                        {
                          currencies.find(
                            (item) => item.value === tran.currency,
                          )?.symbol
                        }
                      </p>
                    </div>
                  </div>
                  <hr className="w-[90%] mx-auto border-black" />
                </div>
              );
            })}
            <Link
              href="/"
              className="underline text-sm text-center flex-1 flex items-end justify-center pb-2 "
            >
              {t(`show-more`)}
            </Link>
          </div>
        </div>
      </div>
      {/*left*/}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 place-items-center justify-items-center w-full lg:max-w-[400px] xl:max-w-[420px] sm:gap-x-2 gap-y-3 sm:gap-y-4 2xl:gap-y-8">
        {/*accounts*/}
        <div className="flex flex-col w-full sm:col-span-2 space-y-2  xl:space-y-4">
          <h2 className="max-sm:text-center lg:text-center">
            {t(`total-value`)}
          </h2>
          <div className="grid grid-cols-1 w-full place-items-center sm:grid-cols-2 lg:grid-cols-1 sm:gap-x-2 gap-y-3 sm:gap-y-4 2xl:gap-y-8">
            <AccountInfoDisplay
              data={currentAndSavingsAccounts}
              type="account"
              currency={mainCurrency}
              userCurrencyConvert={userCurrencyConvert}
            />
            <AccountInfoDisplay
              data={investAccounts}
              type="investment"
              currency={mainCurrency}
              userCurrencyConvert={userCurrencyConvert}
            />
          </div>
        </div>
        {/*debt*/}
        <div className="flex flex-col w-full items-center space-y-2  xl:space-y-4">
          <h2 className="sm:text-left sm:w-full lg:text-center ">
            {t(`loan`)}
          </h2>
          <AccountInfoDisplay
            data={creditAccounts}
            type="debt"
            currency={mainCurrency}
            userCurrencyConvert={userCurrencyConvert}
          />
        </div>
        {/*upcoming payments*/}
        <div className="lg:hidden w-full flex flex-col items-center justify-center place-self-start space-y-2  xl:space-y-4">
          <h2 className="sm:text-left sm:w-full lg:text-center ">
            {t(`upcoming-payment`)}
          </h2>
          <UpcomingPayments data={upcomingPaymentsData} />
        </div>
      </div>
      {/*right*/}
      <div className="max-lg:flex w-full max-md:flex-col items-center md:items-start lg:items-center xl:grid xl:grid-cols-2 xl:max-w-[850px] space-y-3 sm:gap-x-2 sm:space-y-4 xl:space-y-0 xl:gap-4 2xl:gap-8 xl:items-start ">
        {/*upcoming payments*/}
        <div className="max-lg:hidden flex flex-col items-center justify-center space-y-2  xl:space-y-4">
          <h2 className="sm:text-left sm:w-full lg:text-center ">
            {t(`upcoming-payment`)}
          </h2>
          <UpcomingPayments data={upcomingPaymentsData} />
        </div>
        {/*categories*/}
        <div className="w-full md:max-w-[210px] lg:max-w-[400px] lg:mx-auto xl:h-full flex flex-col space-y-2  xl:space-y-4">
          <h2 className="text-center">{t(`category`)}</h2>
          <ExpensesByCategory />
          {/*<ExpensesByCategory data={categories} />*/}
        </div>
        {/*comparasion*/}
        <div className="flex flex-col w-full lg:col-span-2 space-y-2 xl:space-y-4 xl:h-full">
          <h2 className="text-center">{t(`graph`)}</h2>
          <div className="box w-full h-[300px] xl:flex-grow shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
            {/*<ChartOne*/}
            {/*  data={[*/}
            {/*    { date: "hi", totalSales: 12 },*/}
            {/*    { date: "bye", totalSales: 10 },*/}
            {/*  ]}*/}
            {/*/>*/}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
