import { z } from "zod";

export const subscribeSchema = z.object({
  plan: z.enum(["PRO_MONTHLY", "PRO_YEARLY"])
});
