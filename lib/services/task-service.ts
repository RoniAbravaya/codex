import { prisma } from "@/lib/db/prisma";
import { taskSchema } from "@/lib/validation/schemas";

export async function listTasks(workspaceId: string) {
  return prisma.task.findMany({ where: { workspaceId }, orderBy: [{ dueDate: "asc" }] });
}

export async function createTask(workspaceId: string, userId: string, payload: unknown) {
  const input = taskSchema.parse(payload);
  return prisma.task.create({
    data: {
      workspaceId,
      createdById: userId,
      title: input.title,
      dueDate: new Date(input.dueDate),
      status: input.status,
      clientId: input.clientId,
      dealId: input.dealId,
      reminderAt: input.reminderAt ? new Date(input.reminderAt) : null
    }
  });
}

export async function updateTask(workspaceId: string, id: string, payload: unknown) {
  const input = taskSchema.partial().parse(payload);
  return prisma.task.update({
    where: { id, workspaceId },
    data: {
      ...(input.title ? { title: input.title } : {}),
      ...(input.status ? { status: input.status } : {}),
      ...(input.dueDate ? { dueDate: new Date(input.dueDate) } : {}),
      ...(input.reminderAt ? { reminderAt: new Date(input.reminderAt) } : {})
    }
  });
}

export async function deleteTask(workspaceId: string, id: string) {
  return prisma.task.delete({ where: { id, workspaceId } });
}
