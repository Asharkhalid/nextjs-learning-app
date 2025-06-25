// lib/usage-tracking.ts
import { polar } from "./polar";

// Define the possible provider names explicitly
export type Provider = 'openai' | 'anthropic' | 'google' | 'cohere';

// Define your cost structure
const PROVIDER_COSTS: Record<Provider, number> = {
  'openai': 0.0001,      // 0.0001 credit per token
  'anthropic': 0.005,   // 0.005 credits per token
  'google': 0.0008,      // 0.0008 credits per token
  'cohere': 0.0002       // 0.0002 credits per token
};

// Function to calculate credit cost
function calculateCreditCost(provider: Provider, tokens: number): number {
  const rate = PROVIDER_COSTS[provider]; // Access is now type-safe for known providers
  // The `|| 1.0` fallback is removed as `provider` is guaranteed to be a key of PROVIDER_COSTS.
  return Math.ceil(tokens * rate); // Round up to ensure whole credits
}

export async function trackUsage(
  customerId: string,
  eventName: string = "ai_usage",
  metadata: Record<string, any>
) {
  try {
     console.log("executing usage tracking with customerId:", customerId);
     console.log("eventName:", eventName);
     console.log("metadata:", metadata);
    await polar.events.ingest({
      events: [
        {
          name: eventName,
          customerId: customerId, // or use customerId for Polar customer ID
          metadata: metadata,
          timestamp: new Date()

        },
      ],
    });
  } catch (error) {
    console.error("Failed to track usage:", error);
  }
}

// Credit Balance Monitoring
export async function checkCreditBalance(customerId: string): Promise<number> {
  const customerState = await polar.customers.getState({
    id: customerId
  });
  
  // Find your AI credits meter
  const aiMeter = customerState.activeMeters.find(meter => 
    meter.meterId === "616effd2-b2f3-4cab-8991-a954d9cc08ed"
  );
  
  return aiMeter ? aiMeter.balance : 0;
}

export async function canAffordUsage(customerId: string, provider: Provider, estimatedTokens: number): Promise<boolean> {
  const currentBalance = await checkCreditBalance(customerId);
  const estimatedCost = calculateCreditCost(provider, estimatedTokens);
  
  return currentBalance >= estimatedCost;
}

export async function trackAIUsage(customerId: string, provider: Provider, tokens: number, model: string) {
  const creditCost = calculateCreditCost(provider, tokens);
  
  await polar.events.ingest({
    events: [{
      name: "ai_credit_usage",
      customerId: customerId,
      metadata: {
        provider: provider,
        actual_tokens: tokens,
        credit_cost: creditCost,  // This is what gets summed by the meter
        model: model, // or whatever model
        timestamp: new Date().toISOString()
      }
    }]
  });
  return creditCost;
}
