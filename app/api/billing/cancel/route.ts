import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { handleRoute } from "@/lib/api/handle-route";
import { requireWorkspace } from "@/lib/tenancy/workspace";

export async function POST() {
  return handleRoute(async () => {
    const { workspaceId } = await requireWorkspace();
    await prisma.subscription.update({ where: { workspaceId }, data: { cancelAtPeriodEnd: true } });
    return NextResponse.json({ ok: true });
  });
}
