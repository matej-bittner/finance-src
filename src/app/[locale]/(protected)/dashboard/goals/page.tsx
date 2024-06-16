import React from "react";
import GoalItem from "@/components/protected/GoalItem";

const goalData = [
  {
    finalDate: "1.1.2029",
    name: "Nová chata",
    id: 1,
    currentBalance: 250000,
    finalBalance: 400000,
    color: "purple",
  },
  {
    finalDate: "1.1.2029",
    name: "Nová chata",
    id: 2,
    currentBalance: 40000,
    finalBalance: 400000,
    color: "red",
  },
];

const GoalsPage = () => {
  return (
    <div>
      <GoalItem goalData={goalData} />
    </div>
  );
};

export default GoalsPage;
