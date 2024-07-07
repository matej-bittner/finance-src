"use server";

import { currentUser } from "@/helpers/current-user";
import { db } from "@/lib/db";
import { number, util } from "zod";
import { getTranslations } from "next-intl/server";

export const createTransaction = async (values: any) => {
  const te = await getTranslations("action-errors");
  const ts = await getTranslations("action-success");
  const session = await currentUser();

  if (!session?.id) return { error: te("4") };

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
    return { error: te("7") };
  }

  if (transactionType === 3 && !accountFrom && !accountTo) {
    return { error: te("14") };
  }
  if (transactionType === 3 && accountFrom === accountTo) {
    return { error: te("15") };
  }
  if (transactionType === 4 && !frequency) {
    return { error: te("13") };
  }
  // if (transactionType === 4 || (transactionType === 5 && !accountFrom)) {
  //   return { error: "nebyl vybrán účet" };
  // }
  if ((transactionType === 4 || transactionType === 5) && !accountFrom) {
    return { error: te("7") };
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
      return { error: te("4") };
    }
    if (balanceTo.currency !== balanceFrom.currency) {
      return { error: te("16") };
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
    if (transactionType === 5) {
      return { success: ts("16") };
    }
    return { success: ts("17") };
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
  return { success: ts("5") };
};
