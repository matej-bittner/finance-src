"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import DialogContentWrapper from "@/components/protected/dialog/DialogContentWrapper";
import EditTransactionForm from "@/components/protected/dialog/EditTransactionForm";
import Image from "next/image";
import { TransactionData } from "@/types";
import { currencies } from "@/constants";

// export const columns: ColumnDef<Transaction>[] = [

export const columnsnew: ColumnDef<TransactionData>[] = [
  {
    accessorKey: "date",
    header: "Datum",
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"));
      return <p className="">{date.toLocaleDateString()}</p>;
    },
  },
  {
    accessorKey: "accountTo.name",
    header: "Účet",
  },
  {
    accessorKey: "amount",
    header: "Částka",
    cell: ({ row }) => {
      const amount = row.original.amount;
      const currency = row.original.currency;
      const symbol = currencies.find((item) => item.value === currency)?.symbol;

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
    header: "Název",
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
            <DialogContentWrapper
              title="Transakce"
              description="upravení transakce"
            >
              <EditTransactionForm data={data} />
            </DialogContentWrapper>
          </DialogContent>
        </Dialog>
      );
    },
  },
];
