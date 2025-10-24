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
import { CategoryFormValue, CategorySchema } from "./CategoriaSchema";
import { Categoria } from "@/types";
import { useCategoria } from "@/hooks/useCategoria/useCategoria";
import { useCategoryStore } from "@/store/categoria";


interface CategoryFormProps {
  mode: "create" | "edit";
  category?: Categoria;
}

export function CategoryForm({ mode, category }: CategoryFormProps) {
  const { createCategoriaAsync, updateCategoriaAsync } = useCategoria();
  const { toggleModal } = useCategoryStore();

  const isEditMode = mode === "edit";

  const form = useForm<CategoryFormValue>({
    resolver: zodResolver(CategorySchema),
    defaultValues: isEditMode && category
      ? {
          nombre: category.nombre,
          descripcion: category.descripcion,
        }
      : {
          nombre: "",
          descripcion: "",
        },
  });

  const onSubmit = async (data: CategoryFormValue) => {
    try {
      if (isEditMode && category) {
        // Editar categoría existente
        await updateCategoriaAsync({
          ...data,
          id_categoria: category.id_categoria,
        });
      } else {
        // Crear nueva categoría
        await createCategoriaAsync(data);
      }
      toggleModal();
      form.reset();
    } catch (error) {
      console.error("Error al guardar categoría:", error);
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
                  <Input placeholder="Ingresa el nombre de la categoría" {...field} />
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
                    placeholder="Describe las características de la categoría"
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
              : "Crear Categoría"}
          </Button>
        </div>
      </form>
    </Form>
  );
}