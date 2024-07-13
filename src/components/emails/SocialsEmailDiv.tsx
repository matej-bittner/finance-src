import React from "react";
import { socialsData } from "@/constants";
import { Img } from "@react-email/components";

const SocialsEmailDiv = () => {
  return (
    <div className="flex gap-9 py-10">
      {socialsData.map((item, i) => {
        if (item.address) return;
        return (
          <a key={i} href={item.link}>
            <Img
              src={`http://localhost:3000/icons/${item.icon}.svg`}
              width="50"
              height="50"
              alt={item.icon}
              className="aspect-square invert"
            />
          </a>
        );
      })}
    </div>
  );
};

export default SocialsEmailDiv;
