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

  for (const account of accounts.accountData) {
    if (account.wantToBlock + account.blockedForGoals > account.balance) {
      return { error: "zadaná částka přesahuje zůstatek účtu " };
    }
    if (account.wantToBlock === -1 && account.blockedForGoals === -1) {
      return { error: "celý účet je již přiřazený k jinému goalu " };
    }
    if (account.wantToBlock === -1 && account.blockedForGoals > 0) {
      return {
        error: `${account.label} má část prostředků přiřazenou k jinému goalu, nelze nastavit Max`,
      };
    }
  }

  const dateISO = new Date(date).toISOString();

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
        connect: accounts.ids.map((c: string) => ({ id: c })) || [],
      },
    },
  });

  for (const account of accounts.accountData) {
    //if there is not set maximum balance for account and i dont want to create goal that limit all balance
    if (account.blockedForGoals !== -1 && account.wantToBlock !== -1) {
      await db.paymentAccount.update({
        where: {
          id: account.value, // Match by paymentAccount.value
        },
        data: {
          blockedForGoals: {
            increment: account.wantToBlock, // Increment blockedForGoals by wantToBlock
          },
        },
      });
    }
    // if account do not have any account linked and i want to limit whole account for current goal
    if (account.blockedForGoals === 0 && account.wantToBlock === -1) {
      await db.paymentAccount.update({
        where: {
          id: account.value, // Match by paymentAccount.value
        },
        data: {
          blockedForGoals: account.wantToBlock,
        },
      });
    }
  }

  return { success: "ok" };
};
