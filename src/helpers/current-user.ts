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
  return existingAccount;
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

export const userTransactions = async (transactionType: any) => {
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

  return allTransactions;
};
