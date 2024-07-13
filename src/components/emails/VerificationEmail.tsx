import * as React from "react";

import SocialsEmailDiv from "@/components/emails/SocialsEmailDiv";
import EmailCard from "@/components/emails/EmailCard";

export default function VerificationEmail(link: string, messages: any) {
  return (
    <EmailCard>
      <div className="flex-1 flex flex-col m-0 p-0 items-center w-full font-medium">
        <h1 className="pt-6 break-words">{messages.title}</h1>
        <div className="flex flex-col items-center gap-4 py-6 text-center">
          <p className="m-0">{messages.text1}</p>

          <p className=" m-0">{messages.text2}</p>
          <a href={link} className="text-black underline-offset-1 m-0  ">
            {messages.clickHere}
          </a>
          <p className="pt-2">{messages.text3}</p>
        </div>
        <SocialsEmailDiv />
        <div className="pt-2 flex-1 flex flex-col justify-center ">
          <p className="">{messages.greeting}</p>
          <p className="m-0">{messages.greeting2} xxx</p>
        </div>
      </div>
    </EmailCard>
  );
}
