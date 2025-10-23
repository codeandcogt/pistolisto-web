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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { usePermissionStore } from "@/store";
import { usePermission } from "@/hooks/usePermission/usePermission";
import { PermissionFormValue, PermissionSchema } from "./PermissionSchema";

interface Permission {
  id_permiso: number;
  nombre: string;
  accion: string;
  descripcion: string;
  estado: boolean;
  fecha_creacion: string;
  fecha_modificacion: string;
}

interface PermissionFormProps {
  mode: "create" | "edit";
  permission?: Permission;
}

export function PermissionForm({ mode, permission }: PermissionFormProps) {
  const { createPermissionAsync, updatePermissionAsync } = usePermission();
  const { toggleModal } = usePermissionStore();

  const isEditMode = mode === "edit";

  const form = useForm<PermissionFormValue>({
    resolver: zodResolver(PermissionSchema),
    defaultValues: isEditMode && permission
      ? {
          nombre: permission.nombre,
          accion: permission.accion,
          descripcion: permission.descripcion,
        }
      : {
          nombre: "",
          accion: "",
          descripcion: "",
        },
  });

  const onSubmit = async (data: PermissionFormValue) => {
    try {
      if (isEditMode && permission) {
        // Editar permiso existente
        await updatePermissionAsync({
          ...data,
          id_permiso: permission.id_permiso,
        });
      } else {
        // Crear nuevo permiso
        await createPermissionAsync(data);
      }
      toggleModal();
      form.reset();
    } catch (error) {
      console.error("Error al guardar permiso:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          {/* Nombre */}
          <FormField
            control={form.control}
            name="nombre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre *</FormLabel>
                <FormControl>
                  <Input placeholder="Ingresa el nombre del permiso" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Acción */}
          <FormField
            control={form.control}
            name="accion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Acción *</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Ej: crear, editar, eliminar, ver" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Descripción */}
          <FormField
            control={form.control}
            name="descripcion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe las funciones del permiso"
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
              : "Crear Permiso"}
          </Button>
        </div>
      </form>
    </Form>
  );
}