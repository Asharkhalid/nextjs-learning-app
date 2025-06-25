// app/api/webhook/polar/route.ts
import { Webhooks } from "@polar-sh/nextjs";

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,
  onPayload: async (payload) => {
    console.log('Received webhook payload:', payload.type);
    
    // Handle different webhook events
    switch (payload.type) {
      case 'checkout.created':
        console.log('Checkout created:', payload.data);
        break;
      case 'checkout.updated':
        console.log('Checkout updated:', payload.data);
        break;
      case 'order.created':
        console.log('Order created:', payload.data);
        // Here you might want to:
        // - Send confirmation email
        // - Update your database
        // - Grant access to digital products
        break;
      case 'subscription.created':
        console.log('Subscription created:', payload.data);
        break;
      case 'subscription.updated':
        console.log('Subscription updated:', payload.data);
        break;
      default:
        console.log('Unhandled webhook event:', payload.type);
    }
  },
  onOrderCreated: async (order) => {
    console.log('Order created handler:', order);
    // Custom order processing logic here
  },
  onCheckoutUpdated: async (checkout) => {
    console.log('Checkout updated handler:', checkout);
    // Handle checkout status changes
  },
});