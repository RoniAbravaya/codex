import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { verifyPayPlusWebhook } from "@/lib/billing/payplus";

export async function POST(request: Request) {
  const signature = request.headers.get("x-payplus-signature");
  if (!verifyPayPlusWebhook(signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const payload = await request.json();
  const eventId = String(payload.eventId ?? "");

  await prisma.webhookEvent.upsert({
    where: { provider_eventId: { provider: "PAYPLUS", eventId } },
    update: { payloadJson: payload, status: "processed", processedAt: new Date() },
    create: {
      provider: "PAYPLUS",
      eventId,
      type: payload.type ?? "unknown",
      payloadJson: payload,
      status: "processed",
      processedAt: new Date()
    }
  });

  return NextResponse.json({ ok: true });
}
