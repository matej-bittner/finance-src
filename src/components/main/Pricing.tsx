import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
const Pricing = () => {
  const t = useTranslations("pricing");
  const pricingPoints = [
    t("points.income"),
    t("points.savings"),
    t("points.loans"),
    t("points.subscription"),
    t("points.statistics"),
    t("points.support"),
    t("points.family"),
  ];
  const pricingBoxesData = [
    {
      title: t("box-1.title"),

      "price-month": "??",
      "price-year": "??",
      in_price: t("box-1.in-price"),
    },
    {
      title: t("box-2.title"),

      "price-month": "8",
      "price-year": "80",
      in_price: t("box-2.in-price"),
    },
  ];

  return (
    <div className="spacing-in-div">
      <h1 className="text-center">{t(`title`)}</h1>
      {/*boxes*/}
      <div className="flex gap-4 max-tb:flex-col sm:pt-2 xl:mx-auto xl:max-w-[1100px] xl:justify-around">
        {pricingBoxesData.map((pricingBox, i) => {
          return (
            <div
              key={i}
              className="flex h-[400px] relative overflow-clip w-full max-w-[350px] flex-col gap-3 rounded-xl border-2 border-white shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-main-yellow py-3 max-xl:mx-auto tb:h-[450px] tb:gap-5 tb:py-4 lg:h-[500px] lg:max-w-[400px] lg:py-5 xl:h-[550px] xl:max-w-[450px] xl:py-6"
            >
              {i === 0 && (
                <div className="absolute inset-0  backdrop-blur-[1px]  w-full h-full">
                  <div className="absolute bg-main-blue border-2 border-white text-white font-medium text-lg rotate-45 top-10 md:top-14 -right-32 md:-right-28 h-[60px] w-[400px] flex items-center justify-center ">
                    <p>{t("coming-soon")}</p>
                  </div>
                </div>
              )}
              <h3 className="text-center">{pricingBox.title}</h3>

              <div
                className={` flex w-fit items-center gap-4 pl-4 min-[400px]:pl-6 lg:pl-10 xl:pl-16`}
              >
                <p className="price-amount">
                  {pricingBox["price-month"]}
                  <span className="text-xs font-normal lg:text-sm">
                    eur/{t(`period1`)}
                  </span>
                </p>
                <hr className="h-[50px] border-[1px] border-black" />
                <p className="price-amount">
                  {pricingBox["price-year"]}

                  <span className="text-xs font-normal lg:text-sm">
                    eur/{t(`period2`)}
                  </span>
                </p>
              </div>
              <div className="flex w-full flex-1 flex-col justify-between pl-4 lg:py-1 lg:pl-8 xl:pl-12">
                {pricingPoints.map((point, i) => {
                  let check = point.includes("Family");

                  return (
                    <div key={point}>
                      <div
                        key={i}
                        className={`flex gap-3 ${check ? "items-start" : "items-center"}`}
                      >
                        <Image
                          src={`/icons/${Number(pricingBox.in_price) > i ? "check-rounded" : "cancel-rounded"}.svg`}
                          alt="in-price-icon"
                          className={`${Number(pricingBox.in_price) > i ? "" : "opacity-40"} aspect-square xl:w-[26px]`}
                          width={22}
                          height={22}
                        />
                        <p
                          className={`text-left max-lg:whitespace-pre ${Number(pricingBox.in_price) > i ? "text-black" : "text-black/40"}`}
                        >
                          {!check ? point : point.replace("/", "/\n")}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              {i === 0 ? (
                <p className="mx-auto w-fit rounded-xl px-3 py-[2px] text-center text-lg font-semibold tb:px-2 tb:py-1 lg:px-[12px] lg:text-xl xl:px-4 xl:py-[6px]">
                  {t(`purchase-text`)}
                </p>
              ) : (
                <Link
                  href="/register"
                  // href={pricingBox.link}
                  className="mx-auto w-fit rounded-xl px-3 py-[2px] text-center text-lg font-semibold tb:px-2 tb:py-1 lg:px-[12px] lg:text-xl xl:px-4 xl:py-[6px]"
                >
                  {t(`purchase-text`)}
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Pricing;
