import React from "react";
import { columns, Transaction } from "./columns";
import { DataTable } from "@/components/protected/table/DataTable";
import { userTransactions } from "@/helpers/current-user";
import { columnsnew } from "@/app/[locale]/(protected)/dashboard/transactions/columnsnew";
import { TransactionData } from "@/types";

const data: Transaction[] = [
  {
    id: "m5gr84i9",
    date: "11.6.2024",
    account: "144545adasd",
    amount: 150000,
    currency: "CZK",
    name: "Výplata",
  },
  {
    id: "3u1reuv4",
    date: "11.6.2024",
    account: "144545adasd",
    amount: 150000,
    currency: "CZK",
    name: "Výplata",
  },
  {
    id: "derv1ws0",
    date: "11.6.2024",
    account: "144545adasd",
    amount: 150000,
    currency: "CZK",
    name: "Výplata",
  },
  {
    id: "5kma53ae",
    date: "11.6.2024",
    account: "144545adasd",
    amount: 150000,
    currency: "CZK",
    name: "Výplata",
  },
  {
    id: "bhqecj4p",
    date: "11.6.2024",
    account: "144545adasd",
    amount: 150000,
    currency: "CZK",
    name: "Výplata",
  },
];

const TransactionPage = async () => {
  const allTransaction: TransactionData[] = await userTransactions(3);
  // console.log(allTransaction);
  return (
    <div className="flex flex-col">
      <DataTable columns={columnsnew} data={allTransaction} title="Příjmy" />
      <DataTable columns={columns} data={data} title="Výdaje" />
    </div>
  );
};

export default TransactionPage;
