import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <section className="mx-auto max-w-md rounded border bg-white p-8 shadow-sm">
      <h1 className="mb-2 text-center text-2xl font-bold">Create your account</h1>
      <p className="mb-6 text-center text-sm text-slate-600">Use email and password if you don&apos;t have Gmail.</p>
      <RegisterForm />
    </section>
  );
}
