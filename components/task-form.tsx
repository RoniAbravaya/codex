"use client";

import { useState } from "react";
import { toast } from "sonner";

export function TaskForm() {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, dueDate: new Date().toISOString(), status: "OPEN" })
    });
    setLoading(false);
    if (res.ok) {
      toast.success("Task created");
      setTitle("");
      window.location.reload();
    } else {
      toast.error("Failed to create task");
    }
  }

  return (
    <form onSubmit={onSubmit} className="mb-4 flex gap-2">
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Follow-up task" className="rounded border p-2" />
      <button disabled={loading} className="rounded bg-slate-900 px-3 py-2 text-white">
        {loading ? "Saving..." : "Add task"}
      </button>
    </form>
  );
}
