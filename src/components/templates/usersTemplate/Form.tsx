// components/users/UserForm.tsx
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User } from "@/types";
import { useUserStore } from "@/store/users/Users";
import { createUserSchema, editUserSchema, UserFormValues } from "./UserSchema";
import { format } from "date-fns";
import { useUser } from "@/hooks/useUser/useUser";

interface UserFormProps {
  mode: "create" | "edit";
  user?: User;
}

export function UserForm({ mode, user }: UserFormProps) {
  const { createUserAsync, updateUserAsync } = useUser();
  const { toggleModal } = useUserStore();

  const isEditMode = mode === "edit";

  const form = useForm<UserFormValues>({
    resolver: zodResolver(isEditMode ? editUserSchema : createUserSchema),
    defaultValues:
      isEditMode && user
        ? {
            nombre: user.nombre,
            apellido: user.apellido,
            cui: user.cui,
            nit: user.nit || "",
            id_rol: user.id_rol || 1,
            email: user.email,
            telefono: user.telefono,
            contrasenia: "",
            nombre_usuario: user.nombre_usuario,
            id_sucursal: user.id_sucursal || 2,
            fecha_nacimiento: user.fecha_nacimiento
              ? format(new Date(user.fecha_nacimiento), "yyyy-MM-dd")
              : "",
            genero: user.genero as "M" | "F" | "Otro",
          }
        : {
            nombre: "",
            apellido: "",
            cui: "",
            nit: "",
            id_rol: 1,
            email: "",
            telefono: "",
            contrasenia: "",
            nombre_usuario: "",
            id_sucursal: 2,
            fecha_nacimiento: "",
            genero: "M",
          },
  });

  const onSubmit = async (data: UserFormValues) => {
    try {
      const fechaISO = data.fecha_nacimiento
        ? new Date(data.fecha_nacimiento + "T00:00:00").toISOString()
        : "";

      if (isEditMode && user) {
        if (!data.contrasenia || data.contrasenia === "") {
          const {...dataWithoutPassword } = data;
          await updateUserAsync({
            ...dataWithoutPassword,
            fecha_nacimiento: fechaISO,
            id_administrativo: user.id_administrativo,
          });
        } else {
          await updateUserAsync({
            ...data,
            fecha_nacimiento: fechaISO,
            id_administrativo: user.id_administrativo,
          });
        }
      } else {
        if (!data.contrasenia) {
          throw new Error("La contraseña es requerida");
        }

        await createUserAsync({
          nombre: data.nombre,
          apellido: data.apellido,
          cui: data.cui,
          nit: data.nit,
          id_rol: data.id_rol,
          email: data.email,
          telefono: data.telefono,
          contrasenia: data.contrasenia,
          nombre_usuario: data.nombre_usuario,
          id_sucursal: data.id_sucursal,
          fecha_nacimiento: fechaISO,
          genero: data.genero,
        });
      }
      toggleModal();
      form.reset();
    } catch (error) {
      console.error("Error al guardar usuario:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ingresa el nombre" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="apellido"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Apellido *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ingresa el apellido" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            <FormField
              control={form.control}
              name="nombre_usuario"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usuario *</FormLabel>
                  <FormControl>
                    <Input placeholder="nombre_usuario" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contrasenia"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Contraseña {!isEditMode && "*"}
                    {isEditMode && (
                      <span className="text-xs text-muted-foreground ml-1">
                        (opcional)
                      </span>
                    )}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder={
                        isEditMode ? "Nueva contraseña" : "Contraseña"
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            <FormField
              control={form.control}
              name="cui"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CUI *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="2996185950613"
                      maxLength={13}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NIT *</FormLabel>
                  <FormControl>
                    <Input placeholder="1234567-8" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="genero"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Género *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona un género" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="M">Masculino</SelectItem>
                      <SelectItem value="F">Femenino</SelectItem>
                      <SelectItem value="Otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Fecha de Nacimiento */}
            <FormField
              control={form.control}
              name="fecha_nacimiento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de Nacimiento *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="id_rol"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rol *</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    defaultValue={String(field.value)}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona un rol" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">Administrador</SelectItem>
                      <SelectItem value="2">Supervisor</SelectItem>
                      <SelectItem value="3">Evaluador</SelectItem>
                      <SelectItem value="4">Logistica</SelectItem>
                      <SelectItem value="5">Piloto</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="id_sucursal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sucursal *</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    defaultValue={String(field.value)}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona una sucursal" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="2">Sucursal Central</SelectItem>
                      <SelectItem value="3">Sucursal Norte</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="sticky bottom-0 bg-background pt-4 border-t flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={toggleModal}>
            Cancelar
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting
              ? "Guardando..."
              : isEditMode
                ? "Guardar Cambios"
                : "Crear Usuario"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
