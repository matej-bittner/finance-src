import React from "react";
import GoalItemSkeleton from "@/components/protected/skeletons/GoalItemSkeleton";

const GoalPageLoading = () => {
  return (
    <div className="grid grid-cols-1 min-[420px]:grid-cols-2 min-[920px]:grid-cols-3 min-[1350px]:grid-cols-4 2xl:grid-cols-5 min-[1900px]:grid-cols-6 place-items-center items-center">
      {"abcd".split("").map((_, i) => (
        <GoalItemSkeleton key={i} />
      ))}
    </div>
  );
};

export default GoalPageLoading;
