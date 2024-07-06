import { auth } from "@/auth";
import { db } from "@/lib/db";
import { UserAccount } from "@/types";
import { Prisma } from "@prisma/client";
import { eachDayOfInterval, interval, startOfDay } from "date-fns";
import { convertFrequencyToDate } from "@/helpers/generalFunctions";

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
    updateBalance: (item as any).updateBalance,
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
export async function getAllUsedCurrencies(
  transactionType?: number,
  category?: number,
) {
  const session = await auth();

  let transactionTypeToFindQuery: Prisma.TransactionWhereInput["transactionType"] =
    {};
  if (transactionType) transactionTypeToFindQuery = { equals: transactionType };
  if (!transactionType)
    transactionTypeToFindQuery = { not: { equals: undefined } };

  let uniqueCurrencies;

  if (category) {
    uniqueCurrencies = await db.transaction.findMany({
      where: {
        userId: session?.user.id,
        transactionType: transactionTypeToFindQuery,
        category: category,
      },
      distinct: ["currency"],
      select: {
        currency: true,
      },
    });
  } else {
    uniqueCurrencies = await db.transaction.findMany({
      where: {
        userId: session?.user.id,
        transactionType: transactionTypeToFindQuery,
      },
      distinct: ["currency"],
      select: {
        currency: true,
      },
    });
  }

  const currencies = uniqueCurrencies.map(
    (transaction) => transaction.currency,
  );

  return currencies;
}

export async function getDataByCategory(
  month?: string,
  category?: number,
  currency?: string,
  tableData?: boolean,
) {
  const session = await auth();
  const now = new Date();
  let startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  let endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  if (month === "previous") {
    // Získání začátku a konce předchozího měsíce
    startOfMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    endOfMonth = new Date(now.getFullYear(), now.getMonth(), 0);
  }

  const createdAtQuery: Prisma.TransactionWhereInput["date"] = {};
  createdAtQuery.gte = startOfMonth;
  createdAtQuery.lte = endOfMonth;

  let currencyQuery: Prisma.TransactionWhereInput["currency"] = "";
  if (currency) currencyQuery = currency;
  if (!currency) currencyQuery = session?.user?.mainCurrency;

  let categoryQuery: Prisma.TransactionWhereInput["category"];
  if (category) categoryQuery = category;
  if (!category) categoryQuery = { not: { equals: null } };

  const dataByCategory = await db.transaction.findMany({
    where: {
      userId: session?.user.id,
      date: createdAtQuery,
      currency: currencyQuery,
      category: categoryQuery,
      transactionType: 2,
    },
    select: {
      name: true,
      amount: true,
      accountFrom: {
        select: { name: true },
      },
      date: true,
      category: true,
      id: true,
      currency: true,
    },
  });

  type DataFromDb = {
    amount: number;
    date: Date;
    category: number | null;
  };

  function sumAmountsByCategory(transactions: DataFromDb[]) {
    // Objekt pro seskupení částek podle kategorií
    const amountByCategory: { [key: number]: number } = {};

    // Projdeme všechny transakce
    transactions.forEach((transaction) => {
      const { amount, category } = transaction;
      // Přeskočíme transakce s kategorií null
      if (category === null) {
        return;
      }
      // Pokud kategorie ještě není v objektu, inicializujeme ji na 0
      if (!amountByCategory[category]) {
        amountByCategory[category] = 0;
      }
      // Přičteme částku k existující hodnotě v kategorii
      amountByCategory[category] += amount;
    });

    // Výsledné pole objektů ve formátu [{ category: number, amount: number }, ...]
    return Object.keys(amountByCategory).map((key) => ({
      category: parseInt(key, 10), // Převod klíče na číslo, pokud je potřeba
      amount: amountByCategory[Number(key)],
    }));
  }

  function aggregateAmountsByDay(
    dayArray: Date[],
    data: { amount: number; date: Date; category: number | null }[],
  ) {
    return dayArray.map((day) => {
      const totalAmount = data
        .filter(
          (item) =>
            item.date.toISOString().slice(0, 10) ===
            day.toISOString().slice(0, 10),
        )
        .reduce((sum, item) => sum + item.amount, 0);
      return {
        date: day.toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        }),
        totalAmount,
      };
    });
  }

  const dayArray = eachDayOfInterval(interval(startOfMonth, endOfMonth));

  if (!category) {
    const summedCategories = sumAmountsByCategory(dataByCategory);
    return summedCategories;
  } else if (category && tableData) {
    return dataByCategory;
  } else {
    const arrayOfSelectedCategory = aggregateAmountsByDay(
      dayArray,
      dataByCategory,
    );
    return arrayOfSelectedCategory;
  }
}

export async function getGraphData(
  createdAfter: Date | null,
  createdBefore: Date | null,
  currency?: string,
) {
  const session = await auth();

  const createdAtQuery: Prisma.TransactionWhereInput["date"] = {};
  if (createdAfter) createdAtQuery.gte = createdAfter;
  if (createdBefore) createdAtQuery.lte = createdBefore;

  let currencyQuery: Prisma.TransactionWhereInput["currency"] = "";
  if (currency) currencyQuery = currency;
  if (!currency) currencyQuery = session?.user?.mainCurrency;

  const chartData = await db.transaction.findMany({
    where: {
      userId: session?.user.id,
      NOT: {
        transactionType: { in: [3, 4] }, // Use `in` operator for exclusion
      },
      date: createdAtQuery,
      currency: currencyQuery,
    },
    orderBy: {
      date: "asc",
    },
    select: {
      date: true,
      amount: true,
      transactionType: true,
    },
  });
  const dayArray = eachDayOfInterval(
    interval(
      createdAfter || startOfDay(chartData[0].date),
      createdBefore || new Date(),
    ),
  );

  type ChartData = {
    date: Date;
    amount: number;
    transactionType: number;
  };

  type IntervalData = {
    date: string;
    income: number;
    expense: number;
  };
  function assignAmountsToIntervals(
    chartData: ChartData[],
    intervalOfDays: Date[],
  ): IntervalData[] {
    // Aggregate chart data by date and transaction type
    const aggregatedData = chartData.reduce(
      (acc, { date, amount, transactionType }) => {
        const day = date.toISOString().slice(0, 10);
        if (!acc[day]) {
          acc[day] = { income: 0, expense: 0 };
        }
        if (transactionType === 1) {
          acc[day].income += amount;
        } else if (transactionType === 2) {
          acc[day].expense += amount;
        }
        return acc;
      },
      {} as Record<string, { income: number; expense: number }>,
    );

    // Assign aggregated amounts to intervalOfDays
    return intervalOfDays.map((date) => {
      const day = date.toISOString().slice(0, 10);
      const data = aggregatedData[day] || { income: 0, expense: 0 };
      const formattedDate = date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      });
      return {
        date: formattedDate,
        income: data.income,
        expense: data.expense,
      };
    });
  }

  const allChartData = assignAmountsToIntervals(chartData, dayArray);

  return allChartData;
}

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

  const limit = transactionType === undefined ? 2 : undefined;

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

// TODO: set cron
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
    // let date = new Date();
    // date.setUTCHours(0, 0, 0, 0);
    //
    // if (periodicPayment.frequency === 7 || periodicPayment.frequency === 14) {
    //   date.setDate(date.getDate() + periodicPayment.frequency); // Add days
    // } else if (periodicPayment.frequency === 30) {
    //   date.setMonth(date.getMonth() + 1); // Add 1 month
    // } else if (periodicPayment.frequency === 60) {
    //   date.setMonth(date.getMonth() + 2); // Add 2 months
    // }
    let date = convertFrequencyToDate(periodicPayment.frequency);

    await db.periodicPayment.updateMany({
      where: {
        id: periodicPayment.id,
      },
      data: { lastProcessed: todayDate, toProcess: date },
    });
  }

  // filtering only necessary info for creating transaction
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
