"use client";
import React from "react";
import DropdownNav from "@/components/protected/navbar/DropdownNav";
import Image from "next/image";
import DropdownUserMenu from "@/components/protected/navbar/DropdownUserMenu";
import { useTranslations } from "next-intl";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import DialogContentWrapper from "@/components/protected/dialog/DialogContentWrapper";
import AddTransactionForm from "@/components/protected/dialog/AddTransactionForm";
import { usePathname } from "next/navigation";
import AddGoalForm from "@/components/protected/dialog/AddGoalForm";
import { signOut } from "next-auth/react";
import { UserAccount } from "@/types";
import AddSubscriptionForm from "@/components/protected/dialog/AddSubscriptionForm";
import AddAccountForm from "@/components/protected/dialog/AddAccountForm";

const Navbar = ({
  userAccounts,
  defaultCurrency,
  // userAccountNew,
}: {
  // userAccountNew: UserAccountNew;
  userAccounts: UserAccount[];
  defaultCurrency?: string | undefined;
}) => {
  const removedLoanType = userAccounts.filter((item) => item.type !== 2);

  const t = useTranslations("dashboard-navigation");

  const dropdownNavData = [
    {
      title: t("nav-links.dashboard.title"),
      icon: t("nav-links.dashboard.icon"),
      link: t("nav-links.dashboard.link"),
      formTitle: t("nav-links.dashboard.form-title"),
      formDesc: t("nav-links.dashboard.form-desc"),
    },
    {
      title: t("nav-links.goals.title"),
      icon: t("nav-links.goals.icon"),
      link: t("nav-links.goals.link"),
      formTitle: t("nav-links.goals.form-title"),
      formDesc: t("nav-links.goals.form-desc"),
    },
    {
      title: t("nav-links.income-expenses.title"),
      icon: t("nav-links.income-expenses.icon"),
      link: t("nav-links.income-expenses.link"),
      formTitle: t("nav-links.income-expenses.form-title"),
      formDesc: t("nav-links.income-expenses.form-desc"),
    },
    {
      title: t("nav-links.subscriptions.title"),
      icon: t("nav-links.subscriptions.icon"),
      link: t("nav-links.subscriptions.link"),
      formTitle: t("nav-links.subscriptions.form-title"),
      formDesc: t("nav-links.subscriptions.form-desc"),
    },
    {
      title: t("nav-links.statistics.title"),
      icon: t("nav-links.statistics.icon"),
      link: t("nav-links.statistics.link"),
      formTitle: t("nav-links.statistics.form-title"),
      formDesc: t("nav-links.statistics.form-desc"),
    },
    {
      title: t("nav-links.accounts.title"),
      icon: t("nav-links.accounts.icon"),
      link: t("nav-links.accounts.link"),
      formTitle: t("nav-links.accounts.form-title"),
      formDesc: t("nav-links.accounts.form-desc"),
    },
  ];

  const pathname = usePathname();
  let pageName;
  let form;
  let title = "";
  let description = "";
  if (pathname.includes("goals")) {
    pageName = dropdownNavData[1].title;
    title = dropdownNavData[1].formTitle;
    description = dropdownNavData[1].formDesc;
    form = (
      <AddGoalForm
        userAccounts={removedLoanType}
        defaultCurrency={defaultCurrency}
      />
    );
  } else if (pathname.includes("transactions")) {
    pageName = dropdownNavData[2].title;
    title = dropdownNavData[2].formTitle;
    description = dropdownNavData[2].formDesc;
    form = (
      <AddTransactionForm
        userAccounts={userAccounts}
        defaultCurrency={defaultCurrency}
      />
    );
  } else if (pathname.includes("subscriptions")) {
    pageName = dropdownNavData[3].title;
    title = dropdownNavData[3].formTitle;
    description = dropdownNavData[3].formDesc;
    form = (
      <AddSubscriptionForm
        userAccounts={removedLoanType}
        defaultCurrency={defaultCurrency}
      />
    );
  } else if (pathname.includes("accounts")) {
    pageName = dropdownNavData[5].title;
    title = dropdownNavData[5].formTitle;
    description = dropdownNavData[5].formDesc;
    form = <AddAccountForm defaultCurrency={defaultCurrency} />;
  } else if (pathname.includes("dashboard")) {
    pageName = t(`appName`);
  } else if (pathname.includes("settings")) {
    pageName = t(`settings`);
  }

  const logOut = () => {
    signOut();
  };

  return (
    <nav className="h-[50px] max-sm:bg-main-blue max-sm:text-white flex items-center justify-between sm:items-end  max-sm:border-b-2 border-white relative max-sm:px-4 xl:pl-16 ">
      <DropdownNav dropdownNavData={dropdownNavData} />
      {/*Page Name*/}
      <div className="flex gap-2">
        <h1 className="sm:text-xl sm:font-medium md:text-2xl">{pageName}</h1>
        {form && (
          <Dialog>
            <DialogTrigger>
              <Image
                src="/icons/add-circle.svg"
                alt="add"
                width={24}
                height={24}
                className="nav-image"
              />
            </DialogTrigger>
            <DialogContent
              id="dialog-content"
              className="bg-main-gray text-black rounded-md"
            >
              <DialogContentWrapper
                title={title}
                description={description}
                titleCenter
              >
                {form}
              </DialogContentWrapper>
            </DialogContent>
          </Dialog>
        )}
      </div>
      {/*single user/family*/}
      <div className="flex gap-2 sm:gap-4">
        <Image
          src="/icons/single-user.svg"
          alt="single-user"
          width={24}
          height={24}
          className="nav-image"
        />
        <Image
          src="/icons/family.svg"
          alt="add"
          width={24}
          height={24}
          className="nav-image opacity-30"
        />
      </div>
      <div className="flex gap-6 md:gap-8 xl:gap-10">
        <button
          onClick={logOut}
          className="bg-main-blue text-white py-1 px-2 md:px-3 xl:px-4 rounded-lg lg:text-lg hidden sm:block"
        >
          {t(`logOut`)}
        </button>

        <DropdownUserMenu />
      </div>
    </nav>
  );
};

export default Navbar;
