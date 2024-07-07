"use server";

import { currentUser } from "@/helpers/current-user";
import { db } from "@/lib/db";
import { z } from "zod";
import { getTranslations } from "next-intl/server";

export const createPaymentAccount = async (values: any) => {
  const te = await getTranslations("action-errors");
  const ts = await getTranslations("action-success");
  const session = await currentUser();

  if (!session?.id) return { error: te("4") };

  const {
    number,
    name,
    balance,
    payment,
    currency,
    date,
    frequency,
    type,
    category,
  } = values;

  const existingAccount = await db.paymentAccount.findFirst({
    where: {
      userId: session.id,
      OR: [{ name }, { number }],
    },
  });

  if (existingAccount) {
    return { error: te("8") };
  }

  if (type === 2) {
    if (!payment) {
      return { error: te("11") };
    }
    if (!date) {
      return { error: te("12") };
    }
    if (!frequency) {
      return { error: te("13") };
    }
    const dateISO = new Date(date).toISOString();
    const frequencyNumber = Number(frequency);

    await db.$transaction(async (db) => {
      const paymentAccount = await db.paymentAccount.create({
        data: {
          name,
          number,
          balance,
          type,
          currency,
          user: {
            connect: {
              id: session.id,
            },
          },
        },
      });

      await db.periodicPayment.create({
        data: {
          transactionType: 4,
          firstPayment: dateISO,
          toProcess: dateISO,
          name,
          amount: payment,
          category,
          currency,
          frequency: frequencyNumber,
          user: {
            connect: {
              id: session.id,
            },
          },
          accountFrom: {
            connect: {
              id: paymentAccount.id,
            },
          },
        },
      });
    });
    return { success: ts("4") };
  }

  if (type === 4) {
    let todayDate = new Date();
    todayDate.setUTCHours(0, 0, 0, 0);
    await db.paymentAccount.create({
      data: {
        name,
        number,
        balance,
        type,
        currency,
        user: {
          connect: {
            id: session.id,
          },
        },
        updateBalance: {
          create: {
            date: todayDate,
            amount: balance,
            currency,
            firstBalance: true,
          },
        },
      },
    });
    return { success: ts("4") };
  }
  await db.paymentAccount.create({
    data: {
      name,
      number,
      balance,
      type,
      currency,
      user: {
        connect: {
          id: session.id,
        },
      },
    },
  });

  return { success: ts("4") };
};
