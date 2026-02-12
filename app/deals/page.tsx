import { DealForm } from "@/components/deal-form";
import { Nav } from "@/components/nav";
import { prisma } from "@/lib/db/prisma";
import { requireWorkspace } from "@/lib/tenancy/workspace";

export default async function DealsPage() {
  const { workspaceId } = await requireWorkspace();
  const [deals, clients] = await Promise.all([
    prisma.deal.findMany({ where: { workspaceId }, include: { client: true }, orderBy: { createdAt: "desc" } }),
    prisma.client.findMany({ where: { workspaceId }, select: { id: true, name: true } })
  ]);

  return (
    <section>
      <Nav />
      <h1 className="mb-4 text-2xl font-bold">Deals</h1>
      <DealForm clients={clients} />
      <ul className="space-y-2">
        {deals.map((deal) => (
          <li key={deal.id} className="rounded border bg-white p-3">
            <div className="font-medium">{deal.title}</div>
            <div className="text-sm text-slate-600">
              {deal.stage} · {deal.client.name} · ₪{(deal.valueCents / 100).toFixed(2)}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
