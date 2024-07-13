import React from "react";
import { socialsData } from "../../constants/index";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="h-fit bg-main-blue text-white flex flex-col items-center py-3 tb:pt-5 ">
      <h2 className="text-2xl tb:text-3xl tb:pb-2 font-medium ">
        Family Finance
      </h2>
      <p className="text-lg">2024</p>
      <div className="flex flex-col items-center gap-3 py-4">
        <p>Contact Us</p>
        <div className="flex gap-6">
          {socialsData.map((item, i) => {
            if (item.address) return;
            return (
              <a key={i} href={item.link}>
                <Image
                  src={`http://localhost:3000/icons/${item.icon}.svg`}
                  width="40"
                  height="40"
                  alt={item.icon}
                  className="aspect-square "
                />
              </a>
            );
          })}
        </div>
        <p>nates-bittner@gmail.com</p>
      </div>
    </footer>
  );
};

export default Footer;
