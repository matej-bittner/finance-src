"use client";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { navLinks } from "@/constants";
const Sidebar = () => {
  const t = useTranslations("dashboard-navigation.nav-links");

  const [openSidebar, setOpenSidebar] = useState(false);

  const pathname = usePathname();

  const x = pathname.split("/").pop();

  return (
    <div className="hidden sm:flex flex-col w-[75px] h-screen sticky bg-main-blue top-0  z-10">
      <div
        className={`bg-main-blue h-full py-7 absolute top-0 flex flex-col ${openSidebar ? "w-fit  items-start px-[calc((75px-45px)/2)]" : "w-full"}`}
      >
        {/*icons*/}
        <div className="flex  flex-col gap-4 items-center">
          <button
            onClick={() => setOpenSidebar(!openSidebar)}
            className={`p-2 rounded-xl border-2 border-white flex justify-center items-center bg-main-bg mb-4`}
          >
            <Image
              src="/icons/expand-right.svg"
              alt="open menu"
              className={`${openSidebar && "rotate-180"}`}
              width={30}
              height={30}
            />
          </button>

          {navLinks.map((item, i) => {
            // {dropdownNavData.map((item, i) => {
            const y = item.link.split("/").pop();

            return (
              <Link
                href={item.link}
                onClick={() => setOpenSidebar(false)}
                key={i}
                className={`p-2 rounded-xl border-2 border-white flex items-center ${!openSidebar ? " justify-center" : "w-[200px]"} ${x === y ? "bg-black/60 text-white" : "bg-main-bg"}`}
              >
                <Image
                  src={`/icons/${item.icon}.svg`}
                  alt={item.icon}
                  width={24}
                  height={24}
                  className={`${x === y && "invert"}`}
                />
                {openSidebar && <p className="pl-2">{t(item.title)}</p>}
              </Link>
            );
          })}
        </div>
        {/*premium or starter*/}
        <div className="flex mt-auto flex-col gap-1 w-full items-center justify-center">
          <p className="text-main-yellow text-sm">STARTER</p>
          <Image
            src="/icons/diamond.svg"
            alt="diamond"
            width={30}
            height={30}
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
