import React from "react";

import CategoryDropdown from "@/components/protected/category/CategoryDropdown";
import Link from "next/link";
import { categories } from "@/constants";
import {
  currentUser,
  getAllUsedCurrencies,
  getDataByCategory,
} from "@/helpers/current-user";
import CategoryChart from "@/components/protected/charts/CategoryChart";
import ExpensesByCategory from "@/components/protected/dashboard/ExpensesByCategory";
import { DataTable } from "@/components/protected/table/DataTable";
import { getTranslations } from "next-intl/server";

const CategoryPage = async ({
  searchParams,
}: {
  searchParams: { category?: number; month?: string; currency?: string };
}) => {
  const user = await currentUser();
  const t = await getTranslations("transaction-page");

  const categoryFromParams = searchParams.category
    ? Number(searchParams.category)
    : null;

  const usedCategory =
    categoryFromParams !== null
      ? categories.find((cat) => cat.id === categoryFromParams) || categories[0]
      : categories[0];

  const allUsedCurrenciesOnTransactions = await getAllUsedCurrencies(
    2,
    usedCategory.id,
  );

  const monthQuery = !searchParams.month
    ? undefined
    : searchParams.month === "previous"
      ? "previous"
      : undefined;

  const graphCurrencyExist = allUsedCurrenciesOnTransactions.find(
    (cur) => cur === searchParams.currency,
  )
    ? searchParams.currency
    : undefined;

  const dataForGraph: any = await getDataByCategory(
    monthQuery,
    usedCategory.id,
    graphCurrencyExist,
  );

  const dataForTable = await getDataByCategory(
    monthQuery,
    usedCategory.id,
    undefined,
    true,
  );

  return (
    <div className="flex flex-col w-full max-w-[95%] mx-auto gap-2 ">
      {/*sm dropdown*/}
      <div className="space-y-2">
        <div className="flex w-full items-center justify-center gap-1">
          <Link
            href="/dashboard/categories"
            className={`min-[300px]:text-lg  ${!monthQuery && "underline"}`}
          >
            {t(`this-month`)}
          </Link>
          <p>|</p>
          <Link
            href={`?month=previous`}
            className={`min-[300px]:text-lg ${searchParams.month === "previous" && "underline"}`}
          >
            {t(`last-month`)}
          </Link>
        </div>
        <div className="lg:hidden">
          <CategoryDropdown label={usedCategory.value} />
        </div>
      </div>
      {/*all categories on bic screen*/}
      <div className="flex max-xl:flex-col w-full pt-2 2xl:pt-6 lg:gap-4">
        <div className="max-lg:hidden xl:min-w-fit">
          <ExpensesByCategory flat usedCategoryId={usedCategory.id} />
        </div>
        {/*graph+table*/}
        <div className="flex flex-col w-full xl:flex-col-reverse  rounded-xl items-center max-w-[1200px] gap-2 lg:gap-4">
          {/*graph*/}
          <div className="max-w-[1000px] w-full">
            <CategoryChart
              data={dataForGraph}
              selectedCurrencyLabel={graphCurrencyExist || user?.mainCurrency}
              usedCurrencies={allUsedCurrenciesOnTransactions}
            />
          </div>
          {/*table*/}
          <div className="w-full h-fit min-h-[200px] max-w-[1000px] ">
            <DataTable data={dataForTable} type={1} full_width row_limit={10} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
