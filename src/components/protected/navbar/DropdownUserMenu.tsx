"use client";
import {
  Cloud,
  CreditCard,
  LifeBuoy,
  LogOut,
  Plus,
  Settings,
  Users,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import React from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { signOut } from "next-auth/react";

const DropdownUserMenu = () => {
  const t = useTranslations("dashboard-navigation");
  const logOut = () => {
    signOut();
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Image
          src="/icons/settings.svg"
          alt="settings"
          width={24}
          height={24}
          className="nav-image sm:hidden"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-main-gray border-main-gray sm:hidden">
        <DropdownMenuItem className="settings-select-link ">
          <Settings className="mr-2 h-4 w-4" />
          <Link href="/settings">{t("settings")}</Link>
        </DropdownMenuItem>

        <DropdownMenuItem className="settings-select-link">
          <LogOut className="mr-2 h-4 w-4" />
          <button onClick={logOut} className="cursor-pointer">
            {t("logOut")}
          </button>{" "}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropdownUserMenu;
