import { NextResponse } from "next/server";
import { createPayPlusCheckout } from "@/lib/billing/payplus";
import { prisma } from "@/lib/db/prisma";
import { handleRoute } from "@/lib/api/handle-route";
import { requireWorkspace } from "@/lib/tenancy/workspace";
import { subscribeSchema } from "@/lib/validation/billing";

export async function POST(request: Request) {
  return handleRoute(async () => {
    const { workspaceId, userId } = await requireWorkspace();
    const body = await request.json();
    const { plan } = subscribeSchema.parse(body);

    const subscription = await prisma.subscription.findUnique({ where: { workspaceId } });
    if (!subscription) {
      return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true } });
    if (!user?.email) {
      return NextResponse.json({ error: "Owner email missing" }, { status: 400 });
    }

    const checkout = await createPayPlusCheckout({
      workspaceId,
      plan,
      email: user.email
    });

    await prisma.subscription.update({
      where: { workspaceId },
      data: {
        providerSubscriptionId: checkout.externalSubscriptionId,
        status: "PENDING_WEBHOOK",
        plan
      }
    });

    return NextResponse.json({ checkoutUrl: checkout.checkoutUrl, subscriptionId: subscription.id });
  });
}
