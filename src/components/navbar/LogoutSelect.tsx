"use client";
import React from "react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { usePathname } from "next/navigation";
import Link from "next/link";

const LogoutSelect = ({
  text,
  accountButton,
}: {
  text: string;
  accountButton: string;
}) => {
  const user = useCurrentUser();
  const onClick = () => {
    signOut();
  };
  const pathname = usePathname();
  let displaySelectPLan;
  if (!user?.hasAccess) {
    displaySelectPLan = !pathname.includes("subscription-select");
  }
  return (
    <div>
      {!user?.hasAccess ? (
        !displaySelectPLan ? (
          <button
            onClick={onClick}
            className="flex w-fit items-center gap-2 rounded-lg border-2 border-black bg-main-yellow p-1 text-black max-lg:text-sm aspect-square  min-[450px]:p-[2px] sm:p-1"
          >
            <Image
              src="/icons/logout.svg"
              alt="logout"
              width={22}
              height={22}
              className=""
            />
          </button>
        ) : (
          <Link
            href="/subscription-select"
            className="flex w-fit items-center gap-2 rounded-lg border-2 border-black bg-main-yellow p-1 text-black max-lg:text-sm   min-[450px]:px-2 min-[450px]:py-[2px] sm:p-1"
          >
            {text}
          </Link>
        )
      ) : (
        <Link
          href="/login"
          className="flex w-fit items-center gap-2 rounded-lg border-2 border-black bg-main-yellow p-1 text-black max-lg:text-sm max-[450px]:aspect-square sm:max-[820px]:aspect-square min-[450px]:px-2 min-[450px]:py-[2px] sm:p-1"
        >
          <Image
            src="/icons/user.svg"
            alt="user"
            width={18}
            height={18}
            className="aspect-square min-[450px]:w-[20px] lg:w-[22px]"
          />
          <p className="max-[450px]:hidden sm:max-[820px]:hidden">
            {accountButton}
          </p>
        </Link>
      )}
    </div>
  );
};

export default LogoutSelect;
