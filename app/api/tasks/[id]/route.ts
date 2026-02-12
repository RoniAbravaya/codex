import { NextResponse } from "next/server";
import { deleteTask, updateTask } from "@/lib/services/task-service";
import { requireWorkspace } from "@/lib/tenancy/workspace";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const { workspaceId } = await requireWorkspace();
  const body = await request.json();
  const task = await updateTask(workspaceId, params.id, body);
  return NextResponse.json(task);
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const { workspaceId } = await requireWorkspace();
  await deleteTask(workspaceId, params.id);
  return NextResponse.json({ ok: true });
}
