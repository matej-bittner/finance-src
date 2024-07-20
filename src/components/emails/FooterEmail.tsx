import React from "react";

const FooterEmail = ({
  message1,
  message2,
}: {
  message1: string;
  message2: string;
}) => {
  return (
    <div className="pt-2 flex-1 flex flex-col justify-center items-center">
      <p className="">{message1}</p>
      <p className="m-0">{message2} Wallet Recap</p>
    </div>
  );
};

export default FooterEmail;
