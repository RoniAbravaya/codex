import { NextResponse } from "next/server";
import { handleRoute } from "@/lib/api/handle-route";
import { createTask, listTasks } from "@/lib/services/task-service";
import { requireWorkspace } from "@/lib/tenancy/workspace";

export async function GET() {
  return handleRoute(async () => {
    const { workspaceId } = await requireWorkspace();
    const tasks = await listTasks(workspaceId);
    return NextResponse.json(tasks);
  });
}

export async function POST(request: Request) {
  return handleRoute(async () => {
    const { workspaceId, userId } = await requireWorkspace();
    const body = await request.json();
    const task = await createTask(workspaceId, userId, body);
    return NextResponse.json(task, { status: 201 });
  });
}
