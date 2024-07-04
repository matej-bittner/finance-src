import React from "react";
import Link from "next/link";
import { currencies } from "@/constants";
import { getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";

const UpcomingPayments = ({ data }: any) => {
  const t = useTranslations("dashboard");
  return (
    <div className="box flex flex-col gap-2 min-[450px]:gap-3 w-full max-w-[380px] shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
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
              <p className="text-sm">{payment.toProcess.getDay()}</p>
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
              <p>
                {
                  currencies.find((item) => item.value === payment.currency)
                    ?.symbol
                }
              </p>
            </div>
          </div>
          <hr
            className={`w-[90%] border-black mx-auto ${i === 2 && "hidden"}`}
          />
        </div>
      ))}

      <Link href="/" className="underline text-sm text-center">
        {t(`show-more`)}
      </Link>
    </div>
  );
};

export default UpcomingPayments;
