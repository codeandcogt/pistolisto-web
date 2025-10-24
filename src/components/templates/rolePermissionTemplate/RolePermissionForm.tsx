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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  RolePermissionFormValue,
  RolePermissionSchema,
} from "./RolePermissionSchema";
import { useRole } from "@/hooks/useRole/useRole";
import { usePermission } from "@/hooks/usePermission/usePermission";
import { useRolePermission } from "@/hooks/useRolePermission/useRolePermission";
import { useRolePermisoStore } from "@/store";
import { RolPermiso } from "@/types";

interface RolePermissionFormProps {
  mode: "create" | "edit";
  rolePermission?: RolPermiso;
}

export function RolePermissionForm({ mode, rolePermission }: RolePermissionFormProps) {
  const { createRolePermissionAsync, updateRolePermissionAsync } =
    useRolePermission();
  const { roles } = useRole();
  const { permissions } = usePermission();
  const { toggleModal } = useRolePermisoStore();

  const isEditMode = mode === "edit";

  const form = useForm<RolePermissionFormValue>({
    resolver: zodResolver(RolePermissionSchema),
    defaultValues: isEditMode && rolePermission
      ? {
          id_rol: rolePermission.id_rol,
          id_permiso: rolePermission.id_permiso,
        }
      : {
          id_rol: 0,
          id_permiso: 0,
        },
  });

  const onSubmit = async (data: RolePermissionFormValue) => {
    try {
      if (isEditMode && rolePermission) {
        // Editar asignación existente
        await updateRolePermissionAsync({
          ...data,
          id_rol_permiso: rolePermission.id_rol_permiso,
        });
      } else {
        // Crear nueva asignación
        await createRolePermissionAsync(data);
      }
      toggleModal();
      form.reset();
    } catch (error) {
      console.error("Error al guardar asignación:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          {/* Rol */}
          <FormField
            control={form.control}
            name="id_rol"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rol *</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  defaultValue={field.value ? String(field.value) : undefined}
                  disabled={isEditMode}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona un rol" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id_rol} value={String(role.id_rol)}>
                        {role.nombre} - Nivel {role.nivel}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {isEditMode && (
                  <FormDescription>
                    No se puede cambiar el rol en modo edición
                  </FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Permiso */}
          <FormField
            control={form.control}
            name="id_permiso"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Permiso *</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  defaultValue={field.value ? String(field.value) : undefined}
                  disabled={isEditMode}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona un permiso" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {permissions.map((permission) => (
                      <SelectItem
                        key={permission.id_permiso}
                        value={String(permission.id_permiso)}
                      >
                        {permission.nombre} - {permission.accion}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {isEditMode && (
                  <FormDescription>
                    No se puede cambiar el permiso en modo edición
                  </FormDescription>
                )}
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
              : "Asignar Permiso"}
          </Button>
        </div>
      </form>
    </Form>
  );
}