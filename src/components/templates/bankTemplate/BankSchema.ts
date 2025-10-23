import { z } from "zod";

export const BankSchema = z.object({
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
  direccion: z
    .string()
    .trim()
    .min(5, "La dirección debe tener al menos 5 caracteres")
    .max(200, "La dirección no puede superar los 200 caracteres"),
  telefono: z
    .string()
    .trim()
    .min(8, "El teléfono debe tener al menos 8 dígitos")
    .max(15, "El teléfono no puede superar los 15 dígitos"),
  email: z
    .string()
    .trim()
    .email("Email inválido")
    .max(100, "El email no puede superar los 100 caracteres"),
});

export type BankFormValue = z.infer<typeof BankSchema>;