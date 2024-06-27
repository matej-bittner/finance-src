"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import DialogContentWrapper from "@/components/protected/dialog/DialogContentWrapper";
import EditTransactionForm from "@/components/protected/dialog/EditTransactionForm";
import Image from "next/image";
import { TransactionData } from "@/types";

export type Transaction = {
  id: string;
  date: string;
  account: string;
  amount: number;
  currency: string;
  name: string;
};

// export const columns: ColumnDef<Transaction>[] = [
export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "date",
    header: "Datum",
  },
  {
    accessorKey: "account",
    header: "Účet",
  },
  {
    accessorKey: "amount",
    header: "Částka",
  },
  {
    accessorKey: "currency",
    header: "Měna",
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
              // showDeleteButton
            >
              <p>asd</p>
              {/*<EditTransactionForm data={data} />*/}
            </DialogContentWrapper>
          </DialogContent>
        </Dialog>
      );
    },
  },
];
