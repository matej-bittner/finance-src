import React from "react";
import Link from "next/link";

interface CardFooterProps {
  backLink1: string;
  backLink2?: string;
  backText1: string;
  backText2?: string;
}
const CardFooter = ({
  backText1,
  backText2,
  backLink1,
  backLink2,
}: CardFooterProps) => {
  return (
    <div className="flex flex-col gap-3 pt-1 w-full">
      <Link href={backLink1} className="underline text-sm">
        {backText1}
      </Link>
      {backText2 && backLink2 && (
        <Link href={backLink2} className="text-sm">
          {backText2}
        </Link>
      )}
    </div>
  );
};

export default CardFooter;
