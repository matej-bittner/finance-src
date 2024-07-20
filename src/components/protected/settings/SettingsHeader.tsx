"use client";
import React from "react";
import { Select, SelectContent, SelectTrigger } from "@/components/ui/select";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const SettingsHeader = () => {
  const t = useTranslations("settings-page");
  const customerPortalLink =
    process.env.NODE_ENV === "development"
      ? "https://billing.stripe.com/p/login/test_eVaaEH2h86GF7K07ss"
      : "https://billing.stripe.com/p/login/00geXm6sj8SsfgQfYY";
  const user = useCurrentUser();
  if (!user) {
    return null;
    //logout
  }
  return (
    <div className="flex">
      <Select>
        <SelectTrigger className="w-fit gap-2 focus:outline-none focus:ring-0 bg-transparent focus:ring-offset-0 pl-3 pr-1 py-1.5 sm:py-2 border-none rounded-lg ">
          <p className="text-lg font-semibold">{t("account")}</p>
        </SelectTrigger>
        <SelectContent className="bg-main-gray border-main-gray">
          <Link
            href="/settings"
            className="settings-select-link cursor-pointer"
          >
            {t("general")}
          </Link>

          <a
            target="_blank"
            href={customerPortalLink + "?prefilled_email=" + user.email}
            className="settings-select-link cursor-pointer"
          >
            {t("subscription")}
          </a>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SettingsHeader;
