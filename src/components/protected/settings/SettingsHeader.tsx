import React from "react";
import { Select, SelectContent, SelectTrigger } from "@/components/ui/select";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";

const SettingsHeader = () => {
  const t = useTranslations("settings-page");
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

          <Link
            href="?type=dfd"
            className="settings-select-link cursor-pointer"
          >
            {t("subscription")}
          </Link>
        </SelectContent>
      </Select>
      {/*<Select>*/}
      {/*  <SelectTrigger className="w-fit gap-2 focus:outline-none focus:ring-0 bg-transparent focus:ring-offset-0 pl-3 pr-1 py-1.5 sm:py-2 border-none rounded-lg ">*/}
      {/*    <p className="text-lg font-semibold">Obecné</p>*/}
      {/*  </SelectTrigger>*/}
      {/*  <SelectContent className="bg-main-gray border-main-gray">*/}
      {/*    <div className="grid grid-cols-2">*/}
      {/*      <Link href="/" className="settings-select-link">*/}
      {/*        Připojené účty*/}
      {/*      </Link>*/}
      {/*      <Link href="/" className="settings-select-link">*/}
      {/*        Jazyk*/}
      {/*      </Link>*/}
      {/*      <Link href="/" className="settings-select-link">*/}
      {/*        Rodina*/}
      {/*      </Link>*/}
      {/*      <Link href="/" className="settings-select-link">*/}
      {/*        Měna*/}
      {/*      </Link>*/}
      {/*    </div>*/}
      {/*  </SelectContent>*/}
      {/*</Select>*/}
    </div>
  );
};

export default SettingsHeader;
