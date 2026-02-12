import { z } from "zod";

export const clientSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional().or(z.literal("")),
  company: z.string().optional(),
  phone: z.string().optional(),
  tags: z.array(z.string()).default([]),
  notes: z.string().optional()
});

export const taskSchema = z.object({
  title: z.string().min(2),
  dueDate: z.string().datetime(),
  status: z.enum(["OPEN", "DONE", "CANCELED"]).default("OPEN"),
  clientId: z.string().optional().nullable(),
  dealId: z.string().optional().nullable(),
  reminderAt: z.string().datetime().optional().nullable()
});

export const dealSchema = z.object({
  title: z.string().min(2),
  clientId: z.string(),
  valueCents: z.number().int().nonnegative().default(0),
  stage: z.enum(["LEAD", "PROPOSAL", "NEGOTIATION", "WON", "LOST"]),
  expectedCloseDate: z.string().datetime().optional().nullable()
});
