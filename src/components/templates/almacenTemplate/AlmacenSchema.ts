import { z } from "zod";

export const WarehouseSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede superar los 100 caracteres"),
  codigo: z
    .string()
    .trim()
    .min(2, "El código debe tener al menos 2 caracteres")
    .max(10, "El código no puede superar los 10 caracteres")
    .toUpperCase(),
  tipo_almacen: z
    .string()
    .trim()
    .min(1, "El tipo de almacén es requerido"),
  capacidad_maxima: z
    .number()
    .min(1, "La capacidad máxima debe ser al menos 1")
    .max(1000000, "La capacidad máxima no puede superar 1,000,000"),
  descripcion: z
    .string()
    .trim()
    .min(5, "La descripción debe tener al menos 5 caracteres")
    .max(500, "La descripción no puede superar los 500 caracteres"),
  id_sucursal: z
    .number()
    .min(1, "Debes seleccionar una sucursal"),
});

export type WarehouseFormValue = z.infer<typeof WarehouseSchema>;