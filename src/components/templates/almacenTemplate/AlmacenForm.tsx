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
import { Almacen } from "@/types";
import { useAlmacen } from "@/hooks/useAlmacen/useAlmacen";
import { useSucursal } from "@/hooks/useSucursal/useSucursal";
import { useWarehouseStore } from "@/store/almacen/useAlmacenStore";
import { WarehouseFormValue, WarehouseSchema } from "./AlmacenSchema";

interface WarehouseFormProps {
  mode: "create" | "edit";
  warehouse?: Almacen;
}

export function WarehouseForm({ mode, warehouse }: WarehouseFormProps) {
  const { createAlmacenAsync, updateAlmacenAsync } = useAlmacen();
  const { sucursales } = useSucursal();
  const { toggleModal } = useWarehouseStore();

  const isEditMode = mode === "edit";

  const form = useForm<WarehouseFormValue>({
    resolver: zodResolver(WarehouseSchema),
    defaultValues: isEditMode && warehouse
      ? {
          nombre: warehouse.nombre,
          codigo: warehouse.codigo,
          tipo_almacen: warehouse.tipo_almacen,
          capacidad_maxima: warehouse.capacidad_maxima,
          descripcion: warehouse.descripcion,
          id_sucursal: warehouse.id_sucursal,
        }
      : {
          nombre: "",
          codigo: "",
          tipo_almacen: "",
          capacidad_maxima: 100,
          descripcion: "",
          id_sucursal: 0,
        },
  });

  const onSubmit = async (data: WarehouseFormValue) => {
    try {
      if (isEditMode && warehouse) {
        // Editar almacén existente
        await updateAlmacenAsync({
          ...data,
          id_almacen: warehouse.id_almacen,
        });
      } else {
        // Crear nuevo almacén
        await createAlmacenAsync(data);
      }
      toggleModal();
      form.reset();
    } catch (error) {
      console.error("Error al guardar almacén:", error);
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
                    <Input placeholder="Ingresa el nombre del almacén" {...field} />
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
                      placeholder="Ej: ALM-01"
                      maxLength={10}
                      {...field}
                      onChange={(e) =>
                        field.onChange(e.target.value.toUpperCase())
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    Código del almacén (se convertirá a mayúsculas)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tipo de Almacén */}
            <FormField
              control={form.control}
              name="tipo_almacen"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Almacén *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="General">General</SelectItem>
                      <SelectItem value="Refrigerado">Refrigerado</SelectItem>
                      <SelectItem value="Materias Primas">Materias Primas</SelectItem>
                      <SelectItem value="Productos Terminados">Productos Terminados</SelectItem>
                      <SelectItem value="Cuarentena">Cuarentena</SelectItem>
                      <SelectItem value="Devoluciones">Devoluciones</SelectItem>
                      <SelectItem value="Tránsito">Tránsito</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Capacidad Máxima */}
            <FormField
              control={form.control}
              name="capacidad_maxima"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Capacidad Máxima *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={1000000}
                      placeholder="Ej: 1000"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    Capacidad en unidades de productos
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Sucursal */}
            <FormField
              control={form.control}
              name="id_sucursal"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Sucursal *</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    defaultValue={field.value ? String(field.value) : undefined}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona una sucursal" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sucursales.map((branch) => (
                        <SelectItem
                          key={branch.idSucursal}
                          value={String(branch.idSucursal)}
                        >
                          {branch.nombre} ({branch.codigo})
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
                    placeholder="Describe las características del almacén"
                    className="resize-none"
                    rows={4}
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
              : "Crear Almacén"}
          </Button>
        </div>
      </form>
    </Form>
  );
}