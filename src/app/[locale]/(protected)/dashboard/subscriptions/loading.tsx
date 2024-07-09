import React from "react";
import GoalItemSkeleton from "@/components/protected/skeletons/GoalItemSkeleton";
import SubscriptionItemSkeleton from "@/components/protected/skeletons/SubscriptionitemSkeleton";

const SubscriptionPageLoading = () => {
  return (
    <div className="grid grid-cols-1 place-items-center 2xl:grid-cols-2  gap-2 lg:gap-4 max-w-[1550px] mx-auto  justify-center items-start h-fit pt-2 2xl:pt-8">
      {"abcd".split("").map((_, i) => (
        <SubscriptionItemSkeleton key={i} />
      ))}
    </div>
  );
};

export default SubscriptionPageLoading;
