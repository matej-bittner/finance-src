import { headers } from "next/headers";
import { Stripe } from "stripe";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { plans } from "@/constants";
import { sendSuccessPayEmail } from "@/lib/mail";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET_KEY!;

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("stripe-signature") as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return new NextResponse("Invalid signature", { status: 400 });
  }

  console.log("Webhook received:", event.type);

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = await stripe.checkout.sessions.retrieve(
          (event.data.object as Stripe.Checkout.Session).id,
          {
            expand: ["line_items"],
          },
        );
        const customerId = session.customer as string;

        const customer: any = await stripe.customers.retrieve(customerId);

        if (!customer || !customer.email) {
          console.error("Customer not found or email missing.");
          return new NextResponse("Customer not found or email missing", {
            status: 400,
          });
        }

        const priceId = session.line_items?.data[0]?.price?.id;

        const selectedPlan = plans.find((plan) => plan.priceId === priceId);

        if (!selectedPlan) {
          console.error("Selected plan not found.");
          return new NextResponse("Selected plan not found", { status: 400 });
        }

        let user = await db.user.findUnique({
          where: {
            email: customer.email,
          },
        });

        const now = new Date();
        if (!user) {
          user = await db.user.create({
            data: {
              email: customer.email,
              // customerId: customer.id,
              mainCurrency: "usd",
              mainLanguage: "en",
              emailVerified: now,
            },
          });
        }

        await db.user.update({
          where: { id: user.id },
          data: {
            name: customer.name ?? null,
            hasAccess: true,
            subscriptionPriceId: priceId,
            customerId: customerId,
          },
        });

        await sendSuccessPayEmail(user.email, user.mainLanguage);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = await stripe.subscriptions.retrieve(
          (event.data.object as Stripe.Subscription).id,
        );

        const customerId = subscription.customer as string;
        const user = await db.user.findFirst({
          where: { customerId },
        });

        await db.user.update({
          where: { id: user?.id },
          data: { hasAccess: false },
        });

        break;
      }
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new NextResponse("Success", { status: 200 });
  } catch (error) {
    console.error("Error processing webhook event:", error);
    return new NextResponse("Error processing webhook event", { status: 500 });
  }
}
