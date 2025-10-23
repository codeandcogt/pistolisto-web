// DepartmentForm.tsx
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
import { DepartmentFormValue, DepartmentSchema } from "./DepartamentoSchema";
import { Departamento } from "@/types";
import { useDepartamento } from "@/hooks/useDepartamento/useDepartamento";
import { useDepartamentoStore } from "@/store";

interface DepartmentFormProps {
  mode: "create" | "edit";
  department?: Departamento;
}

export function DepartmentForm({ mode, department }: DepartmentFormProps) {
  const { createDepartamentoAsync, updateDepartamentoAsync } = useDepartamento();
  const { toggleModal } = useDepartamentoStore();

  const isEditMode = mode === "edit";

  const form = useForm<DepartmentFormValue>({
    resolver: zodResolver(DepartmentSchema),
    defaultValues: isEditMode && department
      ? {
          nombre: department.nombre,
          codigo: department.codigo,
          descripcion: department.descripcion,
        }
      : {
          nombre: "",
          codigo: "",
          descripcion: "",
        },
  });

  const onSubmit = async (data: DepartmentFormValue) => {
    try {
      if (isEditMode && department) {
        // Editar departamento existente
        await updateDepartamentoAsync({
          ...data,
          id_departamento: department.id_departamento,
        });
      } else {
        // Crear nuevo departamento
        await createDepartamentoAsync(data);
      }
      toggleModal();
      form.reset();
    } catch (error) {
      console.error("Error al guardar departamento:", error);
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
                    <Input placeholder="Ej: Guatemala" {...field} />
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
                      placeholder="Ej: GT"
                      maxLength={10}
                      {...field}
                      onChange={(e) =>
                        field.onChange(e.target.value.toUpperCase())
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    Código del departamento (se convertirá a mayúsculas)
                  </FormDescription>
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
                    placeholder="Describe información adicional del departamento"
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
              : "Crear Departamento"}
          </Button>
        </div>
      </form>
    </Form>
  );
}