import { NextResponse } from "next/server";
import { toAppError } from "@/lib/tenancy/errors";

export async function handleRoute<T>(handler: () => Promise<T>) {
  try {
    return await handler();
  } catch (error) {
    const appError = toAppError(error);
    return NextResponse.json({ error: appError.message }, { status: appError.status });
  }
}
