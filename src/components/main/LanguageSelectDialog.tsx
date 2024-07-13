"use client";
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

import { languages } from "@/constants";
import { usePathname, useRouter } from "next/navigation";

import Cookies from "js-cookie";
const LanguageSelectDialog = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!Cookies.get("preferredLanguage")) {
      setOpen(true);
    }
  }, []);

  const handleLanguageChange = (language: string) => {
    Cookies.set("preferredLanguage", language);
    const newPathname = pathname.replace(/^\/[^/]+/, `/${language}`);
    router.push(newPathname);
    setOpen(false);
  };

  return (
    <div className="">
      <Dialog open={open}>
        <DialogContent
          className="sm:max-w-[425px]"
          // @ts-ignore
          disableClose={true}
        >
          <div className="grid grid-cols-2 gap-x-5">
            {languages.map((lang, i) => (
              <button
                className="bg-main-blue py-6 rounded-lg font-medium text-white  hover:scale-[1.03] transition-all duration-300 ease-in-out"
                onClick={() => handleLanguageChange(lang.value)}
                key={i}
              >
                {lang.title}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LanguageSelectDialog;
