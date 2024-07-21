"use client";
import React from "react";

import { ClipLoader } from "react-spinners";

const DashboardPageLoading = () => {
  return (
    <div className="flex items-center justify-center w-full h-full">
      {/*main content*/}
      <ClipLoader />
    </div>
  );
};

export default DashboardPageLoading;
