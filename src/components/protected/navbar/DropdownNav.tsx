"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface DropdownNavProps {
  dropdownNavData: {
    title: string;
    icon: string;
    link: string;
  }[];
}
const DropdownNav = ({ dropdownNavData }: DropdownNavProps) => {
  const pathname = usePathname();
  const paths = pathname
    .split("/")
    .filter((path) => path !== "")
    .map((item) => `/${item}`);

  const [openDropdownNav, setOpenDropdownNav] = useState(false);
  return (
    <div className=" z-20 sm:hidden">
      <Image
        src={`/icons/${openDropdownNav ? "close" : "hamburger"}.svg`}
        className="sm:invert"
        alt="menu"
        width={24}
        height={24}
        onClick={() => setOpenDropdownNav(!openDropdownNav)}
      />
      {openDropdownNav && (
        <div className="absolute left-0 top-[50px] h-fit grid grid-cols-3 min-[420px]:grid-cols-4 md:grid-cols-5 place-items-center w-full  items-center justify-center bg-main-blue py-3 text-white border-white border-b-2 limited-width gap-y-2 gap-x-1">
          {dropdownNavData.map((item, i) => {
            return (
              <div
                key={i}
                className={`w-full h-[65px] max-w-[125px] rounded-xl border-2 border-white flex flex-col items-center bg-main-bg/25 whitespace-break-spaces text-xs text-center p-[2px] ${paths[paths.length - 1] === item.link ? "bg-black/20 text-white font-medium" : "bg-main-bg/20"}`}
              >
                <Image
                  src={`/icons/${item.icon}.svg`}
                  alt={item.icon}
                  width={24}
                  height={24}
                  className="invert "
                />
                <Link href={item.link} className="flex-1 flex items-center">
                  {item.title}
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DropdownNav;
