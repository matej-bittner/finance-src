"use server";

import { currentUser } from "@/helpers/current-user";
import { db } from "@/lib/db";
import { z } from "zod";

export const createPaymentAccount = async (values: any) => {
  const session = await currentUser();

  if (!session?.id) return { error: "něco se nepovedlo" };

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
    return { error: "název už je používán" };
  }

  if (type === 2) {
    if (!payment) {
      return { error: "Nebyla vyplněna výše splátky" };
    }
    if (!date) {
      return { error: "Není vyplněno datum splátky" };
    }
    if (!frequency) {
      return { error: "Není vyplněna frekvence" };
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
    return { success: "ok" };
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
    return { success: "ok" };
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

  return { success: "ok" };
};

// export const createPaymentAccount = async (values: any) => {
//   const session = await currentUser();
//
//   if (!session?.id) return { error: "něco se nepovedlo" };
//
//   const { number, name, balance, currency, type } = values;
//
//   const existingAccount = await db.paymentAccount.findFirst({
//     where: {
//       userId: session.id,
//       OR: [{ name }, { number }],
//     },
//   });
//
//   if (existingAccount) {
//     return { error: "název už je používán" };
//   }
//
//   await db.paymentAccount.create({
//     data: {
//       name,
//       number,
//       balance,
//       type,
//       currency,
//       user: {
//         connect: {
//           id: session.id,
//         },
//       },
//     },
//   });
//
//   return { success: "ok" };
// };
