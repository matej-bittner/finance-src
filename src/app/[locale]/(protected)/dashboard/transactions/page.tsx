import React from "react";
import { DataTable } from "@/components/protected/table/DataTable";
import { userPeriodicPayments, userTransactions } from "@/helpers/current-user";
import { PeriodicPaymentData, TransactionData } from "@/types";
import Link from "next/link";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getTranslations } from "next-intl/server";
import { findCurrencySymbol, getMonthArray } from "@/helpers/generalFunctions";

const TransactionPage = async ({
  searchParams,
}: {
  searchParams: { month: string };
}) => {
  const t = await getTranslations("transaction-page");

  const t1 = await getTranslations("transaction-types");
  const transactionTypes = [
    {
      title: t1(`income`),
      transaction: t1(`income-transaction`),
      abbreviation: "in",
      id: 1,
    },
    {
      title: t1(`expenses`),
      transaction: t1(`expenses-transaction`),
      abbreviation: "out",
      id: 2,
    },
    {
      title: t1(`between`),
      transaction: t1(`between-transaction`),
      abbreviation: "between",
      id: 3,
    },
    {
      title: t1(`standing`),
      transaction: t1(`standing-transaction`),
      abbreviation: "standing",
      id: 4,
    },
  ];

  const months = getMonthArray(12);

  const monthToFilter = searchParams.month ? searchParams.month : months[0];

  const filteredTransactionTypes = ["in", "out", "between"];

  const allTransactions: TransactionData[] =
    await userTransactions(monthToFilter);

  const transactionIn = allTransactions.filter(
    (transaction) => transaction.transactionType === 1,
  );
  const transactionOut = allTransactions.filter(
    (transaction) => transaction.transactionType === 2,
  );
  const transactionBetween = allTransactions.filter(
    (transaction) => transaction.transactionType === 3,
  );

  const periodicPayment: PeriodicPaymentData[] = await userPeriodicPayments(4);

  let listSumArray;

  if (allTransactions.length > 0) {
    type TransactionSummary = {
      transaction: "in" | "out";
      byCurrency: { currency: string; totalSum: number }[];
    };

    const listSum: TransactionSummary[] = allTransactions.reduce(
      (acc, transaction) => {
        const transactionType = transaction.transactionType;
        const amount = transaction.amount;

        // Skip transactions with type 3
        if (transactionType === 3) {
          return acc;
        }

        const transactionText: any = transactionType === 1 ? "in" : "out";

        const currency = transaction.currency;

        // Initialize the appropriate array within acc for "in" or "out" transactions
        if (!acc[transactionText]) {
          acc[transactionText] = {
            transaction: transactionText,
            byCurrency: [],
          };
        }

        // Find the existing currency object or create a new one within the byCurrency array
        const currencyIndex = acc[transactionText].byCurrency.findIndex(
          (item) => item.currency === currency,
        );
        let currencyObject: { currency: string; totalSum: number };
        if (currencyIndex === -1) {
          currencyObject = { currency, totalSum: 0 };
          acc[transactionText].byCurrency.push(currencyObject);
        } else {
          currencyObject = acc[transactionText].byCurrency[currencyIndex];
        }

        // Add the transaction amount to the total sum for the currency
        currencyObject.totalSum += amount;

        return acc;
      },
      {} as TransactionSummary[],
    );
    // Convert the object to an array of desired structure
    listSumArray = Object.values(listSum);
  }

  // if (allTransactions.length === 0) return null;

  return (
    <div className="flex flex-col  items-center gap-2">
      <div className="flex gap-2 items-center">
        <Link
          href="/dashboard/transactions"
          className={`min-[300px]:text-lg  ${!searchParams.month && "underline"}`}
        >
          {t(`this-month`)}
        </Link>
        <p>|</p>
        <Link
          href={`?month=${months[1]}`}
          className={`min-[300px]:text-lg ${monthToFilter === months[1] && "underline"}`}
        >
          {t(`last-month`)}
        </Link>
        <p>|</p>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Image src="/icons/dots.svg" alt="months" width={25} height={25} />
          </DropdownMenuTrigger>
          <DropdownMenuContent className=" min-w-0 w-[50px] text-center bg-main-gray border-none">
            {months.slice(2).map((month, i) => (
              <DropdownMenuCheckboxItem
                key={i}
                className="p-0  hover:bg-gray-200 "
              >
                <Link
                  href={`?month=${month}`}
                  className="text-center w-full py-[2px]  "
                >
                  {month}
                </Link>
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="w-full flex flex-col items-center xl:items-start xl:justify-center xl:gap-4 pt-2 2xl:pt-8 ">
        <div className="max-2xl:flex max-2xl:flex-col max-2xl:max-w-[800px] gap-5 w-full 2xl:grid 2xl:grid-cols-2 2xl:justify-items-center 2xl:max-w-[1560px] mx-auto 2xl:gap-y-8">
          {/*<DataTable columns={columns} data={transactionIn} title="Příjmy" />*/}
          {transactionIn.length > 0 && (
            <DataTable data={transactionIn} title={t1(`income`)} type={1} />
          )}
          {/*<DataTable data={transactionIn} title="Příjmy" type={1} />*/}
          {transactionOut.length > 0 && (
            <DataTable data={transactionOut} title={t1(`expenses`)} type={1} />
          )}
          {transactionBetween.length > 0 && (
            <DataTable
              data={transactionBetween}
              title={t1(`between`)}
              type={1}
            />
          )}
          {periodicPayment.length > 0 && (
            <DataTable data={periodicPayment} title={t1(`standing`)} type={2} />
          )}
          {transactionOut.length > 0 ||
          transactionIn.length > 0 ||
          transactionBetween.length > 0 ? (
            <div className="flex flex-col w-full items-center gap-2 xl:mx-auto order-2  2xl:max-w-[720px] h-fit ">
              {/*<div className="flex flex-col w-full items-center xl:order-2 xl:w-[300px]  gap-2">*/}
              <h2 className="w-full max-sm:text-center pb-1 2xl:pb-6">
                {t(`summary`)}
              </h2>
              {/*transaction count*/}
              <div className="flex max-sm:flex-col  sm:gap-1 md:gap-4 w-full  justify-center sm:items-start items-center">
                {/*<div className="flex max-sm:flex-col xl:flex-col sm:gap-1 md:gap-4 w-full items-start justify-center ">*/}
                <div className="bg-main-gray rounded-t-xl sm:rounded-b-xl px-4 py-2  max-sm:w-[80%] w-full  max-w-[300px] flex flex-col items-center gap-1 ">
                  <p className="font-medium underline">
                    {t(`transaction-count`)}
                  </p>
                  <div className="text-[15px] w-full flex flex-col items-center gap-1">
                    {filteredTransactionTypes.map((tran, i) => {
                      let data =
                        tran === "in"
                          ? transactionIn
                          : tran === "out"
                            ? transactionOut
                            : transactionBetween;
                      const name = transactionTypes.find(
                        (name) => name.abbreviation === tran,
                      );
                      return (
                        <p
                          key={i}
                          className="w-full  flex justify-between max-w-[220px]"
                        >
                          {name?.transaction || name?.title || ""}
                          <span className="pr-5">{data.length}</span>
                        </p>
                      );
                    })}
                  </div>
                </div>
                {/*transaction amounts*/}
                {listSumArray && (
                  <div className="bg-main-gray  px-4 py-2  max-sm:w-[80%] w-full max-w-[300px] flex flex-col items-center  gap-1 max-h-[120px] xl:max-h-[300px] overflow-auto rounded-b-xl sm:rounded-t-xl">
                    <p className="font-medium underline">{t(`transaction`)}</p>
                    <div className="text-[15px] w-full flex flex-col items-center gap-1 ">
                      {listSumArray.map((item, i) => {
                        const findNames = transactionTypes.find(
                          (type) => type.abbreviation === item.transaction,
                        );

                        return (
                          <div
                            key={i}
                            className="w-full  flex justify-between max-w-[220px]"
                          >
                            <p>{findNames?.transaction}</p>
                            <div className="flex flex-col items-center">
                              {item.byCurrency.map((curr, i) => (
                                <p key={i}>
                                  {new Intl.NumberFormat().format(
                                    curr.totalSum,
                                  )}{" "}
                                  {findCurrencySymbol(curr.currency)}
                                </p>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default TransactionPage;
