import { NextResponse } from "next/server";
import { createPayPlusCheckout } from "@/lib/billing/payplus";
import { prisma } from "@/lib/db/prisma";
import { requireWorkspace } from "@/lib/tenancy/workspace";

export async function POST(request: Request) {
  const { workspaceId } = await requireWorkspace();
  const { plan } = (await request.json()) as { plan: "PRO_MONTHLY" | "PRO_YEARLY" };
  const subscription = await prisma.subscription.findUnique({ where: { workspaceId } });
  const checkout = await createPayPlusCheckout({
    workspaceId,
    plan,
    email: "owner@example.com"
  });
  await prisma.subscription.update({
    where: { workspaceId },
    data: {
      providerSubscriptionId: checkout.externalSubscriptionId,
      status: "PENDING_WEBHOOK",
      plan: plan === "PRO_YEARLY" ? "PRO_YEARLY" : "PRO_MONTHLY"
    }
  });
  return NextResponse.json({ checkoutUrl: checkout.checkoutUrl, subscriptionId: subscription?.id });
}
