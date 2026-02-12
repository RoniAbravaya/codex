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

export function verifyPayPlusWebhook(signature: string | null) {
  return Boolean(signature);
}
