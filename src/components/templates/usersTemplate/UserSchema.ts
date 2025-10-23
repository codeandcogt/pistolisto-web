import * as z from "zod";

export const userSchema = z.object({
  nombre: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres"),
  apellido: z.string().trim().min(2, "El apellido debe tener al menos 2 caracteres"),
  cui: z.string().trim().length(13, "El CUI debe tener exactamente 13 dígitos"),
  nit: z.string().trim().min(1, "El NIT es requerido"),
  id_rol: z.number().min(1, "Selecciona un rol"),
  email: z.string().trim().email("Email inválido"),
  telefono: z.string().trim().min(8, "El teléfono debe tener al menos 8 dígitos"),
  contrasenia: z
    .string()
    .trim()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "La contraseña debe contener mayúsculas, minúsculas, números y caracteres especiales"
    )
    .optional()
    .or(z.literal("")),
  nombre_usuario: z
    .string()
    .trim()
    .min(3, "El nombre de usuario debe tener al menos 3 caracteres"),
  id_sucursal: z.number().min(1, "Selecciona una sucursal"),
  fecha_nacimiento: z.string().min(1, "La fecha de nacimiento es requerida"),
  genero: z
  .enum(["M", "F", "Otro"])
  .refine((val) => ["M", "F", "Otro"].includes(val), {
    message: "Selecciona un género válido",
  }),
});

// Para crear usuario (contraseña obligatoria)
export const createUserSchema = userSchema.required({
  contrasenia: true,
});

// Para editar usuario (contraseña opcional)
export const editUserSchema = userSchema;

export type UserFormValues = z.infer<typeof userSchema>;