// components/roles/RoleForm.tsx
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
import { RolFormValue, RolSchema } from "./RoleSchema";
import { useRoleStore } from "@/store";
import { useRole } from "@/hooks/useRole/useRole";

interface Role {
  id_rol: number;
  nombre: string;
  descripcion: string;
  nivel: number;
}

interface RoleFormProps {
  mode: "create" | "edit";
  role?: Role;
}

export function RoleForm({ mode, role }: RoleFormProps) {
  const { createRoleAsync, updateRoleAsync } = useRole();
  const { toggleModal } = useRoleStore();

  const isEditMode = mode === "edit";

  const form = useForm<RolFormValue>({
    resolver: zodResolver(RolSchema),
    defaultValues: isEditMode && role
      ? {
          nombre: role.nombre,
          descripcion: role.descripcion,
          nivel: role.nivel,
        }
      : {
          nombre: "",
          descripcion: "",
          nivel: 1,
        },
  });

  const onSubmit = async (data: RolFormValue) => {
    try {
      if (isEditMode && role) {
        // Editar rol existente
        await updateRoleAsync({
          ...data,
          id_rol: role.id_rol,
        });
      } else {
        // Crear nuevo rol
        await createRoleAsync(data);
      }
      toggleModal();
      form.reset();
    } catch (error) {
      console.error("Error al guardar rol:", error);
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
                  <Input placeholder="Ingresa el nombre del rol" {...field} />
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
                    placeholder="Describe las funciones del rol"
                    className="resize-none"
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Nivel */}
          <FormField
            control={form.control}
            name="nivel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nivel *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    max={10}
                    placeholder="1-10"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
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
              : "Crear Rol"}
          </Button>
        </div>
      </form>
    </Form>
  );
}