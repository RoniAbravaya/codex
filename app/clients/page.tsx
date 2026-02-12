import { ClientForm } from "@/components/client-form";
import { Nav } from "@/components/nav";
import { prisma } from "@/lib/db/prisma";
import { requireWorkspace } from "@/lib/tenancy/workspace";

export default async function ClientsPage() {
  const { workspaceId } = await requireWorkspace();
  const clients = await prisma.client.findMany({ where: { workspaceId }, orderBy: { createdAt: "desc" } });

  return (
    <section>
      <Nav />
      <h1 className="mb-4 text-2xl font-bold">Clients</h1>
      <ClientForm />
      <ul className="space-y-2">
        {clients.map((client) => (
          <li key={client.id} className="rounded border bg-white p-3">
            <div className="font-medium">{client.name}</div>
            <div className="text-sm text-slate-600">{client.email ?? "-"}</div>
          </li>
        ))}
      </ul>
    </section>
  );
}
