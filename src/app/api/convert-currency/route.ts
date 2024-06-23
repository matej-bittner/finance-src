import { currentUser } from "@/helpers/current-user";

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
