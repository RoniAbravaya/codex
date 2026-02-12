import Link from "next/link";

export default function SignInPage() {
  return (
    <section className="mx-auto max-w-md rounded border bg-white p-8 text-center shadow-sm">
      <h1 className="mb-2 text-2xl font-bold">Freelancer Micro-CRM</h1>
      <p className="mb-6 text-sm text-slate-600">Sign in with Google to access your workspace.</p>
      <Link
        href="/api/auth/signin/google"
        className="inline-flex rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white"
      >
        Continue with Google
      </Link>
    </section>
  );
}
