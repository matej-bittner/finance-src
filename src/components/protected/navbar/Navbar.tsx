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

const Navbar = () => {
  const t = useTranslations("dashboard-navigation");
  const dropdownNavData = [
    {
      title: t("nav-links.dashboard.title"),
      icon: t("nav-links.dashboard.icon"),
      link: t("nav-links.dashboard.link"),
    },
    {
      title: t("nav-links.goals.title"),
      icon: t("nav-links.goals.icon"),
      link: t("nav-links.goals.link"),
    },
    {
      title: t("nav-links.income-expenses.title"),
      icon: t("nav-links.income-expenses.icon"),
      link: t("nav-links.income-expenses.link"),
    },
    {
      title: t("nav-links.subscriptions.title"),
      icon: t("nav-links.subscriptions.icon"),
      link: t("nav-links.subscriptions.link"),
    },
    {
      title: t("nav-links.statistics.title"),
      icon: t("nav-links.statistics.icon"),
      link: t("nav-links.statistics.link"),
    },
  ];
  const pathname = usePathname();
  let pageName;
  let form;
  let title = "";
  let buttonText = "";
  let description = "";
  if (pathname.includes("goals")) {
    pageName = "Goly";
    title = "Přidat Goal";
    description = "přidání nového cíle";
    form = <AddGoalForm />;
  } else if (pathname.includes("transactions")) {
    pageName = "Transakce";
    title = "Přidat transakci";
    description = "přidání nové transakce transakce";
    form = <AddTransactionForm />;
  } else if (pathname.includes("dashboard")) {
    pageName = "Family Finances";
  } else if (pathname.includes("settings")) {
    pageName = "Nastavení";
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
                buttonText={buttonText}
                titleCenter
              >
                {/*<AddTransactionForm />*/}
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
          Logout
        </button>

        <DropdownUserMenu />
      </div>
    </nav>
  );
};

export default Navbar;
