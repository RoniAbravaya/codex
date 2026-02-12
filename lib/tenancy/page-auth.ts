import { redirect } from "next/navigation";
import { requireWorkspace } from "@/lib/tenancy/workspace";

export async function requireWorkspacePage() {
  try {
    return await requireWorkspace();
  } catch {
    redirect("/signin");
  }
}
