import { NextRequest, NextResponse } from "next/server";
import { polar } from "@/app/lib/polar"; // Assuming your polar client is exported from here

export async function GET(request: NextRequest) {
  const customerId = request.nextUrl.searchParams.get("customerId");

  if (!customerId) {
    return NextResponse.json(
      { error: "Customer ID is required" },
      { status: 400 }
    );
  }

  try {
    // Fetch the customer state from Polar
    const customerState = await polar.customers.getState({
      id: customerId,
    });

    // Extract balances and usage from active meters
    const balances = customerState.activeMeters.reduce<
      Record<string, { balance: number; consumedUnits: number; creditedUnits: number }>
    >((acc, meter) => {
      if (meter.meterId) {
        acc[meter.meterId] = {
          balance: meter.balance,
          consumedUnits: meter.consumedUnits,
          creditedUnits: meter.creditedUnits,
        };
      }
      return acc;
    }, {});

    // Return the balances
    return NextResponse.json({ balances });
  } catch (error: unknown) {
    console.error(`Error fetching balance for customer ${customerId}:`, error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch customer balance." },
      { status: 500 }
    );
  }
}