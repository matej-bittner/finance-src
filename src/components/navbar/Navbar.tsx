import React from "react";
import Link from "next/link";
import Image from "next/image";
import MobileNavbar from "@/components/navbar/MobileNavbar";
import LanguageSwitchButton from "@/components/navbar/LanguageSwitchButton";
import { getTranslations } from "next-intl/server";
import { currentUser } from "@/helpers/current-user";

import LogoutSelect from "@/components/navbar/LogoutSelect";

const Navbar = async () => {
  const t = await getTranslations("Navigation");
  const navLinksData = [
    {
      title: t("nav-links.about.title"),
      link: t("nav-links.about.link"),
    },
    {
      title: t("nav-links.demo.title"),
      link: t("nav-links.demo.link"),
    },
    {
      title: t("nav-links.pricing.title"),
      link: t("nav-links.pricing.link"),
    },
  ];

  const user = await currentUser();

  return (
    <nav className="relative mx-auto flex size-full max-w-[1440px] items-center px-4 text-white md:px-6 lg:px-8">
      {/*mobile navigation*/}
      <MobileNavbar navLinksData={navLinksData} />
      {/*logo+name*/}
      <div className="flex text-center max-lg:justify-center max-sm:flex-1 sm:min-w-[140px] lg:min-w-[220px]">
        <Link href="/">
          <Image
            src="/images/logo.svg"
            alt="logo"
            width={114}
            height={38}
            className="w-[130px] sm:w-[140px] lg:w-[150px] xl:w-[170px]"
          />
        </Link>
      </div>
      {/*navigation*/}
      <div className="hidden flex-1 justify-center gap-6 sm:flex md:gap-8 lg:gap-14">
        {navLinksData.map((item, i) => {
          return (
            <a
              key={i}
              href={item.link}
              className="border-2 border-transparent px-2 font-medium capitalize hover:border-b-white max-md:text-sm lg:text-lg drop-shadow-md"
            >
              {item.title}
            </a>
          );
        })}
      </div>
      <div className="flex justify-end min-[450px]:min-w-[125px] sm:min-w-[140px] lg:min-w-[220px] drop-shadow-md sm:items-center sm:gap-2 min-[820px]:gap-3 ">
        <LogoutSelect
          text={t("select")}
          accountButton={t(`accountButton`)}
          user={user}
        />

        {/*{user?.hasAccess === false ? (*/}
        {/*  <LogoutSelect text={t("select")} accountButton={t(`accountButton`)} />*/}
        {/*) : (*/}
        {/*  <Link*/}
        {/*    href="/login"*/}
        {/*    className="flex w-fit items-center gap-2 rounded-lg border-2 border-black bg-main-yellow p-1 text-black max-lg:text-sm max-[450px]:aspect-square sm:max-[820px]:aspect-square min-[450px]:px-2 min-[450px]:py-[2px] sm:p-1"*/}
        {/*  >*/}
        {/*    <Image*/}
        {/*      src="/icons/user.svg"*/}
        {/*      alt="user"*/}
        {/*      width={18}*/}
        {/*      height={18}*/}
        {/*      className="aspect-square min-[450px]:w-[20px] lg:w-[22px]"*/}
        {/*    />*/}
        {/*    <p className="max-[450px]:hidden sm:max-[820px]:hidden">*/}
        {/*      {t(`accountButton`)}*/}
        {/*    </p>*/}
        {/*  </Link>*/}
        {/*)}*/}
        <div className="max-sm:hidden ">
          <LanguageSwitchButton />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
