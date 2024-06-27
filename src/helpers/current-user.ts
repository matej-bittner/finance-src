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
    name: item.name,
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

// export const userTransactions = async (transactionType: number) => {
export const userTransactions = async (monthToQuery: string) => {
  const session = await auth();
  const month = parseInt(monthToQuery as string, 10);
  let year = new Date().getFullYear();
  if (month > new Date().getMonth() + 1) {
    year -= 1; // If the specified month is greater than the current month, it means we're looking at the previous year
  }
  const startDate = new Date(year, month - 1, 1); // Months are 0-based in JavaScript Date
  const endDate = new Date(year, month, 0, 23, 59, 59); // Last day of the month, 23:59:59
  const allTransactions = await db.transaction.findMany({
    where: {
      userId: session?.user?.id,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: [
      {
        date: "asc",
      },
    ],
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
