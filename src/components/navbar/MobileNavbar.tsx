"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import LanguageSwitchButton from "@/components/navbar/LanguageSwitchButton";
import { usePathname } from "next/navigation";

interface MobileNavbarProps {
  navLinksData: {
    title: string;
    link: string;
  }[];
}
const MobileNavbar = ({ navLinksData }: MobileNavbarProps) => {
  const [openMobileNav, setOpenMobileNav] = useState(false);

  return (
    <div className="min-[450px]:min-w-[125px] sm:hidden z-20 ">
      <Image
        src={`/icons/${openMobileNav ? "close" : "hamburger"}.svg`}
        alt="menu"
        width={28}
        height={28}
        onClick={() => setOpenMobileNav(!openMobileNav)}
      />
      {openMobileNav && (
        <div className="absolute left-0 top-[65px] flex h-fit w-full items-center justify-center gap-2 bg-main-yellow py-3 text-black border-white border-b-2 flex-col bg ">
          <div className="flex gap-4 ">
            {navLinksData.map((item, i) => {
              return (
                <a
                  key={i}
                  href={item.link}
                  className="border-2 border-transparent px-2 font-medium capitalize hover:border-b-white"
                >
                  {item.title}
                </a>
              );
            })}
          </div>
          <div>
            <LanguageSwitchButton />
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileNavbar;
