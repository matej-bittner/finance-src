"use client";
import React, { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import SubscriptionSelect from "@/components/subscription/SubscriptionSelect";
import { useRouter } from "next/navigation";

const WholePage = () => {
  const user = useCurrentUser();
  const t = useTranslations("subscription-select");
  const router = useRouter();
  useEffect(() => {
    router.refresh();
  }, []);

  return (
    <section className="limited-width flex min-h-[calc(100vh-65px)] sm:min-h-[calc(100vh-75px)] md:min-h-[calc(100vh-85px)] flex-col py-5 tb:py-6 gap-3 md:gap-4 lg:gap-6 ">
      <h1 className="text-center underline pb-2">{t("main-title")}</h1>
      <div className="flex max-lg:flex-col gap-2 max-lg:max-w-[690px] mx-auto lg:gap-5 lg:max-w-[1100px] xl:gap-7">
        <p>{user?.hasAccess === false ? "false" : "true"}</p>
        <h2 className="text-center lg:hidden">{t("title")}</h2>
        <SubscriptionSelect userEmail={user?.email} />
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

export default WholePage;
