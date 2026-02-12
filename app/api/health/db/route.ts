import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { handleRoute } from "@/lib/api/handle-route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return handleRoute(async () => {
    await prisma.$queryRawUnsafe("SELECT 1");
    return NextResponse.json({ ok: true });
  });
}
