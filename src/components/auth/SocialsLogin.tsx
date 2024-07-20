"use client";
import React from "react";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

const SocialsLogin = () => {
  // const onClick = (provider: "google" | "github") => {
  //   signIn(provider, {
  //     callbackUrl: DEFAULT_LOGIN_REDIRECT,
  //   });
  // };
  const onClick = (provider: "google" | "github") => {};
  return (
    <div className="flex w-full gap-4 ">
      <button className="form-buttons">
        <Image src="/icons/apple.svg" alt="apple" width={25} height={25} />
      </button>
      <button className="form-buttons" onClick={() => onClick("google")}>
        <Image src="/icons/google.svg" alt="google" width={25} height={25} />
      </button>
    </div>
  );
};

export default SocialsLogin;
