"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

const PotentialTable = () => {
  const t = useTranslations("potential-goals");
  const potentialGoalsData = [
    {
      title: t("menu.title"),
      slug: t("menu.slug"),
      icon: t("menu.icon"),
      text: t("menu.text"),
    },
    {
      title: t("goals.title"),
      slug: t("goals.slug"),
      icon: t("goals.icon"),
      text: t("goals.text"),
    },
    {
      title: t("income-expense.title"),
      slug: t("income-expense.slug"),
      icon: t("income-expense.icon"),
      text: t("income-expense.text"),
    },
    {
      title: t("subscriptions.title"),
      slug: t("subscriptions.slug"),
      icon: t("subscriptions.icon"),
      text: t("subscriptions.text"),
    },
    {
      title: t("statistics.title"),
      slug: t("statistics.slug"),
      icon: t("statistics.icon"),
      text: t("statistics.text"),
    },
    {
      title: t("mobile-app.title"),
      slug: t("mobile-app.slug"),
      icon: t("mobile-app.icon"),
      text: t("mobile-app.text"),
    },
  ];

  const [goal, setGoal] = useState({ chosen: 1, open: false });

  const handleChange = (index: number) => {
    if (index === 0) {
      setGoal({ ...goal, open: !goal.open });
    } else {
      setGoal({ chosen: index, open: false });
    }
  };

  return (
    <div className="spacing-in-div ">
      <h1 className="text-center max-tb:whitespace-pre">
        {t(`title`).split(" ").length > 3
          ? `${t(`title`).split(" ").slice(0, 3).join(" ")}  \n ${t(`title`).split(" ").slice(3, t(`title`).split(" ").length).join(" ")}`
          : t(`title`)}
      </h1>
      <div className="flex w-full max-lg:flex-col sm:max-lg:gap-3 lg:justify-center ">
        {/*choose goal bar*/}
        <div
          className={`left-0 flex w-fit gap-5 rounded-r-xl max-sm:absolute max-sm:h-[200px] max-sm:pl-3  sm:max-lg:mx-auto ${goal.open ? "max-sm:translate-x-0 bg-[#F0F0F0]" : "max-sm:translate-x-[-165px]"}`}
        >
          {/*goal title sm+hidden*/}
          <div className="flex flex-col items-end justify-between py-[6px] sm:hidden">
            {potentialGoalsData.map((item, i) => {
              return (
                <p
                  key={i}
                  onClick={() => handleChange(i)}
                  className={`py-[3.5px] text-sm ${goal.chosen === i ? "text-slate-700" : "text-black"}`}
                >
                  {item.title}
                </p>
              );
            })}
          </div>
          {/*icon sm+ icon and text*/}
          <div className="flex h-full w-[34px] items-center rounded-xl bg-main-blue py-1 max-sm:flex-col max-sm:justify-between sm:h-[36px] sm:w-fit sm:gap-2 sm:rounded-2xl sm:px-1 lg:h-full lg:flex-col lg:items-start lg:justify-center lg:gap-1 lg:rounded-l-2xl lg:rounded-r-none lg:bg-main-yellow lg:pl-4 lg:pr-6 xl:gap-3 xl:pb-4 xl:pl-6 lg:border-white lg:border-y-2 lg:border-l-2">
            {potentialGoalsData.map((item, i) => {
              return (
                <div
                  key={i}
                  onClick={() => handleChange(i)}
                  className={`max-lg:h-full sm:flex sm:items-center sm:text-nowrap sm:px-1 lg:w-full lg:px-2 xl:gap-3 ${i === 0 && "sm:hidden"} ${goal.chosen === i ? "rounded-xl bg-white lg:rounded-md" : "sm:max-lg:text-white"}`}
                >
                  <Image
                    width={24}
                    height={24}
                    src={`/icons/${item.icon}.svg`}
                    alt={item.icon}
                    className={`h-full w-[28px] cursor-pointer rounded-xl px-1 py-[3.5px] ${goal.chosen === i ? "max-sm:bg-white" : "max-lg:invert max-sm:bg-none"}`}
                  />
                  <p className="hidden cursor-pointer text-sm sm:block sm:text-xs md:text-sm xl:text-base">
                    {item.title}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
        {/*article*/}
        <div className="min-h-[370px] w-[85%] space-y-2 rounded-md bg-main-yellow p-3 max-lg:ml-auto min-[370px]:max-w-[260px] min-[370px]:max-lg:mx-auto min-[460px]:min-h-[200px] min-[460px]:max-w-[90%] sm:max-w-[570px] sm:rounded-xl lg:w-full lg:rounded-l-none lg:rounded-r-2xl lg:pr-5 xl:h-[310px] xl:space-y-4 xl:py-5 border-white border-2 lg:border-l-0">
          <h4 className="underline max-lg:text-center lg:pl-2">
            {potentialGoalsData[goal.chosen].title}
          </h4>
          <p className="overflow-auto text-sm leading-relaxed min-[460px]:max-h-[320px] sm:text-base lg:h-[176px] lg:py-1 lg:text-[18px] lg:text-base xl:h-[220px]">
            {potentialGoalsData[goal.chosen].text}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PotentialTable;
