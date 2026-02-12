import { SignInForm } from "@/components/auth/signin-form";

export default function SignInPage() {
  return (
    <section className="mx-auto max-w-md rounded border bg-white p-8 shadow-sm">
      <h1 className="mb-2 text-center text-2xl font-bold">Freelancer Micro-CRM</h1>
      <p className="mb-6 text-center text-sm text-slate-600">Sign in with Google or Email.</p>
      <SignInForm googleEnabled={Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)} />
    </section>
  );
}
