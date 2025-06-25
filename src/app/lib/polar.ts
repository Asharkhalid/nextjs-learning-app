// lib/polar.ts
import { Polar } from "@polar-sh/sdk";

export const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  server: process.env.POLAR_SERVER as "sandbox" | "production" || "sandbox",
});


// Create product with metered pricing
export async function createUsageBasedProduct() {
  const product = await polar.products.create({
    name: "AI Service Pro",
    description: "Professional AI service with usage-based billing",
    // isRecurring: true,
    recurringInterval: "month",
    organizationId: process.env.POLAR_ORGANIZATION_ID!,
    prices: [
      // {
      //   type: "recurring",
      //   recurringInterval: "month",
      //   priceAmount: 2999, // $29.99 base price in cents
      //   priceCurrency: "USD",
      // },
      {
        amountType: "metered_unit", // Metered price
        meterId: "your-meter-id",
        unitAmount: 10, // $0.10 per unit in cents
        priceCurrency: "USD",
      }
    ]
  });
  
  return product;
}