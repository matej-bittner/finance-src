import { currencies, frequencies } from "@/constants";
import { currentUser } from "@/helpers/current-user";

export const removeEmptyStrings = (data: any) => {
  return Object.entries(data)
    .filter(([key, value]) => value !== "")
    .reduce((obj, [key, value]) => {
      // @ts-ignore
      obj[key] = value;
      return obj;
    }, {});
};

export function getTomorrowDate() {
  return new Date(new Date().setDate(new Date().getDate() + 1))
    .toISOString()
    .slice(0, 10);
}

export function convertFrequencyToDate(
  frequency: number,
  dateToCalculateFrom?: string,
) {
  let date = new Date();
  if (dateToCalculateFrom) {
    date = new Date(dateToCalculateFrom);
  }
  date.setUTCHours(0, 0, 0, 0);

  if (frequency === 7 || frequency === 14) {
    date.setDate(date.getDate() + frequency); // Add days
  } else if (frequency === 30) {
    date.setMonth(date.getMonth() + 1); // Add 1 month
  } else if (frequency === 60) {
    date.setMonth(date.getMonth() + 2); // Add 2 months
  }

  return date;
}

export function getMonthArray(monthsCount: number) {
  const months = [];
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-11, so we add 1 to get 1-12

  for (let i = 0; i < monthsCount; i++) {
    let month = currentMonth - i;
    if (month <= 0) {
      month += monthsCount;
    }
    months.push(month.toString().padStart(2, "0")); // Ensures month is in "MM" format
  }

  return months;
}

export function findFrequencyByValue(frequencyToFind: number) {
  return frequencies.find(
    (frequency) => Number(frequency.value) === frequencyToFind,
  );
}
export const findCurrencySymbol = (value: string) => {
  const findSymbol = currencies.find(
    (currency) => currency.value === value,
  )?.symbol;
  if (findSymbol) {
    return findSymbol;
  } else return "";
};

export async function convertCurrency(userCurrency: string | undefined) {
  const user = await currentUser();
  if (!user) return;

  let currency;
  if (userCurrency) {
    currency = userCurrency;
  } else {
    currency = user.mainCurrency;
  }

  const response = await fetch(
    `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_RATE_API_KEY}/latest/${currency}`,
    {
      next: {
        revalidate: 60 * 60 * 24, //24 hours
      },
    },
  );

  const { conversion_rates } = await response.json();

  return conversion_rates;
}
