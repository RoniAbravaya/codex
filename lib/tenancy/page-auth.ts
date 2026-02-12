import { redirect } from "next/navigation";
import { AppError } from "@/lib/tenancy/errors";
import { requireWorkspace } from "@/lib/tenancy/workspace";

export async function requireWorkspacePage() {
  try {
    return await requireWorkspace();
  } catch (error) {
    if (error instanceof AppError && (error.status === 401 || error.status === 404)) {
      redirect("/signin");
    }
    throw error;
  }
}
