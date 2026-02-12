import { NextResponse } from "next/server";
import { createClient, listClients } from "@/lib/services/client-service";
import { requireWorkspace } from "@/lib/tenancy/workspace";

export async function GET(request: Request) {
  const { workspaceId } = await requireWorkspace();
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") ?? undefined;
  const clients = await listClients(workspaceId, search);
  return NextResponse.json(clients);
}

export async function POST(request: Request) {
  const { workspaceId, userId } = await requireWorkspace();
  const body = await request.json();
  const client = await createClient(workspaceId, userId, body);
  return NextResponse.json(client, { status: 201 });
}
