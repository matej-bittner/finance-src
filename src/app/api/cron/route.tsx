import { NextRequest, NextResponse } from "next/server";
import { ManagePeriodicPayments } from "@/helpers/current-user";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }
  try {
    await ManagePeriodicPayments();
    return NextResponse.json({ message: "Cron Job Ran at: " + new Date() });
  } catch (error: any) {
    return NextResponse.json({ error: error.message + new Date() });
  }
}
