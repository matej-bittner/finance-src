"use client";
import React, { useEffect } from "react";
import SubscriptionSelector from "@/components/SubscriptionSelector";

import { useTranslations } from "next-intl";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useRouter } from "next/navigation";

const Page = () => {
  const t = useTranslations("subscription-select");
  // const router = useRouter();
  const user = useCurrentUser();

  if (!user?.email) return null;

  return (
    <section className="limited-width flex min-h-[calc(100vh-65px)] sm:min-h-[calc(100vh-75px)] md:min-h-[calc(100vh-85px)] flex-col py-5 tb:py-6 gap-3 md:gap-4 lg:gap-6 ">
      <h1 className="text-center underline pb-2">{t("main-title")}</h1>
      <div className="flex max-lg:flex-col gap-2 max-lg:max-w-[690px] mx-auto lg:gap-5 lg:max-w-[1100px] xl:gap-7">
        <h2 className="text-center lg:hidden">{t("title")}</h2>
        <SubscriptionSelector userEmail={user.email} />
        <div className="flex flex-col items-center gap-1 lg:w-1/2">
          <p className="text-lg font-medium lg:hidden">{t("about-title")}</p>
          <h2 className="text-center max-lg:hidden">{t("title")}</h2>

          <article className="flex flex-col gap-2 sm:gap-3">
            <p>{t("text1")}</p>
            <p>{t("text2")}</p>
            <p>{t("text3")}</p>
            <p>{t("text4")}</p>
            <p>{t("text5")}</p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default Page;
//
// <a
//   target="_blank"
//   href={asd[0].link + "?prefilled_email=" + user?.email}
//   className="px-2 py-2 font-medium text-white bg-black rounded-md mt-10 ml-10"
// >
//   Pay
// </a>
