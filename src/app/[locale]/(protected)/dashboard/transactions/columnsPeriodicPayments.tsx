"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import DialogContentWrapper from "@/components/protected/dialog/DialogContentWrapper";
import EditTransactionForm from "@/components/protected/dialog/EditTransactionForm";
import Image from "next/image";
import { PeriodicPaymentData } from "@/types";
import { useTranslations } from "next-intl";
import { findCurrencySymbol } from "@/helpers/generalFunctions";

export const useColumnsPeriodicPayments =
  (): ColumnDef<PeriodicPaymentData>[] => {
    const t = useTranslations("protected-dialog");

    return [
      {
        accessorKey: "lastProcessed",
        header: t(`last-payment`),
        cell: ({ row }) => {
          if (row.getValue("lastProcessed") === null) {
            return <p>-</p>;
          } else {
            const date = new Date(row.getValue("lastProcessed"));
            return <p>{date.toLocaleDateString()}</p>;
          }
        },
      },
      {
        accessorKey: "firstPayment",
        header: t(`since`),
        cell: ({ row }) => {
          const date = new Date(row.getValue("firstPayment"));
          return <p>{date.toLocaleDateString()}</p>;
        },
      },
      {
        accessorKey: "accountFrom.name",
        header: t(`from-account`),
      },
      {
        accessorKey: "amount",
        header: t(`amount`),
        cell: ({ row }) => {
          const amount = row.original.amount;
          const currency = row.original.currency;
          const symbol = findCurrencySymbol(currency);

          return (
            <p>
              {symbol
                ? new Intl.NumberFormat().format(amount) + " " + symbol
                : new Intl.NumberFormat().format(amount) +
                  " " +
                  currency.toUpperCase()}
            </p>
          );
        },
      },
      {
        accessorKey: "name",
        header: t(`name`),
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const data = row.original;

          return (
            <Dialog>
              <DialogTrigger>
                <Image
                  src="/icons/dots.svg"
                  alt="show more"
                  width={20}
                  height={20}
                  className="min-w-[20px] min-h-[20px]"
                />
              </DialogTrigger>
              <DialogContent
                id="dialog-content"
                className="bg-main-gray text-black rounded-md"
              >
                {data.accountFrom?.type === 2 ? (
                  <DialogContentWrapper
                    title={t(`edit-transaction`)}
                    titleCenter
                  >
                    <p className="w-full text-center">{t("table-no-edit")}</p>
                  </DialogContentWrapper>
                ) : (
                  <DialogContentWrapper
                    title={t(`edit-transaction`)}
                    description={t(`edit-transaction-desc`)}
                    titleCenter
                  >
                    <EditTransactionForm data={data} />
                  </DialogContentWrapper>
                )}
              </DialogContent>
            </Dialog>
          );
        },
      },
    ];
  };
