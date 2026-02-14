import "./globals.css";
import type { Metadata } from "next";
import { Toaster } from "sonner";
import { ApiRequestLogger } from "@/components/api-request-logger";

export const metadata: Metadata = {
  title: "Freelancer Micro-CRM",
  description: "Lean CRM for freelancers"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ApiRequestLogger />
        <main className="mx-auto min-h-screen max-w-5xl p-6">{children}</main>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
