import React from "react";
import { socialsData } from "../../constants/index";
import Image from "next/image";
import { useTranslations } from "next-intl";

const Footer = () => {
  const t = useTranslations("footer");
  return (
    <footer className="h-fit bg-main-blue text-white flex flex-col items-center py-3 tb:pt-5 border-t-white border-t-2">
      <Image
        src="/images/logo.svg"
        alt="logo"
        width={114}
        height={38}
        className="w-[140px] sm:w-[160px] lg:w-[170px] xl:w-[190px] pb-2"
      />
      <p className="text-lg">2024</p>
      <div className="flex flex-col items-center gap-3 py-4">
        <p>{t("contactUs")}</p>
        <div className="flex gap-6">
          {socialsData.map((item, i) => {
            if (item.address) return;
            return (
              // <a key={i} href={item.link} target="_blank">
              <Image
                key={i}
                src={`/icons/${item.icon}.svg`}
                width="40"
                height="40"
                alt={item.icon}
                className="aspect-square "
              />
              // </a>
            );
          })}
        </div>
        <p>info@walletrecap.com</p>
      </div>
    </footer>
  );
};

export default Footer;
