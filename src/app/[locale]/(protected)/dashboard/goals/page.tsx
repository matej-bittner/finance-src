import React from "react";
import GoalItem from "@/components/protected/GoalItem";
import { userAccounts, userGoals } from "@/helpers/current-user";
import { convertCurrency } from "@/app/api/convert-currency/route";
import { UserAccount } from "@/types";

const GoalsPage = async () => {
  const goalsData = await userGoals();
  const userCurrencyConvert = await convertCurrency(
    goalsData[0]?.user?.mainCurrency,
  );
  const allUserAccounts: UserAccount = await userAccounts();
  const userAccountsFormatted = allUserAccounts.map((item) => ({
    value: item.id,
    label: item.name,
    // Keep other properties if needed
    type: item.type,
    number: item.number,
    balance: item.balance,
    currency: item.currency,
    userId: item.userId,
    blockedForGoals: item.blockedForGoals,
    wantToBlock: 0,
  }));

  return (
    <div>
      {goalsData.length !== 0 && (
        <GoalItem
          userAccounts={userAccountsFormatted}
          goalData={goalsData}
          userCurrencyConvert={userCurrencyConvert}
        />
      )}
    </div>
  );
};

export default GoalsPage;
