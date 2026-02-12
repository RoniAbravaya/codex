"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";

export function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onCredentialsSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false
    });
    setLoading(false);

    if (result?.error) {
      toast.error("Invalid email or password");
      return;
    }

    window.location.href = "/";
  }

  return (
    <div className="space-y-4">
      <Link href="/api/auth/signin/google" className="inline-flex w-full justify-center rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white">
        Continue with Google
      </Link>

      <div className="text-xs uppercase tracking-wide text-slate-500">or sign in with email</div>

      <form className="space-y-3" onSubmit={onCredentialsSignIn}>
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
        <button disabled={loading} className="w-full rounded bg-slate-700 px-4 py-2 text-sm font-medium text-white">
          {loading ? "Signing in..." : "Sign in with Email"}
        </button>
      </form>

      <p className="text-sm text-slate-600">
        Don&apos;t have an account? <Link href="/register" className="underline">Create one</Link>
      </p>
    </div>
  );
}
