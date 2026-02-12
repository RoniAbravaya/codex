import { NextResponse } from "next/server";
import { runDailyReminders } from "@/lib/jobs/reminders";

function isAuthorized(request: Request) {
  const authHeader = request.headers.get("authorization");
  const bearer = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  return bearer === process.env.CRON_SECRET;
}

async function runJob(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const count = await runDailyReminders();
    return NextResponse.json({ sent: count });
  } catch {
    return NextResponse.json({ error: "Failed to run reminders" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  return runJob(request);
}

export async function POST(request: Request) {
  return runJob(request);
}
