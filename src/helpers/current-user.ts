import { auth } from "@/auth";
import { db } from "@/lib/db";

export const currentUser = async () => {
  const session = await auth();
  return session?.user;
};

export const userAccounts = async () => {
  const session = await auth();

  const existingAccount = await db.paymentAccount.findMany({
    where: { userId: session?.user?.id },
  });

  if (!existingAccount) return [];

  const dataFormatted = existingAccount.map((item) => ({
    value: item.id,
    label: `${item.name}` + `(${item.currency})`,
    type: item.type,
    number: item.number,
    balance: item.balance,
    currency: item.currency,
    userId: item.userId,
    blockedForGoals: item.blockedForGoal,
  }));
  return dataFormatted;
};

export const userGoals = async () => {
  const session = await auth();

  const allGoals = await db.goal.findMany({
    where: {
      userId: session?.user?.id,
    },
    include: {
      paymentAccount: {
        select: {
          id: true,
          balance: true,
          currency: true,
        },
      },
      user: {
        select: {
          mainCurrency: true,
        },
      },
    },
  });

  if (!allGoals) return [];

  return allGoals;
};

export const userTransactions = async (transactionType: number) => {
  const session = await auth();

  const allTransactions = await db.transaction.findMany({
    where: {
      userId: session?.user?.id,
      transactionType,
    },
    include: {
      accountFrom: {
        select: {
          name: true,
        },
      },
      accountTo: {
        select: {
          name: true,
        },
      },
      user: {
        select: {
          mainCurrency: true,
        },
      },
    },
  });

  // if (transactionType === 1) {
  //   return allTransactions.map((transaction) => {
  //     const modifiedTransaction = { ...transaction };
  //     // @ts-ignore
  //     modifiedTransaction.acc = transaction.accountTo?.name;
  //     return modifiedTransaction;
  //   });
  // }
  // if (transactionType === 2 || transactionType === 4) {
  //   return allTransactions.map((transaction) => {
  //     const modifiedTransaction = { ...transaction };
  //     // @ts-ignore
  //     modifiedTransaction.acc = transaction.accountFrom?.name;
  //     return modifiedTransaction;
  //   });
  // }

  return allTransactions;
};
