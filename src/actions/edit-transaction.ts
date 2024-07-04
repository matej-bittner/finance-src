"use server";

import { currentUser } from "@/helpers/current-user";
import { db } from "@/lib/db";

export const editTransaction = async (values: any) => {
  const session = await currentUser();

  if (!session?.id) return { error: "něco se nepovedlo" };

  const {
    name,
    amount,
    date,
    description,
    id,
    frequency,
    category,
    transactionType,
    endOfPayment,
  } = values;

  const dateISO = new Date(date).toISOString();
  // let frequencyNumber = null;
  // if (frequency) {
  //   frequencyNumber = Number(frequency);
  // }

  if (transactionType === 4 || transactionType === 5) {
    const frequencyNumber = Number(frequency);
    let endOfPaymentISO = null;

    if (endOfPayment) {
      endOfPaymentISO = new Date(endOfPayment).toISOString();
    }
    await db.periodicPayment.update({
      where: { id, userId: session.id },
      data: {
        amount,
        frequency: frequencyNumber,
        endOfPayment: endOfPaymentISO,

        name,
        description,
        category,
      },
    });
  }

  await db.$transaction(async (db) => {
    const originalTransaction = await db.transaction.findUnique({
      where: { id, userId: session.id },
    });
    if (!originalTransaction) {
      return { error: "něco se nepovedlo" };
    }

    if (amount === originalTransaction.amount) {
      await db.transaction.update({
        where: {
          id,
          userId: session.id,
        },
        data: {
          name,
          amount,
          date: dateISO,
          description,
          category,
        },
      });
      return { success: "ok" };
    }
    const netChangeFrom = originalTransaction.amount - amount;
    const netChangeTo = amount - originalTransaction.amount;

    await db.transaction.update({
      where: {
        id,
        userId: session.id,
      },
      data: {
        name,
        amount,
        date: dateISO,
        description,
      },
    });

    if (originalTransaction.accountFromId) {
      await db.paymentAccount.update({
        where: {
          id: originalTransaction.accountFromId,
        },
        data: {
          balance: {
            increment: netChangeFrom,
          },
        },
      });
    }
    if (originalTransaction.accountToId) {
      await db.paymentAccount.update({
        where: {
          id: originalTransaction.accountToId,
        },
        data: {
          balance: {
            increment: netChangeTo,
          },
        },
      });
    }
  });

  return { success: "ok" };
};
