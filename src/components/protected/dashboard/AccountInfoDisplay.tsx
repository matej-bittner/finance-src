"use client";
import React, { useState } from "react";
import Image from "next/image";
import { UserAccount } from "@/types";
import { useTranslations } from "next-intl";
import { findCurrencySymbol } from "@/helpers/generalFunctions";
import Link from "next/link";

interface AccountInfoDisplayProps {
  currency: string;
  data: UserAccount[];
  type: "account" | "debt" | "investment";
  userCurrencyConvert: any;
}
const AccountInfoDisplay = ({
  data,
  type,
  currency,
  userCurrencyConvert,
}: AccountInfoDisplayProps) => {
  const t = useTranslations("dashboard.account-info");
  const t1 = useTranslations("dashboard");
  const [selectedAccount, setSelectedAccount] = useState(0);
  if (data.length === 0) {
    return null;
  }

  let wasConverted = "";
  const extractAndSumBalances = (data: UserAccount[]) => {
    // Check if paymentAccount exists and has elements
    if (data.length > 0) {
      // Sum balances within paymentAccount array
      const accountBalances = data.map((account) => {
        if (account.currency === currency) {
          return account.balance;
        } else if (
          userCurrencyConvert.hasOwnProperty(account.currency.toUpperCase())
        ) {
          const value = 1 / userCurrencyConvert[account.currency.toUpperCase()];
          wasConverted = "~";
          return Math.round(value * account.balance);
        } else {
          return account.balance;
        }
      });
      const accountSum = accountBalances.reduce(
        (innerAcc, value) => innerAcc + value,
        0,
      );
      return accountSum;
    }
    return 0; // Return accumulator if no paymentAccount or empty
  };

  const totalBalance = extractAndSumBalances(data);

  const currencyTypes = findCurrencySymbol(data[selectedAccount].currency);
  const mainCurrency = findCurrencySymbol(currency);
  return (
    <div className="box flex flex-col gap-2 min-[450px]:gap-3 w-full max-w-[380px] shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
      {/*top */}
      <div className="flex flex-col">
        <div className="flex justify-between">
          <p className="md:text-lg">
            {wasConverted}
            {Intl.NumberFormat().format(totalBalance)} {mainCurrency}
          </p>
          <p>
            {type === "account"
              ? t(`all-accounts`)
              : type === "debt"
                ? t(`all-debts`)
                : t(`all-investments`)}
          </p>
        </div>
        <hr className="border-black w-[90%] mx-auto" />
      </div>
      {/*account info*/}
      <div
        className={`${type === "account" ? "bg-main-blue" : type === "debt" ? "bg-main-error" : type === "investment" && "bg-main-blue"} relative min-h-[130px] md:min-h-[110px] text-white flex max-md:flex-col rounded-xl min-[450px]:rounded-2xl py-2 gap-2 px-1 `}
      >
        {/*left*/}
        <div className="flex flex-col items-center md:items-start md:pl-2 justify-center max-md:flex-1  md:w-3/5">
          <div className="flex gap-2 items-center">
            <p className="md:text-lg font-medium">
              {data[selectedAccount].name}
            </p>
            <Link href="/dashboard/accounts">
              <Image
                src="/icons/line-arrow-up.svg"
                alt="arrow"
                width={18}
                height={18}
                className="invert rotate-45 max-md:absolute right-2 top-2"
              />
            </Link>
          </div>
          <p className="text-xs ">{data[selectedAccount]?.number}</p>
        </div>
        {/*right*/}
        <div className="md:border-l-2 max-md:border-t-2 w-[80%] max-md:mx-auto max-md:pt-2 border-black flex flex-col items-center justify-center md:w-2/5 max-md:flex-1 ">
          <p>
            {Intl.NumberFormat().format(data[selectedAccount].balance)}{" "}
            {currencyTypes || ""}
          </p>
          {type === "debt" && (
            <div className="flex md:flex-col items-center max-md:gap-2">
              <p className="text-white/60">
                {/*@ts-ignore*/}
                {data[selectedAccount]?.periodicPayment[0].amount}{" "}
                {currencyTypes || ""}
              </p>
              <p className="text-sm text-[#ABABAB]">{t1(`next-payment`)}</p>
              {/*{type === "debt" ? (*/}
              {/*  <p className="text-white/60">*/}
              {/*    /!*@ts-ignore*!/*/}
              {/*    {data[selectedAccount]?.periodicPayment[0].amount}{" "}*/}
              {/*    {currencyTypes || ""}*/}
              {/*  </p>*/}
              {/*) : (*/}
              {/*  <div className="flex gap-1 ">*/}
              {/*    <Image*/}
              {/*      src="/icons/arrow-up-succes.svg"*/}
              {/*      alt="arrow"*/}
              {/*      width={18}*/}
              {/*      height={18}*/}
              {/*    />*/}
              {/*    <p className="text-main-success">10%</p>*/}
              {/*  </div>*/}
              {/*)}*/}
              {/*<p className="text-sm text-[#ABABAB]">*/}
              {/*  {type === "account"*/}
              {/*    ? t1(`since-last-month`)*/}
              {/*    : type === "debt" && t1(`next-payment`)}*/}
              {/*</p>*/}
            </div>
          )}
        </div>
      </div>
      {data.length > 1 && (
        <div className="flex justify-center gap-2">
          <p
            className="cursor-pointer max-md:text-sm"
            onClick={() =>
              setSelectedAccount((prevState) =>
                prevState === 0 ? data.length - 1 : prevState - 1,
              )
            }
          >
            {t1(`previous`)}
          </p>
          <div className="flex items-center gap-1">
            {Array.from({ length: data.length }).map((_, i) => (
              <div
                key={i}
                className={`rounded-full w-[8px] aspect-square border-2 border-black ${selectedAccount === i && "bg-main-yellow"}`}
              ></div>
            ))}
          </div>
          <p
            className="cursor-pointer max-md:text-sm"
            onClick={() =>
              setSelectedAccount((prevState) =>
                prevState === data.length - 1 ? 0 : prevState + 1,
              )
            }
          >
            {t1(`next`)}
          </p>
        </div>
      )}
    </div>
  );
};

export default AccountInfoDisplay;
