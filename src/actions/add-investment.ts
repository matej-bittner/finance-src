"use server";
import { currentUser } from "@/helpers/current-user";
import { db } from "@/lib/db";
import { getTranslations } from "next-intl/server";

export const addInvestment = async (values: any) => {
  const te = await getTranslations("action-errors");
  const ts = await getTranslations("action-success");
  const session = await currentUser();

  if (!session?.id) return { error: te("4") };

  const { amount, id, type } = values;
  if (!amount || !id || !type) {
    return { error: te("4") };
  }

  if (type !== 4) {
    return { error: te("6") };
  }

  let date = new Date();
  date.setUTCHours(0, 0, 0, 0);

  await db.$transaction(async (db) => {
    const account = await db.paymentAccount.update({
      where: {
        id,
        userId: session.id,
      },
      data: {
        balance: amount,
      },
    });

    await db.updateBalance.create({
      data: {
        date,
        amount,
        paymentAccount: {
          connect: {
            id,
          },
        },
        currency: account.currency,
      },
    });
  });

  return { success: ts("2") };
};
