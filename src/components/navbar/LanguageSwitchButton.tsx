"use client";
import React, { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Image from "next/image";

const LanguageSwitchButton = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const localActive = useLocale();
  const t = useTranslations("language-switch");

  const onSelectChange = (e: any) => {
    const nextLocale = e.target.value;
    startTransition(() => {
      router.replace(`/${nextLocale}`);
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
        <option value="en">English</option>
        <option value="cs">Česky</option>
      </select>
    </label>
  );
};

export default LanguageSwitchButton;
