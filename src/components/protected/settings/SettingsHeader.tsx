import React, { useEffect } from "react";
import { Select, SelectContent, SelectTrigger } from "@/components/ui/select";
import Link from "next/link";

import { getTranslations } from "next-intl/server";
import { currentUser } from "@/helpers/current-user";

const SettingsHeader = async () => {
  const t = await getTranslations("settings-page");
  const customerPortalLink =
    process.env.NODE_ENV === "development"
      ? "https://billing.stripe.com/p/login/test_eVaaEH2h86GF7K07ss"
      : "https://billing.stripe.com/p/login/00geXm6sj8SsfgQfYY";
  const user = await currentUser();

  if (!user) {
    return null;
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
