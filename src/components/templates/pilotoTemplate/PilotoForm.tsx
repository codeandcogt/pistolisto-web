// PilotForm.tsx
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PilotFormValue, PilotSchema } from "./PilotoSchema";
import { useUser } from "@/hooks/useUser/useUser";
import { format } from "date-fns";
import { usePiloto } from "@/hooks/usePiloto/usePiloto";
import { usePilotoStore } from "@/store/piloto";
import { Piloto } from "@/types";

interface PilotFormProps {
  mode: "create" | "edit";
  pilot?: Piloto;
}

export function PilotForm({ mode, pilot }: PilotFormProps) {
  const { createPilotosAsync, updatePilotosAsync } = usePiloto();
  const { users } = useUser();
  const { toggleModal } = usePilotoStore();

  const isEditMode = mode === "edit";

  const form = useForm<PilotFormValue>({
    resolver: zodResolver(PilotSchema),
    defaultValues: isEditMode && pilot
      ? {
          nombres: pilot.nombres,
          apellidos: pilot.apellidos,
          telefono: pilot.telefono,
          email: pilot.email,
          numeroLicencia: pilot.numeroLicencia,
          tipoLicencia: pilot.tipoLicencia,
          fechaVencimientoLicencia: pilot.fechaVencimientoLicencia
            ? format(new Date(pilot.fechaVencimientoLicencia), "yyyy-MM-dd")
            : "",
          administrativoId: pilot.administrativoId,
        }
      : {
          nombres: "",
          apellidos: "",
          telefono: "",
          email: "",
          numeroLicencia: "",
          tipoLicencia: "",
          fechaVencimientoLicencia: "",
          administrativoId: 0,
        },
  });

  const onSubmit = async (data: PilotFormValue) => {
    try {
      // Convertir fecha al formato ISO
      const fechaISO = data.fechaVencimientoLicencia
        ? new Date(data.fechaVencimientoLicencia + "T00:00:00").toISOString()
        : "";

      if (isEditMode && pilot) {
        // Editar piloto existente
        await updatePilotosAsync({
          ...data,
          fechaVencimientoLicencia: fechaISO,
          idPiloto: pilot.idPiloto,
        });
      } else {
        // Crear nuevo piloto
        await createPilotosAsync({
          ...data,
          fechaVencimientoLicencia: fechaISO,
        });
      }
      toggleModal();
      form.reset();
    } catch (error) {
      console.error("Error al guardar piloto:", error);
    }
  };

  // Filtrar usuarios con rol de piloto (id_rol = 5)
  const pilotUsers = users.filter((user) => user.id_rol === 5);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nombres */}
            <FormField
              control={form.control}
              name="nombres"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombres *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ingresa los nombres" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Apellidos */}
            <FormField
              control={form.control}
              name="apellidos"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Apellidos *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ingresa los apellidos" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="correo@ejemplo.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Teléfono */}
            <FormField
              control={form.control}
              name="telefono"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono *</FormLabel>
                  <FormControl>
                    <Input placeholder="12345678" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Número de Licencia */}
            <FormField
              control={form.control}
              name="numeroLicencia"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de Licencia *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: LIC-12345" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tipo de Licencia */}
            <FormField
              control={form.control}
              name="tipoLicencia"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Licencia *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona tipo de licencia" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Comercial">Comercial</SelectItem>
                      <SelectItem value="Privada">Privada</SelectItem>
                      <SelectItem value="ATP">ATP (Airline Transport Pilot)</SelectItem>
                      <SelectItem value="CPL">CPL (Commercial Pilot License)</SelectItem>
                      <SelectItem value="PPL">PPL (Private Pilot License)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Fecha de Vencimiento */}
            <FormField
              control={form.control}
              name="fechaVencimientoLicencia"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de Vencimiento *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormDescription>
                    Fecha en que vence la licencia del piloto
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Usuario Administrativo */}
            <FormField
              control={form.control}
              name="administrativoId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usuario Administrativo *</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    defaultValue={field.value ? String(field.value) : undefined}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona un usuario" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {pilotUsers.length > 0 ? (
                        pilotUsers.map((user) => (
                          <SelectItem
                            key={user.id_administrativo}
                            value={String(user.id_administrativo)}
                          >
                            {user.nombre} {user.apellido} - {user.nombre_usuario}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="0" disabled>
                          No hay usuarios con rol de piloto
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Solo se muestran usuarios con rol de piloto
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
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
              : "Crear Piloto"}
          </Button>
        </div>
      </form>
    </Form>
  );
}