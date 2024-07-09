import React from "react";
import Link from "next/link";
import Image from "next/image";

const BlankAccountInfoDisplay = ({
  linkText,
  title,
}: {
  linkText: string;
  title: string;
}) => {
  return (
    <div className="box flex flex-col gap-2 min-[450px]:gap-3 w-full max-w-[380px] shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
      {/*top */}
      <div className="flex flex-col">
        <span className="h-[27px] w-full"></span>
        <hr className="border-black w-[90%] mx-auto" />
      </div>
      {/*account info*/}
      <div
        className={`bg-main-blue relative min-h-[130px] md:min-h-[110px] text-white flex flex-col rounded-xl min-[450px]:rounded-2xl py-2 gap-2 px-1 items-center justify-center`}
      >
        <p>{title}</p>
        <Link
          className="font-normal underline underline-offset-2 flex gap-1"
          href="/dashboard/accounts"
        >
          {linkText}
          <Image
            src="/icons/line-arrow-up.svg"
            alt="arrow"
            width={18}
            height={18}
            className="invert rotate-45"
          />
        </Link>
      </div>
    </div>
  );
};

export default BlankAccountInfoDisplay;
