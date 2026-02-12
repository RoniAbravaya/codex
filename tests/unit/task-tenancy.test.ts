import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/db/prisma", () => ({
  prisma: {
    task: {
      findMany: vi.fn().mockResolvedValue([])
    }
  }
}));

import { prisma } from "@/lib/db/prisma";
import { listTasks } from "@/lib/services/task-service";

describe("task service tenancy", () => {
  it("scopes list by workspace", async () => {
    await listTasks("ws_1");
    expect(prisma.task.findMany).toHaveBeenCalledWith({ where: { workspaceId: "ws_1" }, orderBy: [{ dueDate: "asc" }] });
  });
});
