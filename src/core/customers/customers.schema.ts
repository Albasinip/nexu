import { z } from "zod";

/**
 * Helpers
 */


/**
 * Fields
 */

const nameSchema = z
  .string()
  .min(1, "El nombre es obligatorio")
  .trim()
  .min(2, "El nombre debe tener al menos 2 caracteres")
  .max(80, "El nombre no puede superar los 80 caracteres");

const emailSchema = z
  .string()
  .min(1, "El correo es obligatorio")
  .trim()
  .toLowerCase()
  .email("Ingresa un correo válido");

const phoneSchema = z.preprocess((value) => {
  if (value === null || value === undefined) return undefined;
  if (typeof value !== "string") return value;

  const cleaned = value.replace(/\s+/g, "").trim();
  return cleaned === "" ? undefined : cleaned;
},
  z
    .string()
    .regex(/^\+?\d{8,15}$/, "Teléfono inválido")
    .optional());

/**
 * Schema
 */

export const customerInputSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
});

/**
 * Types
 */

export type CustomerInputDTO = z.infer<typeof customerInputSchema>;