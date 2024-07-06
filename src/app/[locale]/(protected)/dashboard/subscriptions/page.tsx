import React from "react";
import { userPeriodicPayments } from "@/helpers/current-user";
import SubscriptionItem from "@/components/protected/SubscriptionItem";

const SubscriptionsPage = async () => {
  const allSubscriptions = await userPeriodicPayments(5);

  if (allSubscriptions.length === 0) return null;

  return (
    <div className="grid grid-cols-1 place-items-center 2xl:grid-cols-2  gap-2 lg:gap-4 max-w-[1550px] mx-auto  justify-center items-start h-fit pt-2 2xl:pt-8">
      {allSubscriptions.map((sub, i) => {
        return <SubscriptionItem key={i} sub={sub} />;
      })}
    </div>
  );
};

export default SubscriptionsPage;
