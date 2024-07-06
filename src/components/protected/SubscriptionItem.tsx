import React from "react";
import { frequencies } from "@/constants";
import Image from "next/image";
import DialogContentWrapper from "@/components/protected/dialog/DialogContentWrapper";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import EditTransactionForm from "@/components/protected/dialog/EditTransactionForm";
import { useTranslations } from "next-intl";
import { findCurrencySymbol } from "@/helpers/generalFunctions";

const SubscriptionItem = ({ sub }: any) => {
  const t = useTranslations("protected-dialog");
  return (
    <div className="bg-main-gray relative w-full max-w-[90%] h-fit rounded-2xl flex flex-col px-4 py-2 gap-2 sm:py-3 sm:rounded-xl sm:gap-3 tb:max-w-[500px] md:max-w-[750px] md:px-6 2xl:h-full 2xl:justify-center">
      <div className="flex max-[350px]:flex-col w-full gap-2 max-[350px]:items-center justify-around sm:max-w-[90%] sm:mx-auto md:max-w-full md:gap-6">
        <div className="max-sm:w-[30%] min-w-fit flex items-center justify-center max-[350px]:order-2">
          <p className="font-medium text-[18px] sm:hidden">2900 Kč</p>
          <div className="hidden sm:flex flex-col items-center justify-center gap-2 rounded-md bg-[#B1B1B1] aspect-[4/5] h-[80px] md:min-h-[100px]">
            <p className="font-semibold text-[18px]">
              {sub.toProcess
                .toLocaleString("default", {
                  month: "short",
                })
                .toUpperCase()}
            </p>
            <p className="font-medium">
              {sub.toProcess.toLocaleString("default", {
                day: "numeric",
              })}
            </p>
          </div>
        </div>
        <div className="flex gap-1 min-[500px]:w-[250px] sm:w-full items-center sm:justify-around md:gap-4 ">
          <div className="flex flex-col gap-1 sm:flex-1 ">
            <h2 className="no-underline p-0">{sub.name}</h2>
            <p className="max-lg:text-sm">
              {
                frequencies.find((freq) => Number(freq.value) === sub.frequency)
                  ?.title
              }
            </p>
            <p className="max-lg:text-sm">
              {t(`last-payment`)}{" "}
              {sub.lastProcessed
                ? sub.lastProcessed.toLocaleDateString()
                : "--------"}
            </p>
            <p className="text-sm sm:hidden">
              {/*{t(`next-payment`)} {sub.toProcess.toLocaleDateString()}*/}
              Další platba
            </p>
            {sub.description && (
              <p className="hidden text-sm md:block pt-2 max-w-[90%]">
                {sub.description}
              </p>
            )}
          </div>
          <div className="max-sm:hidden border-main-blue border-2 rounded-xl py-2 px-3 font-medium lg:px-4">
            <p className="text-nowrap">
              {sub.amount} {findCurrencySymbol(sub.currency)}
            </p>
          </div>
          <div className="absolute  right-1 top-1">
            <Dialog>
              <DialogTrigger>
                <Image
                  src="/icons/line-arrow-up.svg"
                  alt="show more"
                  width={20}
                  height={20}
                  className="min-w-[20px] min-h-[20px] rotate-45"
                />
              </DialogTrigger>
              <DialogContent
                id="dialog-content"
                className="bg-main-gray text-black rounded-md"
              >
                <DialogContentWrapper
                  title={t(`edit-subscription`)}
                  description={t(`edit-subscription-desc`)}
                  titleCenter
                >
                  <EditTransactionForm data={sub} />
                </DialogContentWrapper>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
      {sub.description && (
        <div className="flex flex-col items-center gap-2 md:hidden">
          <hr className="w-[80%] border-black" />
          <p className="text-sm text-center max-w-[350px]">{sub.description}</p>
        </div>
      )}
    </div>
  );
};

export default SubscriptionItem;
