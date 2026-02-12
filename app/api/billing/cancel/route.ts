import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireWorkspace } from "@/lib/tenancy/workspace";

export async function POST() {
  const { workspaceId } = await requireWorkspace();
  await prisma.subscription.update({ where: { workspaceId }, data: { cancelAtPeriodEnd: true } });
  return NextResponse.json({ ok: true });
}
