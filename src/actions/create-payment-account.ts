"use server";

import { currentUser } from "@/helpers/current-user";
import { db } from "@/lib/db";

export const createPaymentAccount = async (values: any) => {
  const session = await currentUser();

  if (!session?.id) return { error: "něco se nepovedlo" };

  const { number, name, balance, currency, type } = values;

  const existingAccount = await db.paymentAccount.findFirst({
    where: {
      userId: session.id,
      OR: [{ name }, { number }],
    },
  });

  if (existingAccount) {
    return { error: "název už je používán" };
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
