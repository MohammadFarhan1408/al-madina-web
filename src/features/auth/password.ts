import { z } from "zod";

/** Mirrors the API's sign-up / reset policy (auth.schema.ts). */
export const newPasswordSchema = z
  .string()
  .min(8, "At least 8 characters")
  .regex(/[A-Za-z]/, "Include a letter")
  .regex(/\d/, "Include a number");
