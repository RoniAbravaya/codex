import { Nav } from "@/components/nav";
import { TaskForm } from "@/components/task-form";
import { prisma } from "@/lib/db/prisma";
import { requireWorkspace } from "@/lib/tenancy/workspace";

export default async function TasksPage() {
  const { workspaceId } = await requireWorkspace();
  const tasks = await prisma.task.findMany({ where: { workspaceId }, orderBy: [{ status: "asc" }, { dueDate: "asc" }] });

  return (
    <section>
      <Nav />
      <h1 className="mb-4 text-2xl font-bold">Tasks / Follow-ups</h1>
      <TaskForm />
      <ul className="space-y-2">
        {tasks.map((task) => (
          <li key={task.id} className="rounded border bg-white p-3">
            <div className="font-medium">{task.title}</div>
            <div className="text-sm text-slate-600">
              {task.status} · due {task.dueDate.toDateString()}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
