import { NextResponse } from "next/server";
import { deleteDeal, updateDeal } from "@/lib/services/deal-service";
import { requireWorkspace } from "@/lib/tenancy/workspace";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const { workspaceId } = await requireWorkspace();
  const body = await request.json();
  const deal = await updateDeal(workspaceId, params.id, body);
  return NextResponse.json(deal);
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const { workspaceId } = await requireWorkspace();
  await deleteDeal(workspaceId, params.id);
  return NextResponse.json({ ok: true });
}
