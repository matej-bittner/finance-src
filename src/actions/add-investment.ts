"use server";
import { currentUser } from "@/helpers/current-user";
import { db } from "@/lib/db";

export const addInvestment = async (values: any) => {
  const session = await currentUser();

  if (!session?.id) return { error: "něco se nepovedlo" };

  const { amount, id, type } = values;
  if (!amount || !id || !type) {
    return { error: "Něco se nepovedlo" };
  }

  if (type !== 4) {
    return { error: "U Tohoto účtu nelze částku zadat" };
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

  return { success: "Ok" };
};
