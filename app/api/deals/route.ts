import { NextResponse } from "next/server";
import { createDeal, listDeals } from "@/lib/services/deal-service";
import { requireWorkspace } from "@/lib/tenancy/workspace";

export async function GET() {
  const { workspaceId } = await requireWorkspace();
  const deals = await listDeals(workspaceId);
  return NextResponse.json(deals);
}

export async function POST(request: Request) {
  const { workspaceId } = await requireWorkspace();
  const body = await request.json();
  const deal = await createDeal(workspaceId, body);
  return NextResponse.json(deal, { status: 201 });
}
