import { prisma } from "@/lib/db/prisma";
import { clientSchema } from "@/lib/validation/schemas";

export async function listClients(workspaceId: string, search?: string) {
  return prisma.client.findMany({
    where: {
      workspaceId,
      OR: search
        ? [
            { name: { contains: search, mode: "insensitive" } },
            { company: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } }
          ]
        : undefined
    },
    orderBy: { createdAt: "desc" }
  });
}

export async function createClient(workspaceId: string, userId: string, payload: unknown) {
  const input = clientSchema.parse(payload);
  return prisma.client.create({
    data: {
      workspaceId,
      createdById: userId,
      name: input.name,
      email: input.email || null,
      company: input.company || null,
      phone: input.phone || null,
      tags: input.tags,
      notes: input.notes || null
    }
  });
}

export async function updateClient(workspaceId: string, id: string, payload: unknown) {
  const input = clientSchema.partial().parse(payload);
  return prisma.client.update({
    where: { id, workspaceId },
    data: {
      ...input,
      email: input.email === "" ? null : input.email
    }
  });
}

export async function deleteClient(workspaceId: string, id: string) {
  return prisma.client.delete({ where: { id, workspaceId } });
}
