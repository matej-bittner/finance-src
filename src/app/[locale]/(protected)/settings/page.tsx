import React from "react";

import SettingsHeader from "@/components/protected/settings/SettingsHeader";
import CreateAccountForm from "@/components/protected/settings/CreateAccountForm";
import { currentUser } from "@/helpers/current-user";

const Settings = async ({ searchParams }: any) => {
  const category = searchParams.category;
  const user = await currentUser();
  return (
    <div id="settings" className=" flex flex-col w-full gap-2">
      <SettingsHeader />
      <div className="w-full flex items-center justify-center">
        <h1 className="text-xl font-semibold underline">Zabezpečení</h1>
      </div>

      <CreateAccountForm defaultCurrency={user?.mainCurrency} />
    </div>
  );
};

export default Settings;
