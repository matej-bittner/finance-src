import React from "react";
import { columns, Transaction } from "./columns";
import { DataTable } from "@/components/protected/table/DataTable";
import { userTransactions } from "@/helpers/current-user";

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

const Page = async () => {
  const allTransaction = await userTransactions(1);
  return (
    <div className="flex flex-col">
      <DataTable columns={columns} data={data} title="Příjmy" />
      <DataTable columns={columns} data={data} title="Výdaje" />
    </div>
  );
};

export default Page;
