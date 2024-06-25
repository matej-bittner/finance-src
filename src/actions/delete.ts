"use server";

import { currentUser } from "@/helpers/current-user";
import { db } from "@/lib/db";

export const deleteGoal = async (id: string) => {
  const session = await currentUser();

  if (!session?.id) return { error: "něco se nepovedlo" };

  await db.$transaction(async (db) => {
    const goal = await db.goal.findUnique({
      where: { id, userId: session.id },
    });
    if (!goal) {
      return { error: "něco se nepovedlo" };
    }
    await db.paymentAccount.updateMany({
      where: {
        goalId: id,
      },
      data: {
        blockedForGoal: false,
      },
    });
    await db.goal.delete({
      where: { id },
    });
  });

  return { success: "ok" };
};

export const deleteTransaction = async (id: string) => {
  const session = await currentUser();

  if (!session?.id) return { error: "něco se nepovedlo" };

  await db.$transaction(async (db) => {
    const originalTransaction = await db.transaction.findUnique({
      where: { id, userId: session.id },
    });
    if (!originalTransaction) {
      return { error: "něco se nepovedlo" };
    }

    if (originalTransaction.accountFromId) {
      await db.paymentAccount.update({
        where: {
          id: originalTransaction.accountFromId,
          userId: session.id,
        },
        data: {
          balance: {
            increment: originalTransaction.amount,
          },
        },
      });
    }
    if (originalTransaction.accountToId) {
      await db.paymentAccount.update({
        where: {
          id: originalTransaction.accountToId,
          userId: session.id,
        },
        data: {
          balance: {
            decrement: originalTransaction.amount,
          },
        },
      });
    }
    await db.transaction.delete({ where: { id, userId: session.id } });
  });

  return { success: "ok" };
};
