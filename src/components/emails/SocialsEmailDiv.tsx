import React from "react";
import { socialsData } from "@/constants";
import { Img } from "@react-email/components";

const SocialsEmailDiv = () => {
  const domain = process.env.NEXT_PUBLIC_APP_URL;

  return (
    <div className="flex flex-col py-10 gap-2">
      <div className="flex gap-9 ">
        {socialsData.map((item, i) => {
          if (item.address) return;
          return (
            <a key={i} href={item.link} target="_blank">
              <Img
                src={`${domain}/icons/${item.icon}-black.svg`}
                width="50"
                height="50"
                alt={item.icon}
                className="aspect-square"
              />
            </a>
          );
        })}
      </div>
      <p className="text-center">info@walletrecap.com</p>
    </div>
  );
};

export default SocialsEmailDiv;
