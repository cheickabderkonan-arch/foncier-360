import { z } from "zod";

export const projectSchema = z.object({
  name: z.string().trim().min(2).max(120),
  location: z.string().trim().max(160).optional(),
  totalAreaM2: z.number().positive().optional(),
});

export const lotSchema = z.object({
  projectId: z.string().cuid(),
  code: z.string().trim().min(1).max(40),
  areaM2: z.number().positive(),
  price: z.number().nonnegative(),
});

export const customerSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  phone: z.string().trim().max(30).optional(),
  email: z.string().email().optional(),
});

export type ProjectInput = z.infer<typeof projectSchema>;
export type LotInput = z.infer<typeof lotSchema>;
export type CustomerInput = z.infer<typeof customerSchema>;
