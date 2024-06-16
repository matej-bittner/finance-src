import React from "react";
import Link from "next/link";

const UpcomingPayments = () => {
  return (
    <div className="box flex flex-col gap-2 min-[450px]:gap-3 w-full max-w-[380px] shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
      <div className="flex items-center">
        <div className="flex flex-col items-center justify-around rounded-md bg-[#B1B1B1] aspect-[4/5] h-[50px]">
          <p className="font-medium">LED</p>
          <p className="text-sm">14</p>
        </div>
        <div className="flex flex-col flex-1 pl-2 min-[350px]:pl-4 min-[400px]:pl-5 sm:pl-2">
          <p className="font-semibold max-md:text-sm">Pojištění domácnosti</p>
          <p className="text-sm">poslední platba 20.4.2024</p>
        </div>
        <div className="flex flex-col text-sm items-center justify-center">
          <p>1920</p>
          <p>CZK</p>
        </div>
      </div>
      <hr className="w-[90%] border-black mx-auto" />
      <div className="flex items-center">
        <div className="flex flex-col items-center justify-around rounded-md bg-[#B1B1B1] aspect-[4/5] h-[50px]">
          <p className="font-medium">LED</p>
          <p className="text-sm">14</p>
        </div>
        <div className="flex flex-col flex-1 pl-2 min-[350px]:pl-4 min-[400px]:pl-5 sm:pl-2">
          <p className="font-semibold max-md:text-sm">Pojištění domácnosti</p>
          <p className="text-sm">poslední platba 20.4.2024</p>
        </div>
        <div className="flex flex-col text-sm items-center justify-center">
          <p>1920</p>
          <p>CZK</p>
        </div>
      </div>
      <hr className="w-[90%] border-black mx-auto max-xl:hidden " />
      <div className="flex items-center max-xl:hidden">
        <div className="flex flex-col items-center justify-around rounded-md bg-[#B1B1B1] aspect-[4/5] h-[50px]">
          <p className="font-medium">LED</p>
          <p className="text-sm">14</p>
        </div>
        <div className="flex flex-col flex-1 pl-2 min-[350px]:pl-4 min-[400px]:pl-5 sm:pl-2">
          <p className="font-semibold max-md:text-sm">Pojištění domácnosti</p>
          <p className="text-sm">poslední platba 20.4.2024</p>
        </div>
        <div className="flex flex-col text-sm items-center justify-center">
          <p>1920</p>
          <p>CZK</p>
        </div>
      </div>
      <Link href="/" className="underline text-sm text-center">
        Zobrazit vše
      </Link>
    </div>
  );
};

export default UpcomingPayments;
