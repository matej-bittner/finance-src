"use client";
import React, { useState } from "react";
import Image from "next/image";

import { GoalData, UserAccount } from "@/types";
import { colors, currencies } from "@/constants";
import CircleProgressBar from "@/components/ui/circle-progress-bar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import DialogContentWrapper from "@/components/protected/dialog/DialogContentWrapper";
import EditGoalForm from "@/components/protected/dialog/EditGoalForm";
import { deleteGoal } from "@/actions/delete";

interface GoalItemProps {
  goalData: GoalData[];
  userCurrencyConvert: any;
  userAccounts: UserAccount;
}

const GoalItem = ({
  goalData,
  userCurrencyConvert,
  userAccounts,
}: GoalItemProps) => {
  const [openBalance, setOpenBalance] = useState("");
  const currencySymbol = currencies.find(
    (currency) => currency.value === goalData[0].user.mainCurrency,
  );
  let wasConverted = "";
  return (
    <div className="grid grid-cols-1 min-[420px]:grid-cols-2 min-[920px]:grid-cols-3 min-[1350px]:grid-cols-4 2xl:grid-cols-5 min-[1900px]:grid-cols-6 place-items-center items-center  ">
      {goalData.map((goal) => {
        const finalDate = goal.finishDate.toLocaleDateString();

        const extractAndSumBalances = (data: GoalData) => {
          // Check if paymentAccount exists and has elements
          if (data.paymentAccount && data.paymentAccount.length > 0) {
            // Sum balances within paymentAccount array
            const accountBalances = data.paymentAccount.map((account) => {
              if (account.currency === data.user.mainCurrency) {
                return account.balance;
              } else if (
                userCurrencyConvert.hasOwnProperty(
                  account.currency.toUpperCase(),
                )
              ) {
                const value =
                  1 / userCurrencyConvert[account.currency.toUpperCase()];
                wasConverted = "~";
                return Math.round(value * account.balance);
              } else {
                return account.balance;
              }
            });
            const accountSum = accountBalances.reduce(
              (innerAcc, value) => innerAcc + value,
              0,
            );
            return accountSum;
          }
          return 0; // Return accumulator if no paymentAccount or empty
        };

        // };
        const totalBalance = extractAndSumBalances(goal);
        let percentage = Math.round((totalBalance / goal.amount) * 100);

        const color = colors.find((color) => color.color === goal.color);

        return (
          <div
            key={goal.id}
            className="flex aspect-square relative w-full max-w-[220px] min-[350px]:max-w-[250px] sm:max-w-[290px]"
          >
            {openBalance === goal.id && (
              <div className="w-[78%] left-[11%] h-[78%] top-[11%] rounded-full absolute bg-main-bg z-10 flex flex-col items-center py-3 justify-center font-semibold text-lg sm:text-xl">
                <Image
                  src="/icons/expand-right.svg"
                  alt="show-less"
                  width={35}
                  height={35}
                  onClick={() => setOpenBalance("")}
                  className="rotate-90 absolute top-2 cursor-pointer"
                />
                <p className="text-main-success">
                  {wasConverted}
                  {totalBalance.toLocaleString("fr")}{" "}
                  {currencySymbol && currencySymbol.symbol}
                </p>
                <p className="leading-tight text-sm">z</p>
                <p>{goal.amount.toLocaleString("fr")}</p>
                <p className="absolute bottom-5 font-normal">
                  ({percentage > 100 ? ">100" : percentage}%)
                </p>
              </div>
            )}
            <div className="w-[78%] left-[11%] h-[78%] top-[11%] absolute flex flex-col items-center py-3 justify-between">
              <div className="flex flex-col items-center flex-1 ">
                <p className="max-lg:text-sm">{finalDate}</p>
                <p className="font-semibold min-[500px]:text-lg">{goal.name}</p>
                <div className="flex  flex-1 flex-col items-center justify-center">
                  <p className="text-3xl font-medium min-[500px]:hidden">
                    {percentage > 100 ? ">100" : percentage}%
                  </p>
                  <Image
                    src={`/goal-icons/${goal.icon}.svg`}
                    alt="house"
                    width={45}
                    height={45}
                    className="hidden cursor-pointer min-[500px]:flex sm:w-[55px] lg:w-[60px] aspect-square"
                  />
                  <Image
                    src="/icons/dots.svg"
                    alt="show-more"
                    width={25}
                    height={25}
                    className="cursor-pointer"
                    onClick={() => setOpenBalance(goal.id)}
                  />
                </div>
              </div>
              <div className="flex flex-col items-center  w-full">
                <p className="text-sm underline">připojit účet</p>
                <Dialog>
                  <DialogTrigger>
                    <p className="text-sm underline">editovat</p>
                  </DialogTrigger>
                  <DialogContent
                    id="dialog-content"
                    className="bg-main-gray text-black rounded-md"
                  >
                    <DialogContentWrapper
                      title="Editovat Goal"
                      description="editace golu"
                      titleCenter
                    >
                      <EditGoalForm
                        userAccounts={userAccounts}
                        goalData={goal}
                      />
                    </DialogContentWrapper>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <CircleProgressBar percentage={percentage} color={color} />
          </div>
        );
      })}
    </div>
  );
};

export default GoalItem;
