import { z } from "zod";

export const RolSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede superar los 50 caracteres"),
  descripcion: z
    .string()
    .trim()
    .min(5, "La descripción debe tener al menos 5 caracteres")
    .max(200, "La descripción no puede superar los 200 caracteres"),
  nivel: z
    .number()
    .min(1, "El nivel debe ser al menos 1")
    .max(10, "El nivel no puede ser mayor que 10"),
});

export type RolFormValue = z.infer<typeof RolSchema>;

export const schemaRol = RolSchema;

