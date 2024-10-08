"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import DialogContentWrapper from "@/components/protected/dialog/DialogContentWrapper";
import EditTransactionForm from "@/components/protected/dialog/EditTransactionForm";
import Image from "next/image";
import { TransactionData } from "@/types";
import { useTranslations } from "next-intl";
import { findCurrencySymbol } from "@/helpers/generalFunctions";

export const useColumns = (): ColumnDef<TransactionData>[] => {
  const t = useTranslations("protected-dialog");
  return [
    {
      accessorKey: "date",
      header: t(`date`),
      cell: ({ row }) => {
        const date = new Date(row.getValue("date"));
        return <p>{date.toLocaleDateString()}</p>;
      },
    },
    {
      header: t(`account`),
      cell: (info) => {
        const row = info.row.original;
        if (row.accountTo?.name && row.accountFrom?.name) {
          return (
            <div className="flex flex-col">
              <p className="font-medium">
                z: <span className="font-normal">{row.accountFrom.name}</span>
              </p>
              <p className="font-medium">
                na: <span className="font-normal">{row.accountTo.name}</span>
              </p>
            </div>
          );
        } else {
          return row.accountTo?.name || row.accountFrom?.name || "No Account";
        }
      },
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
        if (!data.transactionType) return;
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
                title={t(`edit-transaction`)}
                description={t(`edit-transaction-desc`)}
                titleCenter
              >
                <EditTransactionForm data={data} />
              </DialogContentWrapper>
            </DialogContent>
          </Dialog>
        );
      },
    },
  ];
};

//
// "use client";
//
// import { ColumnDef } from "@tanstack/react-table";
//
// import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
// import DialogContentWrapper from "@/components/protected/dialog/DialogContentWrapper";
// import EditTransactionForm from "@/components/protected/dialog/EditTransactionForm";
// import Image from "next/image";
// import { TransactionData } from "@/types";
// import { currencies } from "@/constants";
// import { useTranslations } from "next-intl";
//
// export const columns: ColumnDef<TransactionData>[] = [
//   {
//     accessorKey: "date",
//     header: "Datum",
//     cell: ({ row }) => {
//       const date = new Date(row.getValue("date"));
//       return <p>{date.toLocaleDateString()}</p>;
//     },
//   },
//   {
//     header: "Účet",
//     cell: (info) => {
//       const row = info.row.original;
//       if (row.accountTo?.name && row.accountFrom?.name) {
//         return (
//           <div className="flex flex-col">
//             <p className="font-medium">
//               z: <span className="font-normal">{row.accountFrom.name}</span>
//             </p>
//             <p className="font-medium">
//               na: <span className="font-normal">{row.accountTo.name}</span>
//             </p>
//           </div>
//         );
//       } else {
//         return row.accountTo?.name || row.accountFrom?.name || "No Account";
//       }
//     },
//   },
//   {
//     accessorKey: "amount",
//     header: "Částka",
//     cell: ({ row }) => {
//       const amount = row.original.amount;
//       const currency = row.original.currency;
//       const symbol = currencies.find((item) => item.value === currency)?.symbol;
//
//       return (
//         <p>
//           {symbol
//             ? new Intl.NumberFormat().format(amount) + " " + symbol
//             : new Intl.NumberFormat().format(amount) +
//             " " +
//             currency.toUpperCase()}
//         </p>
//       );
//     },
//   },
//   {
//     accessorKey: "name",
//     header: "Název",
//   },
//   {
//     id: "actions",
//     cell: ({ row }) => {
//       const data = row.original;
//
//       return (
//         <Dialog>
//           <DialogTrigger>
//             <Image
//               src="/icons/dots.svg"
//               alt="show more"
//               width={20}
//               height={20}
//               className="min-w-[20px] min-h-[20px]"
//             />
//           </DialogTrigger>
//           <DialogContent
//             id="dialog-content"
//             className="bg-main-gray text-black rounded-md"
//           >
//             <DialogContentWrapper
//               title="Transakce"
//               description="upravení transakce"
//               titleCenter
//             >
//               <EditTransactionForm data={data} />
//             </DialogContentWrapper>
//           </DialogContent>
//         </Dialog>
//       );
//     },
//   },
// ];
