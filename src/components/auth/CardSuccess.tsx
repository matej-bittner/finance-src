import React from "react";
import Image from "next/image";

const CardSuccess = ({ message }: { message?: string }) => {
  if (!message) return null;
  return (
    <div className="border-2 border-main-success text-main-success rounded-lg py-2 px-4 flex gap-4 items-center bg-white/20">
      <Image
        src="/icons/success.svg"
        className="text-white"
        alt="success"
        width={35}
        height={35}
      />
      <p>{message}</p>
    </div>
  );
};

export default CardSuccess;
