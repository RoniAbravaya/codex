import { NextResponse } from "next/server";
import { runDailyReminders } from "@/lib/jobs/reminders";

export async function POST(request: Request) {
  const secret = request.headers.get("x-cron-secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const count = await runDailyReminders();
  return NextResponse.json({ sent: count });
}
