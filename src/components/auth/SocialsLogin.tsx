import React from "react";
import Image from "next/image";

const SocialsLogin = () => {
  return (
    <div className="flex w-full gap-4 ">
      <button className="form-buttons">
        <Image src="/icons/apple.svg" alt="apple" width={25} height={25} />
      </button>
      <button className="form-buttons">
        <Image src="/icons/google.svg" alt="google" width={25} height={25} />
      </button>
    </div>
  );
};

export default SocialsLogin;
