import { auth } from "@/auth";
import { db } from "@/lib/db";
import { UserAccount } from "@/types";

export const currentUser = async () => {
  const session = await auth();
  return session?.user;
};

export const userAccounts = async (typeToRemove?: number) => {
  const session = await auth();
  const existingAccount = await db.paymentAccount.findMany({
    where: { userId: session?.user?.id },
  });

  if (!existingAccount) return [];
  const accountsWithRelations = await Promise.all(
    existingAccount.map(async (account) => {
      if (account.type === 4) {
        const updateBalance = await db.updateBalance.findMany({
          where: { paymentAccountId: account.id },
          orderBy: {
            date: "desc",
          },
        });
        return { ...account, updateBalance };
      } else if (account.type === 2) {
        const periodicPayment = await db.periodicPayment.findMany({
          where: { accountFromId: account.id },
          select: {
            frequency: true,
            amount: true,
            toProcess: true,
            accountFromId: true,
            id: true,
            category: true,
          },
        });
        return { ...account, periodicPayment };
      }
      return account;
    }),
  );

  // const dataFormatted = existingAccount.map((item) => ({
  //   value: item.id,
  //   label: `${item.name}` + `(${item.currency})`,
  //   type: item.type,
  //   name: item.name,
  //   number: item.number,
  //   balance: item.balance,
  //   currency: item.currency,
  //   userId: item.userId,
  //   blockedForGoals: item.blockedForGoal,
  // }));

  const dataFormatted: UserAccount[] = accountsWithRelations.map((item) => ({
    value: item.id,
    label: `${item.name}` + `(${item.currency})`,
    type: item.type,
    name: item.name,
    number: item.number,
    balance: item.balance,
    currency: item.currency,
    userId: item.userId,
    blockedForGoals: item.blockedForGoal,

    updateBalance: (item as any).updateBalance, // Type assertion to include updateBalance
    periodicPayment: (item as any).periodicPayment,
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

export const dashboardTransactions = async () => {
  const session = await auth();
  const transactions = await db.transaction.findMany({
    where: {
      userId: session?.user.id,
    },
    orderBy: [
      {
        date: "desc",
      },
    ],
    take: 10,
    select: {
      date: true,
      name: true,
      amount: true,
      accountFromId: true,
      accountToId: true,
      currency: true,
    },
  });
  return transactions;
};
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
        date: "desc",
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
export const userPeriodicPayments = async (transactionType?: number) => {
  const session = await auth();
  const whereClause = {
    userId: session?.user?.id,
    ...(transactionType !== undefined && { transactionType: transactionType }),
  };

  const limit = transactionType === undefined ? 3 : undefined;

  const allPeriodicPayment = await db.periodicPayment.findMany({
    where: whereClause,
    orderBy: [
      {
        toProcess: "asc",
      },
    ],
    take: limit, // Conditionally limit the number of items
    include: {
      accountFrom: {
        select: {
          name: true,
          type: true,
        },
      },

      user: {
        select: {
          mainCurrency: true,
        },
      },
    },
  });

  return allPeriodicPayment;
};

// export const userSubscriptions = async () => {
//   const session = await auth();
//
//   const allSubscriptions = await db.periodicPayment.findMany({
//     where: {
//       userId: session?.user?.id,
//       transactionType: 5,
//     },
//     orderBy: [
//       {
//         firstPayment: "asc",
//       },
//     ],
//     include: {
//       accountFrom: {
//         select: {
//           name: true,
//         },
//       },
//
//       user: {
//         select: {
//           mainCurrency: true,
//         },
//       },
//     },
//   });
//
//   return allSubscriptions;
// };

export const test = async () => {
  let todayDate = new Date();
  todayDate.setUTCHours(0, 0, 0, 0);

  //find all periodicPayments that i need to update
  const paymentsToUpdate = await db.periodicPayment.findMany({
    where: {
      toProcess: { equals: todayDate },
      OR: [{ lastProcessed: { lt: todayDate } }, { lastProcessed: null }],
      AND: [
        {
          OR: [{ endOfPayment: { gte: todayDate } }, { endOfPayment: null }],
        },
      ],
    },
  });

  const paymentFrequencyUpdateData = paymentsToUpdate.map((payment) => ({
    id: payment.id,
    frequency: payment.frequency,
  }));
  for (const periodicPayment of paymentFrequencyUpdateData) {
    let date = new Date();
    date.setUTCHours(0, 0, 0, 0);
    console.log(periodicPayment);
    if (periodicPayment.frequency === 7 || periodicPayment.frequency === 14) {
      date.setDate(date.getDate() + periodicPayment.frequency); // Add days
    } else if (periodicPayment.frequency === 30) {
      date.setMonth(date.getMonth() + 1); // Add 1 month
    } else if (periodicPayment.frequency === 60) {
      date.setMonth(date.getMonth() + 2); // Add 2 months
    }

    await db.periodicPayment.updateMany({
      where: {
        id: periodicPayment.id,
      },
      data: { lastProcessed: todayDate, toProcess: date },
    });
  }

  // filtering only neccessary info fro creating transaction
  const transactionsData = paymentsToUpdate.map((payment) => ({
    transactionType: 2,
    name: payment.name,
    description: payment.description,
    amount: payment.amount,
    currency: payment.currency,
    date: todayDate,
    accountFromId: payment.accountFromId,
    category: payment.category,
    userId: payment.userId,
  }));

  await db.transaction.createMany({
    data: transactionsData,
  });

  const accountUpdates = transactionsData.map((transaction) => ({
    id: transaction.accountFromId,
    amount: transaction.amount,
  }));

  // decreasing balance by periodicPaymentAmmount
  for (const account of accountUpdates) {
    await db.paymentAccount.updateMany({
      where: {
        id: account.id,
      },
      data: {
        balance: {
          decrement: account.amount,
        },
      },
    });
  }

  return;
};
