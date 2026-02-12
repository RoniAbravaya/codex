import { prisma } from "@/lib/db/prisma";
import { dealSchema } from "@/lib/validation/schemas";

export async function listDeals(workspaceId: string) {
  return prisma.deal.findMany({ where: { workspaceId }, include: { client: true }, orderBy: { createdAt: "desc" } });
}

export async function createDeal(workspaceId: string, payload: unknown) {
  const input = dealSchema.parse(payload);
  return prisma.deal.create({
    data: {
      workspaceId,
      title: input.title,
      clientId: input.clientId,
      valueCents: input.valueCents,
      stage: input.stage,
      expectedCloseDate: input.expectedCloseDate ? new Date(input.expectedCloseDate) : null
    }
  });
}

export async function updateDeal(workspaceId: string, id: string, payload: unknown) {
  const input = dealSchema.partial().parse(payload);

  return prisma.deal.update({
    where: { id, workspaceId },
    data: {
      ...(input.title !== undefined ? { title: input.title } : {}),
      ...(input.clientId !== undefined ? { clientId: input.clientId } : {}),
      ...(input.valueCents !== undefined ? { valueCents: input.valueCents } : {}),
      ...(input.stage !== undefined ? { stage: input.stage } : {}),
      ...(input.expectedCloseDate !== undefined
        ? { expectedCloseDate: input.expectedCloseDate ? new Date(input.expectedCloseDate) : null }
        : {})
    }
  });
}

export async function deleteDeal(workspaceId: string, id: string) {
  return prisma.deal.delete({ where: { id, workspaceId } });
}
