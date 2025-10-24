import { z } from "zod";

export const RolePermissionSchema = z.object({
  id_rol: z.number().min(1, "Debes seleccionar un rol"),
  id_permiso: z.number().min(1, "Debes seleccionar un permiso"),
});

export type RolePermissionFormValue = z.infer<typeof RolePermissionSchema>;