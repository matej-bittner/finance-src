"use server";

import { currentUser } from "@/helpers/current-user";
import { db } from "@/lib/db";

export const createTransaction = async (values: any) => {
  const session = await currentUser();

  if (!session?.id) return { error: "něco se nepovedlo" };

  const {
    accountFrom,
    accountTo,
    name,
    amount,
    currency,
    description,
    date,
    frequency,
    transactionType,
  } = values;

  if (accountFrom === "" && accountTo === "") {
    return { error: "alespon jeden účet musí být vybrán" };
  }

  if (transactionType === 3 && !accountFrom && !accountTo) {
    return { error: "musí být vybrané dva účty" };
  }
  if (transactionType === 3 && accountFrom === accountTo) {
    return { error: "musí být vybrané odlišné účty" };
  }
  if (transactionType === 4 && !frequency) {
    return { error: "nebyla vabrána frequence" };
  }

  const dateISO = new Date(date).toISOString();

  let frequencyNumber = null;
  if (frequency) {
    frequencyNumber = Number(frequency);
  }

  await db.transaction.create({
    data: {
      transactionType,
      name,
      description,
      amount,
      currency,
      date: dateISO,
      frequency: frequencyNumber,
      user: {
        connect: {
          id: session.id,
        },
      },
      accountFrom: accountFrom && {
        connect: {
          id: accountFrom,
        },
      },
      accountTo: accountTo && {
        connect: {
          id: accountTo,
        },
      },
    },
  });

  return { success: "ok" };
};
