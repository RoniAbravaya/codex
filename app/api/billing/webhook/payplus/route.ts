import type { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { verifyPayPlusWebhook } from "@/lib/billing/payplus";

export async function POST(request: Request) {
  const signature = request.headers.get("x-payplus-signature");
  const rawBody = await request.text();

  if (!verifyPayPlusWebhook(signature, rawBody)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const payload = JSON.parse(rawBody) as { eventId?: string; type?: string } & Record<string, unknown>;
  const payloadJson = payload as Prisma.InputJsonValue;
  const eventId = String(payload.eventId ?? "");

  if (!eventId) {
    return NextResponse.json({ error: "Missing eventId" }, { status: 400 });
  }

  await prisma.webhookEvent.upsert({
    where: { provider_eventId: { provider: "PAYPLUS", eventId } },
    update: { payloadJson: payloadJson, status: "processed", processedAt: new Date() },
    create: {
      provider: "PAYPLUS",
      eventId,
      type: payload.type ?? "unknown",
      payloadJson: payloadJson,
      status: "processed",
      processedAt: new Date()
    }
  });

  return NextResponse.json({ ok: true });
}
