import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

const FirstSection = () => {
  const t = useTranslations("first-section");
  return (
    <div className="relative items-center justify-around min-[860px]:flex ">
      <h1 className=" text-center tb:hidden w-fit mx-auto relative z-10">
        {t(`title`)}
        <br /> {t(`title2`)}
      </h1>
      <div className="xl:flex xl:w-1/2 xl:items-center xl:justify-end">
        <div className=" max-[440px]:mx-auto relative z-10 max-w-[345px] space-y-4 sm:max-w-[370px] tb:max-w-[450px] min-[860px]:max-w-[500px] min-[860px]:flex-1 lg:space-y-5">
          <h1 className="hidden tb:block"> {t(`title`)}...</h1>
          <article className="space-y-3 tb:px-2 lg:space-y-4">
            <p className="main-text">{t(`text1`)}</p>
            <p className="main-text">{t(`text2`)}</p>
            <p className="main-text">{t(`text3`)}</p>
          </article>
          <h1 className="hidden text-right tb:block">... {t(`title2`)}.</h1>
        </div>
      </div>
      <div className="xl:flex xl:w-1/2 xl:items-center xl:justify-center opacity-20 min-[440px]:opacity-40 min-[540px]:opacity-100">
        <Image
          src="/images/chasing-money-gold.svg"
          alt="chasing-money"
          width={300}
          height={300}
          className=" absolute w-full max-[550px]:h-full object-cover bottom-0 min-[440px]:w-[340px] min-[440px]:right-[-25%] min-[490px]:right-[-20%] min-[590px]:right-[-14%] min-[620px]:right-[-9%] sm:right-[-12%] tb:-top-3 tb:w-[370px] md:right-[-5%] min-[860px]:relative min-[860px]:right-0 min-[860px]:top-0 lg:w-[400px] xl:aspect-[4/5] xl:w-[359px] xl:object-cover"
        />
      </div>
    </div>
  );
};

export default FirstSection;
