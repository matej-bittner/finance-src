import React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { findCurrencySymbol } from "@/helpers/generalFunctions";
import Image from "next/image";

const UpcomingPayments = ({ data }: any) => {
  const t = useTranslations("dashboard");
  return (
    <div className="box flex flex-col gap-2 min-[450px]:gap-3 w-full max-w-[380px] shadow-[0_3px_10px_rgb(0,0,0,0.2)] ">
      {data.length === 0 ? (
        <div className="  h-[140px] flex flex-col items-center justify-center">
          <p>{t("no-transactions")}</p>
          <Link
            className="font-normal underline underline-offset-2 flex gap-1"
            href="/dashboard/transactions"
          >
            {t("create-transaction")}
            <Image
              src="/icons/line-arrow-up.svg"
              alt="arrow"
              width={18}
              height={18}
              className="rotate-45"
            />
          </Link>
        </div>
      ) : (
        <>
          {data.map((payment: any, i: number) => (
            <div key={i} className="space-y-2">
              <div className="flex items-center">
                <div className="flex flex-col items-center justify-around rounded-md bg-[#B1B1B1] aspect-[4/5] h-[50px]">
                  <p className="font-medium text-sm">
                    {payment.toProcess
                      .toLocaleString("default", {
                        month: "short",
                      })
                      .toUpperCase()}
                  </p>
                  <p className="text-sm">
                    {payment.toProcess.toLocaleString("default", {
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex flex-col flex-1 pl-2 min-[350px]:pl-4 min-[400px]:pl-5 sm:pl-2">
                  <p className="font-semibold max-md:text-sm">{payment.name}</p>
                  <p className="text-sm">
                    {t(`last-payment`)}{" "}
                    {payment.lastProcessed
                      ? payment.lastProcessed.toLocaleDateString()
                      : "--------"}
                  </p>
                </div>
                <div className="flex flex-col text-sm items-center justify-center">
                  <p>{payment.amount}</p>
                  <p>{findCurrencySymbol(payment.currency)}</p>
                </div>
              </div>
              <hr
                className={`w-[90%] border-black mx-auto ${i === 2 && "hidden"}`}
              />
            </div>
          ))}

          <Link
            href="/dashboard/transactions"
            className="underline text-sm text-center"
          >
            {t(`show-more`)}
          </Link>
        </>
      )}
    </div>
  );
};

export default UpcomingPayments;
