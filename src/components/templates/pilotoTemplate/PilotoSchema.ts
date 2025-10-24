import { z } from "zod";

export const PilotSchema = z.object({
  nombres: z
    .string()
    .trim()
    .min(2, "Los nombres deben tener al menos 2 caracteres")
    .max(100, "Los nombres no pueden superar los 100 caracteres"),
  apellidos: z
    .string()
    .trim()
    .min(2, "Los apellidos deben tener al menos 2 caracteres")
    .max(100, "Los apellidos no pueden superar los 100 caracteres"),
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
  numeroLicencia: z
    .string()
    .trim()
    .min(5, "El número de licencia debe tener al menos 5 caracteres")
    .max(50, "El número de licencia no puede superar los 50 caracteres"),
  tipoLicencia: z
    .string()
    .trim()
    .min(1, "El tipo de licencia es requerido")
    .max(50, "El tipo de licencia no puede superar los 50 caracteres"),
  fechaVencimientoLicencia: z
    .string()
    .min(1, "La fecha de vencimiento es requerida"),
  administrativoId: z
    .number()
    .min(1, "Debes seleccionar un usuario administrativo"),
});

export type PilotFormValue = z.infer<typeof PilotSchema>;