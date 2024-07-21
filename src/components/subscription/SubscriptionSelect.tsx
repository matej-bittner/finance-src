"use client";
import React, { useState } from "react";
import { plans } from "@/constants";
import { useTranslations } from "next-intl";

const SubscriptionSelect = ({ userEmail }: { userEmail: any }) => {
  const t = useTranslations("subscription-select");
  const [selectedPlan, setSelectedPlan] = useState(0);

  return (
    <div className="rounded-xl border-main-yellow max-lg:border-2 flex flex-col items-center py-3 gap-2 relative px-4 lg:w-1/2 ">
      <div className="flex w-full gap-4  justify-center lg:mt-8">
        {plans.map((p, i) => (
          <div key={i} className=" flex items-center gap-1">
            <button
              className={`rounded-full w-[15px] aspect-square  border-2 border-black cursor-pointer ${i === selectedPlan ? "bg-gray-600/50" : "bg-transparent"}`}
              onClick={() => setSelectedPlan(i)}
            />
            <p>
              {t("pay-duration")} {t(p.duration)}
            </p>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-1 items-center">
        <p className="font-semibold text-lg">
          {t(plans[selectedPlan].duration)}
        </p>
        {plans[selectedPlan].duration === "yearly" && (
          <p className="text-center">
            {t("save")} <span className="font-medium">16%</span> {t("save2")}{" "}
          </p>
        )}
        <p className="font-medium text-xl py-2 md:text-2xl">
          {plans[selectedPlan].price} EUR
        </p>
      </div>
      <a
        target="_blank"
        href={plans[selectedPlan].link + "?prefilled_email=" + userEmail}
        className="px-2 py-1 font-medium text-white bg-main-blue rounded-md w-full text-center"
      >
        {t("pay-link")}
      </a>
      <p className="text-center text-xs lg:text-sm">{t("pay-text")}</p>
    </div>
  );
};

export default SubscriptionSelect;
