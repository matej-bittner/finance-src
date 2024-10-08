"use client";
import React, { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { languages } from "@/constants";
import Cookies from "js-cookie";

const LanguageSwitchButton = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const localActive = useLocale();
  const pathname = usePathname();

  const t = useTranslations("language-switch");

  const onSelectChange = (e: any) => {
    const nextLocale = e.target.value;
    const newPathname = pathname.replace(/^\/[^/]+/, `/${nextLocale}`);
    startTransition(() => {
      if (
        !Cookies.get("preferredLanguage") ||
        Cookies.get("preferredLanguage") !== nextLocale
      ) {
        Cookies.set("preferredLanguage", nextLocale);
      }
      router.push(newPathname);
      router.refresh();
    });
  };
  return (
    <label className="flex px-2 py-[1px] rounded-xl sm:rounded-lg border-black border-[2px] bg-main-yellow sm:text-black sm:max-lg:text-sm sm:p-1 gap-2 items-center">
      <p className="sr-only">{t("change-language")}</p>
      <Image
        src="/icons/translate.svg"
        alt="translate"
        width={18}
        height={18}
        className="aspect-square min-[450px]:w-[20px] lg:w-[22px]"
      />
      <select
        defaultValue={localActive}
        disabled={isPending}
        onChange={onSelectChange}
        className="outline-none focus:outline-none bg-main-yellow"
      >
        {languages.map((lang, i) => (
          <option key={i} value={lang.value}>
            {lang.title}
          </option>
        ))}
      </select>
    </label>
  );
};

export default LanguageSwitchButton;
