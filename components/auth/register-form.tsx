"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";

export function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });

    if (!res.ok) {
      setLoading(false);
      toast.error("Registration failed");
      return;
    }

    const login = await signIn("credentials", {
      email,
      password,
      redirect: false
    });

    setLoading(false);

    if (login?.error) {
      toast.error("Registered, but sign-in failed. Please sign in manually.");
      window.location.href = "/signin";
      return;
    }

    window.location.href = "/";
  }

  return (
    <form className="space-y-3" onSubmit={onRegister}>
      <input
        type="text"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Full name"
        className="w-full rounded border p-2"
      />
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full rounded border p-2"
      />
      <input
        type="password"
        required
        minLength={8}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full rounded border p-2"
      />
      <button disabled={loading} className="w-full rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white">
        {loading ? "Creating account..." : "Create account"}
      </button>

      <p className="text-sm text-slate-600">
        Already have an account? <Link href="/signin" className="underline">Sign in</Link>
      </p>
    </form>
  );
}
