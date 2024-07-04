export type UserAccount = {
  value: string;
  label: string;
  name: string;
  type: number;
  number: string | null;
  balance: number;
  currency: string;
  userId: string | null;
  blockedForGoals: boolean;
  updateBalance?: {
    amount: number;
    currency: string;
    id: string;
    paymentAccountId: string;
    date: Date;
    firstBalance?: boolean;
  }[];
  periodicPayment?: {
    frequency: number;
    amount: number;
    toProcess: Date;
    accountFromId: string;
    id: string;
    category?: number;
  }[];
};
// export type UserAccount = {
//   value: string;
//   label: string;
//   name: string;
//   type: number;
//   number: string | null;
//   balance: number;
//   currency: string;
//   userId: string | null;
//   blockedForGoals: boolean;
//   updateBalance:
//     | {
//         amount: number;
//         currency: string;
//         id: string;
//         paymentAccountId: string;
//         date: Date;
//         firstBalance?: boolean;
//       }[]
//     | undefined;
//   periodicPayment:
//     | {
//         frequency: number;
//         amount: number;
//         toProcess: Date;
//         accountFromId: string;
//         id: string;
//       }[]
//     | undefined;
// };

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
  category: null | number;
  userId: string | null;
  accountToId: string | null;
  accountFromId: string | null;
  accountFrom: { name: string } | null;
  accountTo: { name: string } | null;
  user: { mainCurrency: string } | null;
};

export type PeriodicPaymentData = {
  id: string;
  transactionType: number;
  firstPayment: Date;
  endOfPayment: Date | null;
  toProcess: Date;
  lastProcessed: Date | null;
  name: string;
  description: string | null;
  amount: number;
  currency: string;
  frequency: number;
  category: number | null;
  accountFromId: string;
  accountFrom: { name: string; type: number } | null;
  user: { mainCurrency: string } | null;
};

export type EditTransactionProps = {
  firstPayment?: Date;
  endOfPayment?: Date | null;
  toProcess?: Date;
  lastProcessed?: Date | null;
  date?: Date;

  id: string;
  transactionType: number;
  name: string;
  description: string | null;
  amount: number;
  currency: string;
  frequency: number | null;
  category: null | number;
  accountToId?: string | null;
  accountFromId: string | null;
  accountFrom: { name: string } | null;
  accountTo?: { name: string } | null;
  user: { mainCurrency: string } | null;
};
