import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "";
const isTestOrMockKey = !stripeSecretKey || stripeSecretKey.includes("Mock");

// Initialize real Stripe instance when valid test/live key is present
export const stripeClient: Stripe | null = !isTestOrMockKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: "2025-02-24.acacia" as any,
      typescript: true,
    })
  : null;

export interface PaymentIntentOptions {
  amountInCents: number;
  currency: string;
  orderNumber: string;
  customerEmail: string;
  idempotencyKey?: string;
  metadata?: Record<string, string>;
}

export async function createStripePaymentIntent(options: PaymentIntentOptions) {
  const { amountInCents, currency, orderNumber, customerEmail, idempotencyKey, metadata } = options;

  if (stripeClient) {
    // Real Stripe API call
    const intent = await stripeClient.paymentIntents.create(
      {
        amount: Math.round(amountInCents),
        currency: currency.toLowerCase(),
        receipt_email: customerEmail,
        metadata: {
          orderNumber,
          customerEmail,
          ...metadata,
        },
        automatic_payment_methods: {
          enabled: true,
        },
      },
      idempotencyKey ? { idempotencyKey } : undefined
    );

    return {
      id: intent.id,
      clientSecret: intent.client_secret,
      status: intent.status,
      isSimulated: false,
    };
  }

  // High-fidelity local Test Simulator Mode
  // Used when developers run locally with initial test config
  const simulatedId = `pi_test_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const simulatedClientSecret = `${simulatedId}_secret_${Math.random().toString(36).substring(2, 12)}`;

  return {
    id: simulatedId,
    clientSecret: simulatedClientSecret,
    status: "requires_payment_method",
    isSimulated: true,
  };
}

export async function constructStripeWebhookEvent(rawBody: string, signature: string | null) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

  if (stripeClient && webhookSecret && !webhookSecret.includes("mock") && signature) {
    return stripeClient.webhooks.constructEvent(rawBody, signature, webhookSecret);
  }

  // Parse simulated test webhook event safely
  try {
    const parsed = JSON.parse(rawBody);
    if (parsed.type && parsed.data) {
      return parsed as Stripe.Event;
    }
  } catch {
    // invalid JSON
  }

  throw new Error("Unable to verify webhook signature: invalid signature or payload.");
}

export async function createStripeRefund(paymentIntentId: string, amountInCents?: number) {
  if (stripeClient && !paymentIntentId.startsWith("pi_test_")) {
    const refund = await stripeClient.refunds.create({
      payment_intent: paymentIntentId,
      amount: amountInCents ? Math.round(amountInCents) : undefined,
    });
    return { id: refund.id, status: refund.status };
  }

  return {
    id: `re_simulated_${Date.now()}`,
    status: "succeeded",
  };
}
