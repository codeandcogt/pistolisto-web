// VehicleForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VehicleFormValue, VehicleSchema } from "./VehiculoSchema";
import { format } from "date-fns";
import { usePiloto } from "@/hooks/usePiloto/usePiloto";
import { useVehiculoStore } from "@/store/vehiculo";
import { useVehiculo } from "@/hooks/useVehiculo/useVehiculo";

interface Vehiculo {
  idVehiculo: number;
  modelo: string;
  descripcion: string;
  marca: string;
  placa: string;
  anio: number;
  tipo: string;
  capacidad: number;
  capacidadPeso: number;
  combustible: string;
  kilometraje: number;
  fechaUltimoMantenimiento: string;
  pilotoId: number;
  estado: boolean;
  fechaModificacion: string;
  fechaCreacion: string;
}

interface VehicleFormProps {
  mode: "create" | "edit";
  vehicle?: Vehiculo;
}

export function VehicleForm({ mode, vehicle }: VehicleFormProps) {
  const { createVehiculoAsync, updateVehiculoAsync } = useVehiculo();
  const { pilotos } = usePiloto();
  const { toggleModal } = useVehiculoStore();

  const isEditMode = mode === "edit";

  const form = useForm<VehicleFormValue>({
    resolver: zodResolver(VehicleSchema),
    defaultValues: isEditMode && vehicle
      ? {
          modelo: vehicle.modelo,
          marca: vehicle.marca,
          placa: vehicle.placa,
          descripcion: vehicle.descripcion,
          anio: vehicle.anio,
          tipo: vehicle.tipo,
          capacidad: vehicle.capacidad,
          capacidadPeso: vehicle.capacidadPeso,
          combustible: vehicle.combustible,
          kilometraje: vehicle.kilometraje,
          fechaUltimoMantenimiento: vehicle.fechaUltimoMantenimiento
            ? format(new Date(vehicle.fechaUltimoMantenimiento), "yyyy-MM-dd")
            : "",
          pilotoId: vehicle.pilotoId,
        }
      : {
          modelo: "",
          marca: "",
          placa: "",
          descripcion: "",
          anio: new Date().getFullYear(),
          tipo: "",
          capacidad: 1,
          capacidadPeso: 0,
          combustible: "",
          kilometraje: 0,
          fechaUltimoMantenimiento: "",
          pilotoId: 0,
        },
  });

  const onSubmit = async (data: VehicleFormValue) => {
    try {
      // Convertir fecha al formato ISO
      const fechaISO = data.fechaUltimoMantenimiento
        ? new Date(data.fechaUltimoMantenimiento + "T00:00:00").toISOString()
        : "";

      if (isEditMode && vehicle) {
        // Editar vehículo existente
        await updateVehiculoAsync({
          ...data,
          fechaUltimoMantenimiento: fechaISO,
          idVehiculo: vehicle.idVehiculo,
        });
      } else {
        // Crear nuevo vehículo
        await createVehiculoAsync({
          ...data,
          fechaUltimoMantenimiento: fechaISO,
        });
      }
      toggleModal();
      form.reset();
    } catch (error) {
      console.error("Error al guardar vehículo:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Marca */}
            <FormField
              control={form.control}
              name="marca"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marca *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Toyota" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Modelo */}
            <FormField
              control={form.control}
              name="modelo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Modelo *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Corolla" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Placa */}
            <FormField
              control={form.control}
              name="placa"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Placa *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej: P-123ABC"
                      {...field}
                      onChange={(e) =>
                        field.onChange(e.target.value.toUpperCase())
                      }
                    />
                  </FormControl>
                  <FormDescription>Se convertirá a mayúsculas</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Año */}
            <FormField
              control={form.control}
              name="anio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Año *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1900}
                      max={new Date().getFullYear() + 1}
                      placeholder={String(new Date().getFullYear())}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tipo de Vehículo */}
            <FormField
              control={form.control}
              name="tipo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Vehículo *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Sedán">Sedán</SelectItem>
                      <SelectItem value="SUV">SUV</SelectItem>
                      <SelectItem value="Pickup">Pickup</SelectItem>
                      <SelectItem value="Van">Van</SelectItem>
                      <SelectItem value="Camión">Camión</SelectItem>
                      <SelectItem value="Motocicleta">Motocicleta</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Combustible */}
            <FormField
              control={form.control}
              name="combustible"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Combustible *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona combustible" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Gasolina">Gasolina</SelectItem>
                      <SelectItem value="Diesel">Diesel</SelectItem>
                      <SelectItem value="Eléctrico">Eléctrico</SelectItem>
                      <SelectItem value="Híbrido">Híbrido</SelectItem>
                      <SelectItem value="Gas Natural">Gas Natural</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Capacidad de Personas */}
            <FormField
              control={form.control}
              name="capacidad"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Capacidad (Personas) *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={100}
                      placeholder="Ej: 5"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Capacidad de Peso */}
            <FormField
              control={form.control}
              name="capacidadPeso"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Capacidad de Peso (kg) *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      max={50000}
                      placeholder="Ej: 1000"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Kilometraje */}
            <FormField
              control={form.control}
              name="kilometraje"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kilometraje (km) *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      placeholder="Ej: 50000"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Fecha Último Mantenimiento */}
            <FormField
              control={form.control}
              name="fechaUltimoMantenimiento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Último Mantenimiento *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormDescription>
                    Fecha del último mantenimiento realizado
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Piloto Asignado */}
            <FormField
              control={form.control}
              name="pilotoId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Piloto Asignado *</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    defaultValue={field.value ? String(field.value) : undefined}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona un piloto" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {pilotos.map((pilot) => (
                        <SelectItem
                          key={pilot.idPiloto}
                          value={String(pilot.idPiloto)}
                        >
                          {pilot.nombres} {pilot.apellidos} - Lic: {pilot.numeroLicencia}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Descripción - Ocupa ancho completo */}
          <FormField
            control={form.control}
            name="descripcion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe información adicional del vehículo"
                    className="resize-none"
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Botones */}
        <div className="sticky bottom-0 bg-background pt-4 border-t flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={toggleModal}>
            Cancelar
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting
              ? "Guardando..."
              : isEditMode
              ? "Guardar Cambios"
              : "Crear Vehículo"}
          </Button>
        </div>
      </form>
    </Form>
  );
}