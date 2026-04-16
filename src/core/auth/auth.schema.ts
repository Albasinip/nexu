import { z } from "zod";

/**
 * Reglas base reutilizables
 */

const emailSchema = z
  .string()
  .min(1, "El correo es obligatorio")
  .trim()
  .toLowerCase()
  .email("Ingresa un correo válido");

const passwordSchema = z
  .string()
  .min(1, "La contraseña es obligatoria")
  .min(6, "La contraseña debe tener al menos 6 caracteres")
  .max(100, "La contraseña no puede superar los 100 caracteres");

const nameSchema = z
  .string()
  .min(1, "El nombre es obligatorio")
  .trim()
  .min(2, "El nombre debe tener al menos 2 caracteres")
  .max(60, "El nombre no puede superar los 60 caracteres");

/**
 * Schemas de autenticación
 */

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const signupSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  businessName: z.string().optional(),
  city: z.string().optional(),
});

/**
 * DTOs
 */

export type LoginDTO = z.infer<typeof loginSchema>;
export type SignupDTO = z.infer<typeof signupSchema>;