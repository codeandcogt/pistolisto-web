// MunicipalityForm.tsx
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MunicipalityFormValue, MunicipalitySchema } from "./MunicipioSchema";
import { Municipio } from "@/types";
import { useDepartamento } from "@/hooks/useDepartamento/useDepartamento";
import { useMunicipioStore } from "@/store";
import { useMunicipalidad } from "@/hooks/useMunicipio/useMunicipio";

interface MunicipalityFormProps {
  mode: "create" | "edit";
  municipality?: Municipio;
}

export function MunicipalityForm({ mode, municipality }: MunicipalityFormProps) {
  const { createMunicipioAsync, updateMunicipioAsync } = useMunicipalidad();
  const { departamentos } = useDepartamento();
  const { toggleModal } = useMunicipioStore();

  const isEditMode = mode === "edit";

  const form = useForm<MunicipalityFormValue>({
    resolver: zodResolver(MunicipalitySchema),
    defaultValues: isEditMode && municipality
      ? {
          nombre: municipality.nombre,
          codigo: municipality.codigo,
          descripcion: municipality.descripcion,
          idDepartamento: municipality.idDepartamento,
        }
      : {
          nombre: "",
          codigo: "",
          descripcion: "",
          idDepartamento: 0,
        },
  });

  const onSubmit = async (data: MunicipalityFormValue) => {
    try {
      if (isEditMode && municipality) {
        // Editar municipio existente
        await updateMunicipioAsync({
          ...data,
          idMunicipio: municipality.idMunicipio,
        });
      } else {
        // Crear nuevo municipio
        await createMunicipioAsync(data);
      }
      toggleModal();
      form.reset();
    } catch (error) {
      console.error("Error al guardar municipio:", error);
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
                    <Input placeholder="Ej: Mixco" {...field} />
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
                      placeholder="Ej: MX"
                      maxLength={10}
                      {...field}
                      onChange={(e) =>
                        field.onChange(e.target.value.toUpperCase())
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Departamento */}
            <FormField
              control={form.control}
              name="idDepartamento"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Departamento *</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    defaultValue={field.value ? String(field.value) : undefined}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona un departamento" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {departamentos.map((dept) => (
                        <SelectItem
                          key={dept.id_departamento}
                          value={String(dept.id_departamento)}
                        >
                          {dept.nombre} ({dept.codigo})
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
                    placeholder="Describe información adicional del municipio"
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
              : "Crear Municipio"}
          </Button>
        </div>
      </form>
    </Form>
  );
}