import React from "react";
import { DataTable } from "@/components/protected/table/DataTable";
import { userTransactions } from "@/helpers/current-user";
import { columnsnew } from "@/app/[locale]/(protected)/dashboard/transactions/columnsnew";
import { TransactionData } from "@/types";
import Link from "next/link";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { currencies, transactionType } from "@/constants";

const TransactionPage = async ({
  searchParams,
}: {
  searchParams: { month: string };
}) => {
  const getLast12Months = (): string[] => {
    const months = [];
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-11, so we add 1 to get 1-12

    for (let i = 0; i < 12; i++) {
      let month = currentMonth - i;
      if (month <= 0) {
        month += 12;
      }
      months.push(month.toString().padStart(2, "0")); // Ensures month is in "MM" format
    }

    return months;
  };
  const months = getLast12Months();
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
  const transactionStanding = allTransactions.filter(
    (transaction) => transaction.transactionType === 4,
  );
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
  return (
    <div className="flex flex-col  items-center gap-2">
      <div className="flex gap-2 items-center">
        <Link
          href="/dashboard/transactions"
          className={`min-[300px]:text-lg  ${!searchParams.month && "underline"}`}
        >
          Tento Měsíc
        </Link>
        <p>|</p>
        <Link
          href={`?month=${months[1]}`}
          className={`min-[300px]:text-lg ${monthToFilter === months[1] && "underline"}`}
        >
          Minulý Měsíc
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
      <div className="w-full flex max-xl:flex-col items-center xl:items-start xl:justify-center xl:gap-4">
        {transactionOut.length > 0 ||
        transactionIn.length > 0 ||
        transactionBetween.length > 0 ? (
          <div className="flex flex-col w-full items-center xl:order-2 xl:w-[300px]  gap-2">
            <h2>Shrnutí</h2>
            {/*transaction count*/}
            <div className="flex max-sm:flex-col xl:flex-col sm:gap-1 md:gap-4 w-full items-start justify-center ">
              <div className="bg-main-gray rounded-xl px-4 py-2  max-sm:w-[80%] w-full  max-w-[300px] flex flex-col items-center gap-1">
                <p className="font-medium underline">Počet Transakcí</p>
                <div className="text-[15px] w-full flex flex-col items-center gap-1">
                  {filteredTransactionTypes.map((tran, i) => {
                    let data =
                      tran === "in"
                        ? transactionIn
                        : tran === "out"
                          ? transactionOut
                          : transactionBetween;
                    const name = transactionType.find(
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
                <div className="bg-main-gray rounded-xl px-4 py-2  max-sm:w-[80%] w-full max-w-[300px] flex flex-col items-center  gap-1 max-h-[120px] xl:max-h-[300px] overflow-auto ">
                  <p className="font-medium underline">Transakce</p>
                  <div className="text-[15px] w-full flex flex-col items-center gap-1 ">
                    {listSumArray.map((item, i) => {
                      const findNames = transactionType.find(
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
                                {new Intl.NumberFormat().format(curr.totalSum)}{" "}
                                {
                                  currencies.find(
                                    (currency) =>
                                      currency.value === curr.currency,
                                  )?.symbol
                                }
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
        <div className="flex flex-col gap-4 max-w-[800px] w-full ">
          <DataTable columns={columnsnew} data={transactionIn} title="Příjmy" />
          <DataTable
            columns={columnsnew}
            data={transactionOut}
            title="Výdaje"
          />
          <DataTable
            columns={columnsnew}
            data={transactionBetween}
            title="Mezi účty"
          />
        </div>
      </div>
    </div>
  );
};

export default TransactionPage;
