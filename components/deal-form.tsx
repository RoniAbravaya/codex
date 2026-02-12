"use client";

import { useState } from "react";
import { toast } from "sonner";

export function DealForm({ clients }: { clients: { id: string; name: string }[] }) {
  const [title, setTitle] = useState("");
  const [clientId, setClientId] = useState(clients[0]?.id ?? "");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/deals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, clientId, stage: "LEAD", valueCents: 0 })
    });
    setLoading(false);
    if (res.ok) {
      toast.success("Deal created");
      setTitle("");
      window.location.reload();
    } else {
      toast.error("Failed to create deal");
    }
  }

  return (
    <form onSubmit={onSubmit} className="mb-4 flex gap-2">
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Deal title" className="rounded border p-2" />
      <select value={clientId} onChange={(e) => setClientId(e.target.value)} className="rounded border p-2">
        {clients.map((client) => (
          <option key={client.id} value={client.id}>
            {client.name}
          </option>
        ))}
      </select>
      <button disabled={loading || !clientId} className="rounded bg-slate-900 px-3 py-2 text-white">
        {loading ? "Saving..." : "Add deal"}
      </button>
    </form>
  );
}
