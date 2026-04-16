import { z } from "zod";

const optionalTrimmedString = z.preprocess((value) => {
  if (value === null || value === undefined) return undefined;
  if (typeof value !== "string") return value;

  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
}, z.string().optional());

const customerNameSchema = z
  .string()
  .min(1, "El nombre del cliente es obligatorio")
  .trim()
  .min(2, "Ingresa un nombre válido")
  .max(100, "El nombre del cliente no puede superar los 100 caracteres");

const customerPhoneSchema = z
  .string()
  .min(1, "El teléfono de contacto es obligatorio")
  .trim()
  .min(6, "Ingresa un número de contacto válido")
  .max(20, "El teléfono de contacto no puede superar los 20 caracteres");

const checkoutItemIdSchema = z
  .string()
  .min(1, "El identificador del producto es obligatorio")
  .trim()
  .min(1, "El identificador del producto es obligatorio");

const checkoutItemQuantitySchema = z
  .number()
  .int("La cantidad debe ser un número entero")
  .min(1, "La cantidad debe ser al menos 1");

const checkoutItemPriceSchema = z
  .number()
  .min(0, "El precio no puede ser negativo");

export const checkoutItemSchema = z.object({
  id: checkoutItemIdSchema,
  quantity: checkoutItemQuantitySchema,
  price: checkoutItemPriceSchema,
});

export const checkoutSchema = z.object({
  customerName: customerNameSchema,
  customerPhone: customerPhoneSchema,
  address: optionalTrimmedString,
  notes: optionalTrimmedString,
  items: z
    .array(checkoutItemSchema)
    .min(1, "El carrito no puede estar vacío"),
});

export type CheckoutDTO = z.infer<typeof checkoutSchema>;