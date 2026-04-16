import { z } from "zod";

/**
 * Normaliza strings opcionales:
 * - undefined -> undefined
 * - null -> undefined
 * - "" o espacios -> undefined
 * - texto válido -> texto trimmeado
 */
const optionalTrimmedString = z.preprocess((value) => {
  if (value === null || value === undefined) return undefined;
  if (typeof value !== "string") return value;

  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
}, z.string().optional());

/**
 * Convierte valores numéricos que suelen venir desde inputs HTML.
 * Ej:
 * "1990" -> 1990
 * 1990 -> 1990
 */
const priceSchema = z.preprocess(
  (value) => {
    if (value === null || value === undefined || value === "") return undefined;
    if (typeof value === "string") return Number(value);
    return value;
  },
  z
    .number()
    .refine((val) => !Number.isNaN(val), {
      message: "El precio debe ser un número válido",
    })
    .positive("El precio debe ser mayor a 0")
);

/**
 * Esquema de entrada para productos.
 * businessId NO se recibe desde la UI.
 * Debe resolverse siempre en backend desde la sesión/contexto.
 */
export const productInputSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(120, "El nombre no puede superar los 120 caracteres"),

  description: optionalTrimmedString,
  category: optionalTrimmedString,

  price: priceSchema,

  imageUrl: z.preprocess(
    (value) => {
      if (value === null || value === undefined) return undefined;
      if (typeof value !== "string") return value;

      const trimmed = value.trim();
      return trimmed === "" ? undefined : trimmed;
    },
    z.string().url("Debe ser una URL válida").optional()
  ),

  isActive: z.boolean().optional().default(true),
});

export type ProductInputDTO = z.infer<typeof productInputSchema>;

// Permite actualizar campos de forma individual sin requerir el payload completo
export const productUpdateSchema = productInputSchema.partial();
export type ProductUpdateDTO = z.infer<typeof productUpdateSchema>;