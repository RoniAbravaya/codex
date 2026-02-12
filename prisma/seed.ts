import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "demo@microcrm.dev" },
    update: {},
    create: { email: "demo@microcrm.dev", name: "Demo Owner" }
  });

  const workspace = await prisma.workspace.create({
    data: {
      name: "Demo Workspace",
      ownerId: user.id,
      memberships: { create: { userId: user.id, role: "OWNER" } },
      subscription: {
        create: {
          provider: "PAYPLUS",
          plan: "FREE",
          status: "TRIALING",
          trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
        }
      }
    }
  });

  const client = await prisma.client.create({
    data: {
      workspaceId: workspace.id,
      createdById: user.id,
      name: "Acme Studio",
      email: "hello@acme.studio",
      company: "Acme",
      tags: ["design", "vip"]
    }
  });

  await prisma.deal.create({
    data: {
      workspaceId: workspace.id,
      clientId: client.id,
      title: "Website redesign",
      stage: "PROPOSAL",
      valueCents: 450000
    }
  });

  await prisma.task.create({
    data: {
      workspaceId: workspace.id,
      createdById: user.id,
      clientId: client.id,
      title: "Follow up proposal",
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      status: "OPEN"
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
