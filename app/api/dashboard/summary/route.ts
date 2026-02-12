import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireWorkspace } from "@/lib/tenancy/workspace";

export async function GET() {
  const { workspaceId } = await requireWorkspace();
  const [upcomingTasks, overdueTasks, pipeline] = await Promise.all([
    prisma.task.count({ where: { workspaceId, status: "OPEN", dueDate: { gte: new Date() } } }),
    prisma.task.count({ where: { workspaceId, status: "OPEN", dueDate: { lt: new Date() } } }),
    prisma.deal.groupBy({ by: ["stage"], where: { workspaceId }, _count: true })
  ]);
  return NextResponse.json({ upcomingTasks, overdueTasks, pipeline });
}
