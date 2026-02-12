import type { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { verifyPayPlusWebhook } from "@/lib/billing/payplus";
import { handleRoute } from "@/lib/api/handle-route";
import { AppError } from "@/lib/tenancy/errors";

export async function POST(request: Request) {
  return handleRoute(async () => {
    const signature = request.headers.get("x-payplus-signature");
    const rawBody = await request.text();

    if (!verifyPayPlusWebhook(signature, rawBody)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    let payload: ({ eventId?: string; type?: string } & Record<string, unknown>) | null = null;
    try {
      payload = JSON.parse(rawBody) as { eventId?: string; type?: string } & Record<string, unknown>;
    } catch {
      throw new AppError("Malformed JSON payload", 400);
    }

    const payloadJson = payload as Prisma.InputJsonValue;
    const eventId = String(payload.eventId ?? "");

    if (!eventId) {
      throw new AppError("Missing eventId", 400);
    }

    await prisma.webhookEvent.upsert({
      where: { provider_eventId: { provider: "PAYPLUS", eventId } },
      update: { payloadJson, status: "processed", processedAt: new Date() },
      create: {
        provider: "PAYPLUS",
        eventId,
        type: payload.type ?? "unknown",
        payloadJson,
        status: "processed",
        processedAt: new Date()
      }
    });

    return NextResponse.json({ ok: true });
  });
}
