import { z } from "zod";

export const PermissionSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede superar los 100 caracteres"),
  accion: z
    .string()
    .trim()
    .min(2, "La acción debe tener al menos 2 caracteres")
    .max(50, "La acción no puede superar los 50 caracteres"),
  descripcion: z
    .string()
    .trim()
    .min(5, "La descripción debe tener al menos 5 caracteres")
    .max(255, "La descripción no puede superar los 255 caracteres"),
});

export type PermissionFormValue = z.infer<typeof PermissionSchema>;