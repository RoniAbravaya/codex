import Link from "next/link";

const items = [
  ["Dashboard", "/"],
  ["Clients", "/clients"],
  ["Deals", "/deals"],
  ["Tasks", "/tasks"],
  ["Billing", "/settings/billing"]
] as const;

export function Nav() {
  return (
    <nav className="mb-6 flex gap-4 border-b pb-3">
      {items.map(([label, href]) => (
        <Link key={href} href={href} className="text-sm font-medium text-slate-700 hover:text-slate-900">
          {label}
        </Link>
      ))}
    </nav>
  );
}
