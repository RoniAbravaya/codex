import { startOfDay, endOfDay } from "date-fns";
import { prisma } from "@/lib/db/prisma";
import { sendEmail } from "@/lib/email/mailer";

export async function runDailyReminders() {
  const now = new Date();
  const overdue = await prisma.task.findMany({
    where: {
      status: "OPEN",
      dueDate: { lte: endOfDay(now) }
    },
    include: { workspace: { include: { owner: true } } }
  });

  await Promise.all(
    overdue.map((task) =>
      sendEmail({
        to: task.workspace.owner.email ?? "owner@example.com",
        subject: `Reminder: ${task.title}`,
        html: `<p>Task due on ${task.dueDate.toISOString()}</p><p>Window starts ${startOfDay(now).toISOString()}</p>`
      })
    )
  );

  return overdue.length;
}
