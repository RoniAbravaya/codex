import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";

export async function requireWorkspace() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("UNAUTHORIZED");
  }
  const membership = await prisma.membership.findFirst({
    where: { userId: session.user.id, role: "OWNER" },
    select: { workspaceId: true }
  });
  if (!membership) {
    throw new Error("NO_WORKSPACE");
  }
  return {
    userId: session.user.id,
    workspaceId: membership.workspaceId
  };
}
