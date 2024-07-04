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

export const deleteTransaction = async (
  id: string,
  transactionType: number,
) => {
  const session = await currentUser();

  if (!session?.id) return { error: "něco se nepovedlo" };

  if (transactionType === 4 || transactionType === 5) {
    await db.periodicPayment.delete({ where: { id, userId: session.id } });
    return { success: "ok1" };
  }

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

export const deleteInvestmentHistoryItem = async (
  id: string,
  linkedToAccountId: string,
) => {
  const session = await currentUser();

  if (!session?.id) return { error: "něco se nepovedlo" };

  await db.$transaction(async (db) => {
    await db.updateBalance.delete({
      where: {
        id,
        paymentAccount: {
          userId: session.id,
          id: linkedToAccountId,
        },
      },
    });

    const checkIfDeletedIsLast = await db.updateBalance.findFirst({
      where: {
        paymentAccount: {
          userId: session.id,
          id: linkedToAccountId,
        },
      },

      orderBy: {
        date: "desc",
      },
      select: {
        amount: true,
      },
    });

    if (!checkIfDeletedIsLast) {
      return { error: "Něco se nepovedlo" };
    }
    await db.paymentAccount.update({
      where: {
        userId: session.id,
        id: linkedToAccountId,
      },
      data: {
        balance: checkIfDeletedIsLast.amount,
      },
    });
  });

  return { success: "ok" };
};
export const deleteAccount = async (id: string, type: number) => {
  const session = await currentUser();

  if (!session?.id) return { error: "něco se nepovedlo" };

  await db.paymentAccount.delete({
    where: {
      id,
      userId: session.id,
    },
  });

  // await db.$transaction(async (db) => {
  //   const originalTransaction = await db.transaction.findUnique({
  //     where: { id, userId: session.id },
  //   });
  //   if (!originalTransaction) {
  //     return { error: "něco se nepovedlo" };
  //   }
  //
  //   if (originalTransaction.accountFromId) {
  //     await db.paymentAccount.update({
  //       where: {
  //         id: originalTransaction.accountFromId,
  //         userId: session.id,
  //       },
  //       data: {
  //         balance: {
  //           increment: originalTransaction.amount,
  //         },
  //       },
  //     });
  //   }
  //   if (originalTransaction.accountToId) {
  //     await db.paymentAccount.update({
  //       where: {
  //         id: originalTransaction.accountToId,
  //         userId: session.id,
  //       },
  //       data: {
  //         balance: {
  //           decrement: originalTransaction.amount,
  //         },
  //       },
  //     });
  //   }
  //   await db.transaction.delete({ where: { id, userId: session.id } });
  // });

  return { success: "ok" };
};
