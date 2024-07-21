"use client";
import React from "react";

import { ClipLoader } from "react-spinners";

const DashboardPageLoading = () => {
  return (
    <div className=" flex min-h-[calc(100vh-65px)] sm:min-h-[calc(100vh-75px)] md:min-h-[calc(100vh-85px)] items-center justify-center">
      {/*<div className="flex items-center justify-center w-full h-full ">*/}
      {/*main content*/}
      <ClipLoader />
    </div>
  );
};

export default DashboardPageLoading;
