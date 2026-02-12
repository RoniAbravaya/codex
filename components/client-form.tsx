"use client";

import { useState } from "react";
import { toast } from "sonner";

export function ClientForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, tags: [] })
    });
    setLoading(false);
    if (res.ok) {
      toast.success("Client created");
      setName("");
      setEmail("");
      window.location.reload();
      return;
    }
    toast.error("Failed to create client");
  }

  return (
    <form onSubmit={onSubmit} className="mb-4 flex gap-2">
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Client name" className="rounded border p-2" />
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="rounded border p-2" />
      <button disabled={loading} className="rounded bg-slate-900 px-3 py-2 text-white">
        {loading ? "Saving..." : "Add client"}
      </button>
    </form>
  );
}
