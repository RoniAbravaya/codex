import { beforeEach, describe, expect, it, vi } from "vitest";

const data: any[] = [];

vi.mock("@/lib/db/prisma", () => ({
  prisma: {
    client: {
      findMany: vi.fn(async ({ where }: any) => data.filter((d) => d.workspaceId === where.workspaceId)),
      create: vi.fn(async ({ data: payload }: any) => {
        const row = { id: `cl_${data.length + 1}`, ...payload };
        data.push(row);
        return row;
      }),
      update: vi.fn(async ({ where, data: payload }: any) => {
        const idx = data.findIndex((d) => d.id === where.id && d.workspaceId === where.workspaceId);
        data[idx] = { ...data[idx], ...payload };
        return data[idx];
      }),
      delete: vi.fn(async ({ where }: any) => {
        const idx = data.findIndex((d) => d.id === where.id && d.workspaceId === where.workspaceId);
        const [removed] = data.splice(idx, 1);
        return removed;
      })
    }
  }
}));

import { createClient, deleteClient, listClients, updateClient } from "@/lib/services/client-service";

describe("client CRUD integration", () => {
  beforeEach(() => {
    data.length = 0;
  });

  it("creates, updates, lists and deletes within a workspace", async () => {
    const created = await createClient("ws_1", "u_1", { name: "Acme", email: "a@a.com", tags: [] });
    expect(created.name).toBe("Acme");

    await updateClient("ws_1", created.id, { company: "Acme Ltd" });
    const listed = await listClients("ws_1");
    expect(listed).toHaveLength(1);
    expect(listed[0].company).toBe("Acme Ltd");

    await deleteClient("ws_1", created.id);
    const empty = await listClients("ws_1");
    expect(empty).toHaveLength(0);
  });
});
