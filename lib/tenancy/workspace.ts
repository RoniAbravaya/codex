import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { AppError } from "@/lib/tenancy/errors";

export async function requireWorkspace() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new AppError("Unauthorized", 401);
  }

  const membership = await prisma.membership.findFirst({
    where: { userId: session.user.id, role: "OWNER" },
    select: { workspaceId: true }
  });

  if (!membership) {
    throw new AppError("Workspace not found", 404);
  }

  return {
    userId: session.user.id,
    workspaceId: membership.workspaceId
  };
}
