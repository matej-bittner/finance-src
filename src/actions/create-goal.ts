"use server";

import { currentUser } from "@/helpers/current-user";
import { db } from "@/lib/db";

export const createGoal = async (values: any) => {
  const session = await currentUser();

  if (!session?.id) return { error: "něco se nepovedlo" };

  const { name, amount, date, color, icon, accounts } = values;

  if (accounts.length === 0) {
    return { error: "alespon jeden účet musí být vybrán" };
  }

  const existingGoal = await db.goal.findFirst({
    where: {
      userId: session.id,
      name,
    },
  });
  //
  if (existingGoal) {
    return { error: "název už je používán" };
  }

  for (const account of accounts) {
    const selectedAccount = await db.paymentAccount.findUnique({
      where: {
        id: account,
      },
    });

    if (!selectedAccount) {
      return { error: "účet nebyl nalezen" };
    }
    if (selectedAccount.blockedForGoal) {
      return { error: "celý účet je již přiřazený k jinému goalu" };
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

  return { success: "ok" };
};
