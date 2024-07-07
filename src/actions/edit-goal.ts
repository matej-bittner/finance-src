"use server";

import { currentUser } from "@/helpers/current-user";
import { db } from "@/lib/db";
import { getTranslations } from "next-intl/server";

export const editGoal = async (values: any) => {
  const te = await getTranslations("action-errors");
  const ts = await getTranslations("action-success");
  const session = await currentUser();

  if (!session?.id) return { error: te("4") };

  const { name, amount, date, color, icon, accounts, id } = values;

  if (accounts.length === 0) {
    return { error: te("7") };
  }

  const dateISO = new Date(date).toISOString();

  await db.$transaction(async (db) => {
    await db.paymentAccount.updateMany({
      where: {
        goalId: id,
        userId: session.id,
      },
      data: {
        goalId: null,
        blockedForGoal: false,
      },
    });
    // Aktualizace všech účtů na "blocked: true"
    await db.paymentAccount.updateMany({
      where: {
        id: {
          in: accounts,
        },
        userId: session.id,
      },
      data: {
        blockedForGoal: true,
      },
    });

    // Vytvoření nového cíle
    await db.goal.update({
      where: { id, userId: session.id },
      data: {
        name,
        color,
        icon,
        amount,

        finishDate: dateISO,
        paymentAccount: {
          connect: accounts.map((c: string) => ({ id: c })) || [],
        },
      },
    });
  });

  return { success: ts("10") };
};
