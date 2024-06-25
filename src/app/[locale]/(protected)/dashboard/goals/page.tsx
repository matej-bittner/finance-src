import React from "react";
import GoalItem from "@/components/protected/GoalItem";
import { userAccounts, userGoals } from "@/helpers/current-user";
import { convertCurrency } from "@/app/api/convert-currency/route";

const GoalsPage = async () => {
  const goalsData = await userGoals();
  const userCurrencyConvert = await convertCurrency(
    goalsData[0]?.user?.mainCurrency,
  );

  const allUserAccounts = await userAccounts();

  return (
    <div>
      {goalsData.length !== 0 && (
        <GoalItem
          userAccounts={allUserAccounts}
          goalData={goalsData}
          userCurrencyConvert={userCurrencyConvert}
        />
      )}
    </div>
  );
};

export default GoalsPage;
