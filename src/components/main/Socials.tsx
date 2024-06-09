import React from "react";
import { socialsData } from "@/constants";
import Image from "next/image";
import { useTranslations } from "next-intl";

const Socials = () => {
  const t = useTranslations();
  return (
    <div className="w-full bg-main-blue py-3 sm:py-5 tb:py-6 2xl:py-8">
      <div className="mx-auto w-full max-w-[500px] space-y-5 text-white sm:space-y-4 xl:max-w-[600px]">
        <h2 className="text-center">{t(`socials-title`)}</h2>
        <div className="flex w-full items-center gap-1 font-medium max-sm:flex-col sm:gap-6 md:gap-8 lg:gap-10">
          <div
            className={`flex items-center gap-8 sm:w-full sm:justify-center`}
          >
            {socialsData.map((item, i) => {
              if (item.address) return;
              return (
                <a key={i} href={item.link}>
                  <Image
                    src={`/icons/${item.icon}.svg`}
                    width={28}
                    height={28}
                    alt={item.icon}
                    className="aspect-square md:w-[32px]"
                  />
                </a>
              );
            })}
          </div>
          <p className="">&</p>
          {socialsData.map((item, i) => {
            if (!item.address) return;
            return (
              <p key={i} className="sm:w-full sm:text-center">
                {item.address}
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Socials;
