// VehicleSchema.ts
import { z } from "zod";

export const VehicleSchema = z.object({
  modelo: z
    .string()
    .trim()
    .min(2, "El modelo debe tener al menos 2 caracteres")
    .max(100, "El modelo no puede superar los 100 caracteres"),
  marca: z
    .string()
    .trim()
    .min(2, "La marca debe tener al menos 2 caracteres")
    .max(50, "La marca no puede superar los 50 caracteres"),
  placa: z
    .string()
    .trim()
    .min(5, "La placa debe tener al menos 5 caracteres")
    .max(20, "La placa no puede superar los 20 caracteres")
    .toUpperCase(),
  descripcion: z
    .string()
    .trim()
    .min(5, "La descripción debe tener al menos 5 caracteres")
    .max(255, "La descripción no puede superar los 255 caracteres"),
  anio: z
    .number()
    .min(1900, "El año debe ser mayor a 1900")
    .max(new Date().getFullYear() + 1, `El año no puede ser mayor a ${new Date().getFullYear() + 1}`),
  tipo: z
    .string()
    .trim()
    .min(1, "El tipo de vehículo es requerido"),
  capacidad: z
    .number()
    .min(1, "La capacidad debe ser al menos 1")
    .max(100, "La capacidad no puede superar las 100 personas"),
  capacidadPeso: z
    .number()
    .min(0, "La capacidad de peso debe ser mayor o igual a 0")
    .max(50000, "La capacidad de peso no puede superar los 50000 kg"),
  combustible: z
    .string()
    .trim()
    .min(1, "El tipo de combustible es requerido"),
  kilometraje: z
    .number()
    .min(0, "El kilometraje debe ser mayor o igual a 0")
    .max(9999999, "El kilometraje es demasiado alto"),
  fechaUltimoMantenimiento: z
    .string()
    .min(1, "La fecha del último mantenimiento es requerida"),
  pilotoId: z
    .number()
    .min(1, "Debes seleccionar un piloto"),
});

export type VehicleFormValue = z.infer<typeof VehicleSchema>;