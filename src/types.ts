export type UserAccount = {
  value: string;
  label: string;
  type: string | null;
  number: string | null;
  balance: number;
  currency: string;
  userId: string | null;
  blockedForGoals: boolean;
}[];

export type GoalData = {
  id: string;
  name: string;
  finishDate: Date;
  color: string;
  icon: string;
  amount: number;
  userId: string;
  user: { mainCurrency: string };
  paymentAccount: {
    id: string;
    balance: number;
    currency: string;
  }[];
};

export type ColorType = {
  id: number;
  color: string;
  background: string;
  stroke: string;
  fill: string;
};

export type TransactionData = {
  id: string;
  transactionType: number;
  name: string;
  description: string | null;
  amount: number;
  currency: string;
  date: Date;
  frequency: number | null;
  category: null | string;
  userId: string | null;
  accountToId: string | null;
  accountFromId: string | null;
  accountFrom: { name: string } | null;
  accountTo: { name: string } | null;
  user: { mainCurrency: string } | null;
};
// export type TransactionData = {
//   id: string;
//   transactionType: number;
//   name: string;
//   description?: string;
//   amount: number;
//   currency: string;
//   date: Date;
//   frequency: number | null;
//   userId: string;
//   accountToId: string | null;
//   accountFromId: string | null;
// };
