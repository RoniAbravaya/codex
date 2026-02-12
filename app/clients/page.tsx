import { ClientForm } from "@/components/client-form";
import { Nav } from "@/components/nav";
import { listClients } from "@/lib/services/client-service";
import { requireWorkspacePage } from "@/lib/tenancy/page-auth";

export default async function ClientsPage() {
  const { workspaceId } = await requireWorkspacePage();
  const clients = await listClients(workspaceId);

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
