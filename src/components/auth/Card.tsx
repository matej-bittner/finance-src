import React from "react";
import CardFooter from "@/components/auth/CardFooter";
import Socials from "@/components/auth/SocialsLogin";

interface CardProps {
  children: React.ReactNode;
  title: string;
  backLink1: string;
  backLink2?: string;
  backText1: string;
  backText2?: string;
  showSocials?: boolean;
}

const Card = ({
  children,
  title,
  backLink1,
  backLink2,
  backText1,
  backText2,
  showSocials,
}: CardProps) => {
  return (
    <div className="max-sm:w-[96%] rounded-xl border-2 border-white bg-main-yellow flex flex-col items-center py-[12px] px-4 gap-3 min-[450px]:px-10 min-[450px]:py-6 min-[450px]:w-[440px] min-[500px]:gap-4">
      <h1 className="underline">{title}</h1>
      {showSocials && <Socials />}
      {children}
      <CardFooter
        backLink1={backLink1}
        backLink2={backLink2}
        backText1={backText1}
        backText2={backText2}
      />
    </div>
  );
};

export default Card;
