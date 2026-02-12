import crypto from "node:crypto";

export async function createPayPlusCheckout(params: {
  workspaceId: string;
  plan: "PRO_MONTHLY" | "PRO_YEARLY";
  email: string;
}) {
  return {
    checkoutUrl: `https://example.payplus.test/checkout?workspace=${params.workspaceId}&plan=${params.plan}`,
    externalSubscriptionId: `pp_sub_${Date.now()}`
  };
}

export function verifyPayPlusWebhook(signature: string | null, payloadRaw: string) {
  const secret = process.env.PAYPLUS_WEBHOOK_SECRET;
  if (!signature || !secret) return false;
  const expected = crypto.createHmac("sha256", secret).update(payloadRaw).digest("hex");
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length != b.length) return false;
  return crypto.timingSafeEqual(a, b);
}
