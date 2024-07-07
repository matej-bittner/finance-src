import React from "react";

import AccountInfoDisplay from "@/components/protected/dashboard/AccountInfoDisplay";
import UpcomingPayments from "@/components/protected/dashboard/UpcomingPayments";
import ExpensesByCategory from "@/components/protected/dashboard/ExpensesByCategory";
import Image from "next/image";
import {
  currentUser,
  dashboardTransactions,
  getAllUsedCurrencies,
  getDataByCategory,
  getGraphData,
  userAccounts,
  userPeriodicPayments,
} from "@/helpers/current-user";
import { convertCurrency } from "@/app/api/convert-currency/route";
import Link from "next/link";
import { currencies } from "@/constants";
import { getTranslations } from "next-intl/server";
import DashboardChart from "@/components/protected/charts/DashboardChart";

import { getRangeOption, RANGE_OPTIONS } from "@/schemas/rangeOptions";
import { findCurrencySymbol } from "@/helpers/generalFunctions";

const DashboardPage = async ({
  // searchParams: { dashboardGraph },
  searchParams: { mainChartRange, mainChartCurrency },
}: {
  searchParams: { mainChartRange?: string; mainChartCurrency?: string };
}) => {
  const [
    allUsedCurrenciesOnTransactions,
    accountsNew,
    user,
    upcomingPaymentsData,
    userTransactionsLimited,
    expensesByCategoryData,
    t,
  ] = await Promise.all([
    getAllUsedCurrencies(),
    userAccounts(),
    currentUser(),
    userPeriodicPayments(),
    dashboardTransactions(),
    getDataByCategory(),
    getTranslations("dashboard"),
  ]);

  const userCurrencyConvert = await convertCurrency(user?.mainCurrency);
  const mainCurrency = user?.mainCurrency;

  const graphDataRangeOption =
    getRangeOption(mainChartRange) || RANGE_OPTIONS.last_7_days;

  const graphCurrencyExist = allUsedCurrenciesOnTransactions.find(
    (cur) => cur === mainChartCurrency,
  )
    ? mainChartCurrency
    : undefined;

  const graphData = await getGraphData(
    graphDataRangeOption.startDate,
    graphDataRangeOption.endDate,
    graphCurrencyExist,
  );

  const currentAndSavingsAccounts = accountsNew
    .filter((account) => account.type === 1 || account.type === 3)
    .sort((a, b) => a.type - b.type);
  const creditAccounts = accountsNew.filter((account) => account.type === 2);
  const investAccounts = accountsNew.filter((account) => account.type === 4);

  return (
    <div id="dashboard" className="flex min-[1680px]:gap-6 justify-center">
      {/*main content*/}
      <div className="w-full flex flex-col items-center max-w-[1230px] gap-y-3 mg:gap-y-4 ">
        {/*accounts*/}
        <div className="grid grid-cols-1 w-full max-sm:max-w-[95%] mg:grid-cols-2 xlb:flex gap-y-3 ">
          {/*acounts + savings*/}
          <div className="flex flex-col w-full xlb:w-2/3 xlb:max-w-[820px] max-xlb:items-center">
            <h2 className="pb-1 mg:pb-2">{t(`accounts`)}</h2>
            <div className="flex max-xlb:flex-col w-full gap-y-2  mg:h-full mg:justify-between items-center xlb:items-start ">
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
          <div className="xlb:w-1/3 flex flex-col   xlb:max-w-[410px] max-xlb:items-center mg:gap-y-3">
            <div className="max-w-[380px] flex flex-col items-center max-xlb:mx-auto w-full xlb:ml-auto xlb:items-start">
              <h2 className="pb-1 mg:pb-2">{t(`loans`)}</h2>
              <AccountInfoDisplay
                data={creditAccounts}
                type="debt"
                currency={mainCurrency}
                userCurrencyConvert={userCurrencyConvert}
              />
            </div>
            <div className="max-mg:hidden xlb:hidden max-w-[380px] mx-auto w-full">
              <h2 className="pb-1 mg:pb-2">{t(`upcoming-payments`)}</h2>
              <UpcomingPayments data={upcomingPaymentsData} />
            </div>
          </div>
        </div>
        {/*categories,graph,upcomingPayments*/}
        <div className="max-xlb:max-w-[95%] w-full flex  justify-center mg:justify-start mg:gap-x-4 xlb:gap-x-6">
          {/*categories, payments*/}
          <div className="mg:w-[280px] xlb:w-[410px] flex flex-col gap-y-3 mg:gap-y-4 ">
            <div className="flex mg:hidden xlb:flex  max-w-[380px]   mx-auto w-full  items-center flex-col xlb:order-2  ">
              <h2 className="pb-1 mg:pb-2">{t(`upcoming-payments`)}</h2>
              <UpcomingPayments data={upcomingPaymentsData} />
            </div>
            <div className="max-w-[430px] mx-auto flex flex-col xlb:order-1">
              <h2 className="pb-1 mg:pb-2 text-center">{t(`categories`)}</h2>
              <ExpensesByCategory
                // @ts-expect-error
                data={expensesByCategoryData}
                mainCurrency={mainCurrency}
              />
            </div>
          </div>
          {/*graph*/}
          <div className="max-mg:hidden flex-1">
            <h2 className="pb-1 mg:pb-2">{t(`income-expenses`)}</h2>
            <DashboardChart
              data={graphData}
              queryRangeKey="mainChartRange"
              queryCurrencyKey="mainChartCurrency"
              usedCurrencies={allUsedCurrenciesOnTransactions}
              selectedRange={mainChartRange}
              selectedCurrencyLabel={graphCurrencyExist || mainCurrency}
            />
          </div>
        </div>
      </div>
      {/*content right side, hidden to fullhd resolution*/}
      <div className="max-[1680px]:hidden  min-h-[100%] flex pl-6 w-fit">
        <hr className="h-full w-[1px] border-[1px] border-black" />
        <div className="pl-12 flex flex-col">
          <h2 className="text-center pb-2">{t(`last-transaction`)}</h2>
          <div className="box flex flex-col h-fit shadow-[0_3px_10px_rgb(0,0,0,0.2)] w-[300px]">
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
                        {findCurrencySymbol(tran.currency)}
                      </p>
                    </div>
                  </div>
                  <hr className="w-[90%] mx-auto border-black" />
                </div>
              );
            })}
            <Link
              href="/dashboard/transactions"
              className="underline text-sm text-center flex-1 flex items-end justify-center pb-2 "
            >
              {t(`show-more`)}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
