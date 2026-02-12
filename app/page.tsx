import { Nav } from "@/components/nav";
import { prisma } from "@/lib/db/prisma";
import { requireWorkspace } from "@/lib/tenancy/workspace";

export default async function DashboardPage() {
  const { workspaceId } = await requireWorkspace();
  const [tasks, deals] = await Promise.all([
    prisma.task.findMany({ where: { workspaceId, status: "OPEN" }, take: 5, orderBy: { dueDate: "asc" } }),
    prisma.deal.groupBy({ by: ["stage"], where: { workspaceId }, _count: true })
  ]);

  return (
    <section>
      <Nav />
      <h1 className="mb-4 text-2xl font-bold">Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded border bg-white p-4">
          <h2 className="font-semibold">Upcoming tasks</h2>
          <ul className="mt-2 space-y-2 text-sm">
            {tasks.map((task) => (
              <li key={task.id}>
                {task.title} · {task.dueDate.toDateString()}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded border bg-white p-4">
          <h2 className="font-semibold">Pipeline summary</h2>
          <ul className="mt-2 space-y-2 text-sm">
            {deals.map((d) => (
              <li key={d.stage}>
                {d.stage}: {d._count}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
