import React from "react";

import SettingsHeader from "@/components/protected/settings/SettingsHeader";
import { currentUser } from "@/helpers/current-user";
import ChangeSecurityInfoForm from "@/components/protected/settings/ChangeSecurityInfoForm";
import { getTranslations } from "next-intl/server";

const Settings = async () => {
  const t = await getTranslations("settings-page");
  const user = await currentUser();
  if (!user) {
    return null;
  }
  return (
    <div id="settings" className=" flex flex-col w-full gap-2">
      <SettingsHeader />
      <div className="w-full flex items-center justify-center  flex-col">
        <div className="flex flex-col w-full gap-4">
          <h1 className="text-xl font-semibold underline text-center">
            {t("general")}
          </h1>
          <ChangeSecurityInfoForm user={user} />
        </div>
      </div>
    </div>
  );
};

export default Settings;
