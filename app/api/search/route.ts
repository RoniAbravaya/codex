import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireWorkspace } from "@/lib/tenancy/workspace";

export async function GET(request: Request) {
  const { workspaceId } = await requireWorkspace();
  const q = new URL(request.url).searchParams.get("q") ?? "";
  const [clients, deals, tasks] = await Promise.all([
    prisma.client.findMany({ where: { workspaceId, name: { contains: q, mode: "insensitive" } }, take: 5 }),
    prisma.deal.findMany({ where: { workspaceId, title: { contains: q, mode: "insensitive" } }, take: 5 }),
    prisma.task.findMany({ where: { workspaceId, title: { contains: q, mode: "insensitive" } }, take: 5 })
  ]);
  return NextResponse.json({ clients, deals, tasks });
}
