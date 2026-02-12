import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/db/prisma", () => ({
  prisma: {
    client: {
      findMany: vi.fn().mockResolvedValue([]),
      update: vi.fn().mockResolvedValue({}),
      delete: vi.fn().mockResolvedValue({})
    }
  }
}));

import { prisma } from "@/lib/db/prisma";
import { deleteClient, listClients, updateClient } from "@/lib/services/client-service";

describe("client service tenancy", () => {
  it("scopes list to workspaceId", async () => {
    await listClients("ws_1", "acme");
    expect(prisma.client.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: expect.objectContaining({ workspaceId: "ws_1" }) }));
  });

  it("scopes update to workspaceId", async () => {
    await updateClient("ws_2", "cl_1", { name: "Changed" });
    expect(prisma.client.update).toHaveBeenCalledWith(expect.objectContaining({ where: { id: "cl_1", workspaceId: "ws_2" } }));
  });

  it("scopes delete to workspaceId", async () => {
    await deleteClient("ws_3", "cl_2");
    expect(prisma.client.delete).toHaveBeenCalledWith({ where: { id: "cl_2", workspaceId: "ws_3" } });
  });
});
