"use client";
import React, { useState } from "react";

import { useTranslations } from "next-intl";
import { Combobox } from "@/components/ui/combox";

const DashboardPage = () => {
  const t = useTranslations("dashboard-navigation");

  const yourOptions: { value: string; label: string }[] = [
    {
      value: "next.js",
      label: "Next.js",
    },
    {
      value: "sveltekit",
      label: "SvelteKit",
    },
    {
      value: "nuxt.js",
      label: "Nuxt.js",
    },
    {
      value: "remix",
      label: "Remix",
    },
    {
      value: "astro",
      label: "Astro",
    },
  ];
  const [myValue, setMyValue] = useState<string | string[]>("");
  const handleCreateOptions = (x: any) => {
    console.log("ok");
  };

  return (
    <div className="h-[1000px] bg-violet-800 max-sm:px-4">
      <Combobox
        mode="single" //single or multiple
        options={yourOptions}
        placeholder="Vyberte účet"
        selected={myValue} // string or array
        onChange={(value) => setMyValue(value)}
        onCreate={(value) => {
          handleCreateOptions(value);
        }}
      />
    </div>
  );
};

export default DashboardPage;
