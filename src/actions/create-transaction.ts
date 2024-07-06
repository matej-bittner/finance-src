"use server";

import { currentUser } from "@/helpers/current-user";
import { db } from "@/lib/db";
import { number, util } from "zod";

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
    category,

    endOfPayment,
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
  // if (transactionType === 4 || (transactionType === 5 && !accountFrom)) {
  //   return { error: "nebyl vybrán účet" };
  // }
  if ((transactionType === 4 || transactionType === 5) && !accountFrom) {
    return { error: "nebyl vybrán účet" };
  }

  if (transactionType === 3) {
    const balanceTo = await db.paymentAccount.findUnique({
      where: {
        id: accountTo,
      },
      select: {
        currency: true,
      },
    });
    const balanceFrom = await db.paymentAccount.findUnique({
      where: {
        id: accountFrom,
      },
      select: {
        currency: true,
      },
    });
    if (!balanceFrom?.currency || !balanceTo?.currency) {
      return { error: "Něco se nepovedlo" };
    }
    if (balanceTo.currency !== balanceFrom.currency) {
      return { error: "Momentálně nelze zadat platbu mezi účty v jiné měně" };
    }
  }

  const dateISO = new Date(date).toISOString();

  // let frequencyNumber = null;
  // if (frequency) {
  //   const frequencyNumber = Number(frequency);
  // }

  if (transactionType === 4 || transactionType === 5) {
    const frequencyNumber = Number(frequency);
    let endOfPaymentISO = null;

    if (endOfPayment) {
      endOfPaymentISO = new Date(endOfPayment).toISOString();
    }

    await db.periodicPayment.create({
      data: {
        transactionType,
        name,
        description,
        amount,
        currency,
        category,
        firstPayment: dateISO,
        endOfPayment: endOfPaymentISO,
        toProcess: dateISO,
        frequency: frequencyNumber,
        user: {
          connect: {
            id: session.id,
          },
        },
        accountFrom: {
          connect: {
            id: accountFrom,
          },
        },
      },
    });
    return { success: "Příkaz OK" };
  }

  await db.$transaction(async (db) => {
    await db.transaction.create({
      data: {
        transactionType,
        name,
        description,
        amount,
        currency,
        date: dateISO,

        category,
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
    if (accountFrom) {
      await db.paymentAccount.update({
        where: {
          id: accountFrom,
        },
        data: {
          balance: {
            decrement: amount,
          },
        },
      });
    }
    if (accountTo) {
      await db.paymentAccount.update({
        where: {
          id: accountTo,
        },
        data: {
          balance: {
            increment: amount,
          },
        },
      });
    }
  });
  return { success: "ok" };
};
