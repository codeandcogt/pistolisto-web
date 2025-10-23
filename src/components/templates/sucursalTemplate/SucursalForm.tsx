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
import { Sucursal } from "@/types";
import { useSucursal } from "@/hooks/useSucursal/useSucursal";
import { useSucursalStore } from "@/store";
import { BranchFormValue, BranchSchema } from "./SucursalSchema";


interface BranchFormProps {
  mode: "create" | "edit";
  branch?: Sucursal;
}

export function BranchForm({ mode, branch }: BranchFormProps) {
  const { createSucursalAsync, updateSucursalAsync } = useSucursal();
  const { toggleModal } = useSucursalStore();

  const isEditMode = mode === "edit";

  const form = useForm<BranchFormValue>({
    resolver: zodResolver(BranchSchema),
    defaultValues: isEditMode && branch
      ? {
          nombre: branch.nombre,
          codigo: branch.codigo,
          descripcion: branch.descripcion,
          telefono: branch.telefono,
          email: branch.email,
          direccion: branch.direccion,
          hora_apertura: branch.hora_apertura,
          hora_cierre: branch.hora_cierre,
        }
      : {
          nombre: "",
          codigo: "",
          descripcion: "",
          telefono: "",
          email: "",
          direccion: "",
          hora_apertura: "08:00",
          hora_cierre: "17:00",
        },
  });

  const onSubmit = async (data: BranchFormValue) => {
    try {
      if (isEditMode && branch) {
        // Editar sucursal existente
        await updateSucursalAsync({
          ...data,
          idSucursal: branch.idSucursal,
        });
      } else {
        // Crear nueva sucursal
        await createSucursalAsync(data);
      }
      toggleModal();
      form.reset();
    } catch (error) {
      console.error("Error al guardar sucursal:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nombre */}
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Sucursal Central" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Código */}
            <FormField
              control={form.control}
              name="codigo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej: SUC-01"
                      maxLength={10}
                      {...field}
                      onChange={(e) =>
                        field.onChange(e.target.value.toUpperCase())
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    Código de la sucursal (se convertirá a mayúsculas)
                  </FormDescription>
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
                      placeholder="sucursal@empresa.com"
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

            {/* Dirección */}
            <FormField
              control={form.control}
              name="direccion"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Dirección *</FormLabel>
                  <FormControl>
                    <Input placeholder="Dirección completa de la sucursal" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Hora de Apertura */}
            <FormField
              control={form.control}
              name="hora_apertura"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hora de Apertura *</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormDescription>Hora de inicio de operaciones</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Hora de Cierre */}
            <FormField
              control={form.control}
              name="hora_cierre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hora de Cierre *</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormDescription>Hora de fin de operaciones</FormDescription>
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
                    placeholder="Describe información adicional de la sucursal"
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
              : "Crear Sucursal"}
          </Button>
        </div>
      </form>
    </Form>
  );
}