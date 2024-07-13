// import { currentUser } from "@/helpers/current-user";
// import { NextRequest, NextResponse } from "next/server";
// import { NextApiRequest, NextApiResponse } from "next";
// import { useCurrentUser } from "@/hooks/useCurrentUser";
// import { useSession } from "next-auth/react";
//
// export async function GET(req: NextRequest) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const userCurrency = searchParams.get("userCurrency");
//
//
//
//     return NextResponse.json("ok");
//   } catch (e) {
//     return NextResponse.json({ message: "ee" }, { status: 500 });
//   }

// let currency;
// if (userCurrency) {
//   currency = userCurrency;
// } else {
//   currency = user.mainCurrency;
// }
//
// //
// const response = await fetch(
//   `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_RATE_API_KEY}/latest/${currency}`,
//   {
//     next: {
//       revalidate: 60 * 60 * 24, //24 hours
//     },
//   },
// );
// //
// const data = await response.json();
// const { conversion_rates } = await response.json();
// if (conversion_rates) {
//   return NextResponse.json({ conversion_rates });
// } else {
//   return NextResponse.error();
// }
// }

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
