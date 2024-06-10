import React from "react";
import Image from "next/image";
const CardError = ({ message }: { message?: string }) => {
  if (!message) return null;
  return (
    <div className="border-2 border-main-error text-main-error rounded-lg py-2 px-4 flex gap-4 items-center bg-white/20">
      <Image
        src="/icons/error.svg"
        className="text-white"
        alt="error"
        width={35}
        height={35}
      />
      <p>{message}</p>
    </div>
  );
};

export default CardError;
