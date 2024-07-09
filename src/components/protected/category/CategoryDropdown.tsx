"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { categories } from "@/constants";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

const CategoryDropdown = ({ label }: { label: string }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("category");
  function setCategory(categoryValue: number) {
    const params = new URLSearchParams(searchParams);
    params.set("category", categoryValue.toString());
    params.delete("currency");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="w-full flex flex-col items-center">
      <DropdownMenu>
        <DropdownMenuTrigger className="flex gap-1">
          <h2>{t(label)}</h2>
          <Image
            src="/icons/expand-right.svg"
            alt="show catgories"
            width={25}
            height={25}
            className="rotate-90"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="grid grid-cols-2 w-fit gap-x-2 gap-y-1">
          {categories.map((cat) => (
            <DropdownMenuItem onClick={() => setCategory(cat.id)} key={cat.id}>
              {t(cat.value)}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default CategoryDropdown;
