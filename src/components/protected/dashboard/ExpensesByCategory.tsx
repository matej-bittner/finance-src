import React from "react";
import Image from "next/image";
import { categories } from "@/constants";

// interface ExpensesByCategoryProps {
//   data: {
//     id: number;
//     title: string;
//     slug: string;
//     icon: string;
//   }[];
// }
const ExpensesByCategory = () => {
  // const ExpensesByCategory = ({ data }: ExpensesByCategoryProps) => {
  return (
    <div className="box w-full mx-auto grid grid-cols-1 min-[400px]:grid-cols-2 gap-2 max-w-[380px] sm:grid-cols-3 sm:max-w-[570px] md:grid-cols-1 lg:grid-cols-2 xl:h-full shadow-[0_3px_10px_rgb(0,0,0,0.2)] place-items-center">
      {categories.map((item) => (
        <div
          key={item.id}
          className="flex w-full items-center justify-around md:justify-between max-w-[250px] mx-auto h-fit  p-1 rounded-md group"
        >
          <Image
            src={`/category-icons/${item.icon}.svg`}
            alt={item.icon}
            width={30}
            height={30}
          />
          <div className="flex-1 pl-2">
            <p className="font-semibold">{item.value}</p>
            <p className="text-sm">12 000 CZK</p>
          </div>
          {/*<Image*/}
          {/*  src="/icons/expand-right.svg"*/}
          {/*  alt="show more"*/}
          {/*  width={30}*/}
          {/*  height={30}*/}
          {/*  className="group-hover:scale-110 origin-center transition-all duration-300"*/}
          {/*/>*/}
        </div>
      ))}
    </div>
  );
};

export default ExpensesByCategory;
