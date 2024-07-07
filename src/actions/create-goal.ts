"use server";

import { currentUser } from "@/helpers/current-user";
import { db } from "@/lib/db";
import { getTranslations } from "next-intl/server";

export const createGoal = async (values: any) => {
  const te = await getTranslations("action-errors");
  const ts = await getTranslations("action-success");
  const session = await currentUser();

  if (!session?.id) return { error: te("4") };

  const { name, amount, date, color, icon, accounts } = values;

  if (accounts.length === 0) {
    return { error: te("7") };
  }

  const existingGoal = await db.goal.findFirst({
    where: {
      userId: session.id,
      name,
    },
  });
  //
  if (existingGoal) {
    return { error: te("8") };
  }

  for (const account of accounts) {
    const selectedAccount = await db.paymentAccount.findUnique({
      where: {
        id: account,
      },
    });

    if (!selectedAccount) {
      return { error: te("9") };
    }
    if (selectedAccount.blockedForGoal) {
      return { error: te("10") };
    }
  }

  const dateISO = new Date(date).toISOString();

  await db.$transaction(async (db) => {
    // Aktualizace všech účtů na "blocked: true"
    await db.paymentAccount.updateMany({
      where: {
        id: {
          in: accounts,
        },
      },
      data: {
        blockedForGoal: true,
      },
    });

    // Vytvoření nového cíle
    await db.goal.create({
      data: {
        name,
        color,
        icon,
        amount,
        user: {
          connect: {
            id: session.id,
          },
        },
        finishDate: dateISO,
        paymentAccount: {
          connect: accounts.map((c: string) => ({ id: c })) || [],
        },
      },
    });
  });

  return { success: ts("3") };
};
