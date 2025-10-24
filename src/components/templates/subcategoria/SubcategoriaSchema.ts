import { z } from "zod";

export const SubCategorySchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede superar los 100 caracteres"),
  descripcion: z
    .string()
    .trim()
    .min(5, "La descripción debe tener al menos 5 caracteres")
    .max(255, "La descripción no puede superar los 255 caracteres"),
  idCategoria: z
    .number()
    .min(1, "Debes seleccionar una categoría"),
});

export type SubCategoryFormValue = z.infer<typeof SubCategorySchema>;