// ProductSchema.ts
import { z } from "zod";

export const ProductSchema = z.object({
  sku: z
    .string()
    .trim()
    .min(3, "El SKU debe tener al menos 3 caracteres")
    .max(50, "El SKU no puede superar los 50 caracteres")
    .toUpperCase(),
  costo: z
    .number()
    .min(0, "El costo debe ser mayor o igual a 0")
    .max(999999.99, "El costo es demasiado alto"),
  precio: z
    .number()
    .min(0, "El precio debe ser mayor o igual a 0")
    .max(999999.99, "El precio es demasiado alto"),
  unidad_medida: z
    .string()
    .trim()
    .min(1, "La unidad de medida es requerida"),
  id_articulo: z
    .number()
    .min(1, "Debes seleccionar un artículo"),
  id_descuento: z
    .number()
    .optional(),
}).refine((data) => data.precio >= data.costo, {
  message: "El precio debe ser mayor o igual al costo",
  path: ["precio"],
});

export type ProductFormValue = z.infer<typeof ProductSchema>;