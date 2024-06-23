export type UserAccount = {
  id: string;
  type: string | null;
  name: string;
  number: string | null;
  balance: number;
  currency: string;
  blockedForGoals: number;
  userId: string | null;
}[];

export type UserAccountFormatted = {
  value: string;
  type: string | null;
  label: string;
  number: string | null;
  balance: number;
  currency: string;
  blockedForGoals: number;
  userId: string | null;
  wantToBlock: number;
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
  description?: string;
  amount: number;
  currency: string;
  date: Date;
  frequency?: number;
  category?: string;
  userId: string;
  accountToId?: string;
  accountFromId?: string;
};
