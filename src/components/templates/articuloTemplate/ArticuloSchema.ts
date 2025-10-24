// ArticleSchema.ts
import { z } from "zod";

export const ArticleSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede superar los 100 caracteres"),
  descripcion: z
    .string()
    .trim()
    .min(5, "La descripción debe tener al menos 5 caracteres")
    .max(500, "La descripción no puede superar los 500 caracteres"),
  peso: z
    .number()
    .min(0, "El peso debe ser mayor o igual a 0")
    .max(100000, "El peso no puede superar los 100000 kg"),
  dimension: z
    .string()
    .trim()
    .min(3, "Las dimensiones deben tener al menos 3 caracteres")
    .max(50, "Las dimensiones no pueden superar los 50 caracteres"),
  color: z
    .string()
    .trim()
    .min(2, "El color debe tener al menos 2 caracteres")
    .max(30, "El color no puede superar los 30 caracteres"),
  idAlmacen: z
    .number()
    .min(1, "Debes seleccionar un almacén"),
  idSubCategoria: z
    .number()
    .min(1, "Debes seleccionar una subcategoría"),
});

export type ArticleFormValue = z.infer<typeof ArticleSchema>;