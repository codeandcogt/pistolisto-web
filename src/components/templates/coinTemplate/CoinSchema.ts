import { z } from "zod";

export const CoinSchema = z.object({
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
  simbolo: z
    .string()
    .trim()
    .min(1, "El símbolo es requerido")
    .max(5, "El símbolo no puede superar los 5 caracteres"),
  tasaCambio: z
    .number()
    .positive("La tasa de cambio debe ser mayor a 0")
    .min(0.0001, "La tasa de cambio es demasiado baja")
    .max(999999.99, "La tasa de cambio es demasiado alta"),
  descripcion: z
    .string()
    .trim()
    .min(5, "La descripción debe tener al menos 5 caracteres")
    .max(255, "La descripción no puede superar los 255 caracteres"),
});

export type CoinFormValue = z.infer<typeof CoinSchema>;