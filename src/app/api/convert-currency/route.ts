import { currentUser } from "@/helpers/current-user";
import { NextResponse } from "next/server";
import { NextApiRequest, NextApiResponse } from "next";

export async function convertCurrency(userCurrency: string | undefined) {
  const user = await currentUser();
  if (!user) return;

  let currency;
  if (userCurrency) {
    currency = userCurrency;
  } else {
    currency = user.mainCurrency;
  }

  try {
    const response = await fetch(
      `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_RATE_API_KEY}/latest/${currency}`,
      {
        method: "GET",
        next: {
          revalidate: 60 * 60 * 24, // 24 hours
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch exchange rate");
    }

    const data = await response.json();
    const { conversion_rates } = data;

    return conversion_rates;
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    return null;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    const { currency } = req.query;
    const conversionRates = await convertCurrency(currency as string);

    if (conversionRates) {
      res.status(200).json({ conversionRates });
    } else {
      res.status(500).json({ error: "Failed to fetch conversion rates" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

// export async function convertCurrency(userCurrency: string | undefined) {
//   const user = await currentUser();
//   if (!user) return;
//
//   let currency;
//   if (userCurrency) {
//     currency = userCurrency;
//   } else {
//     currency = user.mainCurrency;
//   }
//
//   const response = await fetch(
//     `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_RATE_API_KEY}/latest/${currency}`,
//     {
//       next: {
//         revalidate: 60 * 60 * 24, //24 hours
//       },
//     },
//   );
//
//   const { conversion_rates } = await response.json();
//
//   return conversion_rates;
// }
