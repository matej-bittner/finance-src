import { currencies } from "@/constants";

export const removeEmptyStrings = (data: any) => {
  return Object.entries(data)
    .filter(([key, value]) => value !== "")
    .reduce((obj, [key, value]) => {
      // @ts-ignore
      obj[key] = value;
      return obj;
    }, {});
};

export const findCurrencyByValue = (value: string) => {
  return currencies.find((currency) => currency.value === value);
};
