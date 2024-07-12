import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

const BlogPage = () => {
  const t = useTranslations("blog-page");
  const data = [
    {
      stars: 2,
      title: t("blog-items.item1.title"),
      text: t("blog-items.item1.text"),
    },
    {
      stars: 1,
      title: t("blog-items.item2.title"),
      text: t("blog-items.item2.text"),
    },
    {
      stars: 1,
      title: t("blog-items.item3.title"),
      text: t("blog-items.item3.text"),
    },
    {
      stars: 3,
      title: t("blog-items.item4.title"),
      text: t("blog-items.item4.text"),
    },
    {
      stars: 1,
      title: t("blog-items.item5.title"),
      text: t("blog-items.item5.text"),
    },
  ];
  const filledStar = (i: number) => {
    return (
      <Image
        key={i}
        src="/icons/star-fill.svg"
        alt="star"
        width={20}
        height={20}
        className=""
      />
    );
  };
  const strokeStar = (i: number) => {
    return (
      <Image
        key={i}
        src="/icons/star.svg"
        alt="star"
        width={20}
        height={20}
        className=""
      />
    );
  };
  return (
    <section className="limited-width flex min-h-[calc(100vh-65px)] sm:min-h-[calc(100vh-75px)] md:min-h-[calc(100vh-85px)] flex-col py-5 tb:py-6 gap-2 md:gap-4 lg:gap-6">
      <h1 className="text-center underline">{t("title")}</h1>

      <div className="flex flex-1 ">
        <div className="w-[200px] border-black border-r-2  hidden relative flex-col gap-10"></div>
        <div className="flex flex-col gap-1 w-full items-center  space-y-2 md:space-y-4 mg:space-y-6">
          {data.map((item, i) => (
            <div
              key={i}
              className="flex flex-col gap-1 max-tb:max-w-[480px] tb:w-[600px] "
            >
              <div className="flex max-sm:flex-col sm:items-center sm:gap-1 tb:gap-3">
                <h2 className="tb:text-[22px]">{item.title}</h2>
                <p className="max-sm:hidden">|</p>
                <div className="flex max-sm:pl-3 gap-[1px] ">
                  <p className="max-tb:text-sm">{t("priority")}:</p>
                  {"abc".split("").map((_, index) => {
                    let star;
                    if (index + 1 <= item.stars) {
                      star = filledStar(index);
                    } else {
                      star = strokeStar(index);
                    }
                    return <p key={index}>{star}</p>;
                  })}
                </div>
              </div>
              <p className="pl-2">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogPage;
