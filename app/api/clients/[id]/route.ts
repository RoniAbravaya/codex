import { NextResponse } from "next/server";
import { deleteClient, updateClient } from "@/lib/services/client-service";
import { requireWorkspace } from "@/lib/tenancy/workspace";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const { workspaceId } = await requireWorkspace();
  const body = await request.json();
  const client = await updateClient(workspaceId, params.id, body);
  return NextResponse.json(client);
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const { workspaceId } = await requireWorkspace();
  await deleteClient(workspaceId, params.id);
  return NextResponse.json({ ok: true });
}
