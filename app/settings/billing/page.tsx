"use client";

import { Nav } from "@/components/nav";
import { toast } from "sonner";

async function subscribe(plan: "PRO_MONTHLY" | "PRO_YEARLY") {
  const res = await fetch("/api/billing/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ plan })
  });
  if (!res.ok) {
    toast.error("Subscription failed");
    return;
  }
  const data = await res.json();
  toast.success("Redirecting to payment");
  window.location.href = data.checkoutUrl;
}

export default function BillingPage() {
  return (
    <section>
      <Nav />
      <h1 className="mb-4 text-2xl font-bold">Settings / Billing</h1>
      <div className="space-y-3 rounded border bg-white p-4">
        <p className="text-sm text-slate-600">Trial default: 14 days. Gateway: PayPlus.</p>
        <div className="flex gap-2">
          <button onClick={() => subscribe("PRO_MONTHLY")} className="rounded bg-slate-900 px-3 py-2 text-white">
            Subscribe Pro Monthly
          </button>
          <button onClick={() => subscribe("PRO_YEARLY")} className="rounded bg-slate-700 px-3 py-2 text-white">
            Subscribe Pro Yearly
          </button>
        </div>
      </div>
    </section>
  );
}
