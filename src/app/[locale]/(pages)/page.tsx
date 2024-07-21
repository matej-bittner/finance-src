import React from "react";
import Image from "next/image";
import PotentialTable from "@/components/main/PotentialTable";
import Socials from "@/components/main/Socials";
import { useTranslations } from "next-intl";
import FirstSection from "@/components/main/FirstSection";
import Pricing from "@/components/main/Pricing";
const Page = () => {
  const t = useTranslations("demo-section");

  return (
    <section className="w-full space-y-4 py-5 tb:space-y-6 tb:py-6 min-h-screen">
      <div className="limited-width spacing-between-divs overflow-clip pb-1 lg:pb-2">
        {/*manage your money*/}
        <FirstSection />
        <hr className="mx-auto w-[80%] border-[1px] border-black" />
        <PotentialTable />
      </div>
      <Socials />
      {/*limit width box*/}
      <div
        className="limited-width spacing-between-divs overflow-clip pt-1 lg:pt-2 "
        id="pricing"
      >
        {/*pricing*/}
        <Pricing />
        <hr className="mx-auto w-[80%] border-[1px] border-black" />
        <div className="spacing-in-div flex flex-col items-center" id="demo">
          <h1 className="">{t(`title`)}</h1>
          <p className="main-text max-w-[800px] text-center">{t(`text`)}</p>
          <div className="relative w-full sm:max-w-[580px] md:max-w-[680px] lg:max-w-[750px] xl:max-w-[890px]">
            {Array.from({ length: 4 }).map((_, i) => (
              <Image
                key={i}
                src="/icons/corner.svg"
                alt="corner"
                className={`absolute aspect-square min-[550px]:w-[34px] ${i === 0 && "left-0 top-0"} ${i === 1 && "bottom-0 left-0 -rotate-90"} ${i === 2 && "right-0 top-0 scale-x-[-1]"} ${i === 3 && "bottom-0 right-0 rotate-90 scale-x-[-1]"}`}
                width={28}
                height={28}
              />
            ))}
            <div className="m-3 aspect-video w-[calc(100%-24px)] bg-black/10 min-[550px]:m-4 min-[550px]:w-[calc(100%-32px)]"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Page;
