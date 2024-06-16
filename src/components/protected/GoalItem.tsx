"use client";
import React, { useState } from "react";
import Image from "next/image";
import CircleProgressBar from "@/components/ui/circle-progress-bar";

interface GoalItemProps {
  goalData: {
    finalDate: string;
    name: string;
    id: number;
    currentBalance: number;
    finalBalance: number;
    color: string;
  }[];
}

const GoalItem = ({ goalData }: GoalItemProps) => {
  const [openBalance, setOpenBalance] = useState(-1);

  return (
    <div className="grid grid-cols-1 min-[420px]:grid-cols-2 min-[920px]:grid-cols-3 min-[1350px]:grid-cols-4 2xl:grid-cols-5 min-[1900px]:grid-cols-6 place-items-center items-center  ">
      {goalData.map((goal) => {
        let percentage = Math.round(
          (goal.currentBalance / goal.finalBalance) * 100,
        );
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
                  onClick={() => setOpenBalance(-1)}
                  className="rotate-90 absolute top-2 cursor-pointer"
                />
                <p className="text-main-success">{goal.currentBalance}</p>
                <p className="leading-tight text-sm">z</p>
                <p>{goal.finalBalance}</p>
                <p className="absolute bottom-5 font-normal">({percentage}%)</p>
              </div>
            )}
            <div className="w-[78%] left-[11%] h-[78%] top-[11%] absolute flex flex-col items-center py-3 justify-between">
              <div className="flex flex-col items-center flex-1 ">
                <p className="max-lg:text-sm">{goal.finalDate}</p>
                <p className="font-semibold min-[500px]:text-lg">{goal.name}</p>
                <div className="flex  flex-1 flex-col items-center justify-center">
                  <p className="text-3xl font-medium min-[500px]:hidden">66%</p>
                  <Image
                    src="/goal-icons/house.svg"
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
                <p className="text-sm underline">editovat</p>
              </div>
            </div>
            <CircleProgressBar percentage={percentage} color={goal.color} />
          </div>
        );
      })}
    </div>
  );
};

export default GoalItem;
