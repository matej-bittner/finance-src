import React from "react";

import { currentUser } from "@/helpers/current-user";
import WholePage from "@/components/subscription/WholePage";

const Page = async () => {
  const user = await currentUser();
  if (!user?.email) return null;

  return <WholePage userEmail={user.email} />;
};

export default Page;
