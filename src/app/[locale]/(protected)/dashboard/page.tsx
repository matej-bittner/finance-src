import React from "react";

import { useTranslations } from "next-intl";
import AccountInfoDisplay from "@/components/protected/dashboard/AccountInfoDisplay";
import UpcomingPayments from "@/components/protected/dashboard/UpcomingPayments";
import ExpensesByCategory from "@/components/protected/dashboard/ExpensesByCategory";
import Image from "next/image";

const DashboardPage = () => {
  const t = useTranslations("dashboard-navigation");
  const accounts = [
    {
      id: 1,
      name: "Hlavní",
      type: "Běžný účet",
      number: "124***445/5050",
      balance: 155500,
    },
    {
      id: 2,

      name: "Spoření",
      type: "Spořící účet",
      balance: 200000,
    },
    {
      id: 3,

      name: "ČSOB",
      type: "Běžný účet",
      number: "128***445/5050",
      balance: 130000,
    },
  ];
  const categories = [
    {
      id: 1,
      title: "Cestování",
      slug: "transport",
      icon: "car",
    },
    {
      id: 2,
      title: "Bydlení",
      slug: "housing",
      icon: "building",
    },

    {
      id: 3,
      title: "Zábava",
      slug: "entertainment",
      icon: "emoji-normal",
    },
    {
      id: 4,
      title: "Jídlo",
      slug: "food",
      icon: "food",
    },
    {
      id: 5,
      title: "Nákupy",
      slug: "shopping",
      icon: "shopping",
    },
    {
      id: 6,
      title: "Ostatní",
      slug: "other",
      icon: "receipt",
    },
  ];

  return (
    <div
      id="dashboard"
      // className="px-2 flex max-lg:flex-col items-center lg:items-start  gap-2 sm:gap-4 2xl:gap-8  xl:justify-center bg-red-300 "
      className="px-2 flex max-lg:flex-col   gap-2 sm:gap-4 2xl:gap-8  xl:justify-center  "
    >
      {/*hidden transaction till 1800px*/}
      <div className="hidden min-[1800px]:flex  w-[300px] flex-col  gap-y-8">
        <div className="w-full flex flex-col space-y-4">
          <h2 className="max-sm:text-center  lg:text-center text-transparent">
            xx
          </h2>
          <div className="box h-[170px] shadow-[0_3px_10px_rgb(0,0,0,0.2)]"></div>
        </div>
        <div className="w-full flex flex-col space-y-4 flex-1 ">
          <h2 className="max-sm:text-center  lg:text-center">
            Poslední Transakce
          </h2>
          <div className="box flex flex-col h-full shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
            <div className="flex w-full py-1 text-sm">
              <p className="min-w-[40px]">20.1.</p>
              <p className="flex-1 text-center font-semibold ">Rohlíky</p>
              <div className="flex items-start font-medium gap-2 text-[#AD0000]">
                <Image
                  src="/icons/transaction-send.svg"
                  alt="car"
                  width={20}
                  height={20}
                />
                <p>20000 CZK</p>
              </div>
            </div>
            <hr className="w-[90%] mx-auto border-black" />
          </div>
        </div>
      </div>
      {/*left*/}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 place-items-center justify-items-center w-full lg:max-w-[400px] xl:max-w-[420px] sm:gap-x-2 gap-y-3 sm:gap-y-4 2xl:gap-y-8">
        {/*accounts*/}
        <div className="flex flex-col w-full sm:col-span-2 space-y-2  xl:space-y-4">
          <h2 className="max-sm:text-center lg:text-center">Celková hodnota</h2>
          <div className="grid grid-cols-1 w-full place-items-center sm:grid-cols-2 lg:grid-cols-1 sm:gap-x-2 gap-y-3 sm:gap-y-4 2xl:gap-y-8">
            <AccountInfoDisplay data={accounts} type="account" />
            <AccountInfoDisplay data={accounts} type="account" />
          </div>
        </div>
        {/*debt*/}
        <div className="flex flex-col w-full items-center space-y-2  xl:space-y-4">
          <h2 className="sm:text-left sm:w-full lg:text-center ">Úvěry </h2>
          <AccountInfoDisplay data={accounts} type="debt" />
        </div>
        {/*upcoming payments*/}
        <div className="lg:hidden w-full flex flex-col items-center justify-center place-self-start space-y-2  xl:space-y-4">
          <h2 className="sm:text-left sm:w-full lg:text-center ">
            Budoucí Platby
          </h2>
          <UpcomingPayments />
        </div>
      </div>
      {/*right*/}
      <div className="max-lg:flex w-full max-md:flex-col items-center md:items-start lg:items-center xl:grid xl:grid-cols-2 xl:max-w-[850px] space-y-3 sm:gap-x-2 sm:space-y-4 xl:space-y-0 xl:gap-4 2xl:gap-8 xl:items-start ">
        {/*upcoming payments*/}
        <div className="max-lg:hidden flex flex-col items-center justify-center space-y-2  xl:space-y-4">
          <h2 className="sm:text-left sm:w-full lg:text-center ">
            Budoucí Platby
          </h2>
          <UpcomingPayments />
        </div>
        {/*categories*/}
        <div className="w-full md:max-w-[210px] lg:max-w-[400px] lg:mx-auto xl:h-full flex flex-col space-y-2  xl:space-y-4">
          <h2 className="text-center">Kategorie </h2>
          <ExpensesByCategory data={categories} />
        </div>
        {/*comparasion*/}
        <div className="flex flex-col w-full lg:col-span-2 space-y-2 xl:space-y-4 xl:h-full">
          <h2 className="text-center">Graf</h2>
          <div className="box w-full h-[300px] xl:flex-grow shadow-[0_3px_10px_rgb(0,0,0,0.2)]"></div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
//
// <div
//   id="dashboard"
//   className="px-2 flex max-lg:flex-col items-center gap-2 xl:items-start xl:justify-start"
// >
//   {/*<h2 className="underline">Celková hodnota</h2>*/}
//   {/*content*/}
//   <div
//     className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 place-items-center justify-items-center w-full sm:gap-2 lg:max-w-[400px] xl:max-w-[450px]">
//     <AccountInfoDisplay data={accounts} type="account" />
//     <AccountInfoDisplay data={accounts} type="account" />
//
//     <AccountInfoDisplay data={accounts} type="debt" />
//     <div className="lg:hidden w-full flex items-center justify-center">
//       <UpcomingPayments />
//     </div>
//   </div>
//   <div
//     className="max-lg:flex w-full max-md:flex-col items-center md:gap-2 md:items-start lg:items-center xl:grid xl:grid-cols-2 xl:max-w-[850px]">
//     <div className="max-lg:hidden flex items-center justify-center">
//       <UpcomingPayments />
//     </div>
//     <div className="w-full md:max-w-[210px] lg:max-w-[400px] lg:mx-auto xl:h-full ">
//       <ExpensesByCategory data={categories} />
//     </div>
//     <div className="box w-full h-[300px] bg-violet-800 lg:col-span-2 "></div>
//   </div>
// </div>
