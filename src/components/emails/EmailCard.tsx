import React from "react";
import tailwindConfig from "../../../tailwind.config";

import { Html, Head, Font, Tailwind, Body } from "@react-email/components";
const EmailCard = ({ children }: { children: React.ReactNode }) => {
  return (
    <Html>
      <Tailwind config={tailwindConfig}>
        <Head>
          <Font
            fontFamily="Manrope"
            fallbackFontFamily="Verdana"
            webFont={{
              url: "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600&display=swap",
              format: "woff2",
            }}
            fontStyle="normal"
            fontWeight="500"
          />
        </Head>
        <Body className="w-full flex flex-col size-full manrope p-0 m-0 min-h-[700px]">
          <div className="w-full bg-main-blue h-[60px] text-white flex items-center justify-center ">
            <h1 className="text-2xl font-medium">Wallet Recap</h1>
          </div>
          {children}
        </Body>
      </Tailwind>
    </Html>
  );
};

export default EmailCard;
