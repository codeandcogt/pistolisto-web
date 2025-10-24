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
import { SubCategoryFormValue, SubCategorySchema } from "./SubcategoriaSchema";
import { SubCategoria } from "@/types";
import { useSubCategoria } from "@/hooks/useSubcategoria/useSubcategoria";
import { useCategoria } from "@/hooks/useCategoria/useCategoria";
import { useSubCategoryStore } from "@/store/subcategoria";

interface SubCategoryFormProps {
  mode: "create" | "edit";
  subCategory?: SubCategoria;
}

export function SubCategoryForm({ mode, subCategory }: SubCategoryFormProps) {
  const { createSubCategoria, updateSubCategoriaAsync } = useSubCategoria();
  const { categoria } = useCategoria();
  const { toggleModal } = useSubCategoryStore();

  const isEditMode = mode === "edit";

  const form = useForm<SubCategoryFormValue>({
    resolver: zodResolver(SubCategorySchema),
    defaultValues: isEditMode && subCategory
      ? {
          nombre: subCategory.nombre,
          descripcion: subCategory.descripcion,
          idCategoria: subCategory.idCategoria,
        }
      : {
          nombre: "",
          descripcion: "",
          idCategoria: 0,
        },
  });

  const onSubmit = async (data: SubCategoryFormValue) => {
    try {
      if (isEditMode && subCategory) {
        // Editar subcategoría existente
        await updateSubCategoriaAsync({
          ...data,
          idSubCategoria: subCategory.idSubCategoria,
        });
      } else {
        // Crear nueva subcategoría
        await createSubCategoria(data);
      }
      toggleModal();
      form.reset();
    } catch (error) {
      console.error("Error al guardar subcategoría:", error);
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
                  <Input placeholder="Ingresa el nombre de la subcategoría" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Categoría */}
          <FormField
            control={form.control}
            name="idCategoria"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoría *</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  defaultValue={field.value ? String(field.value) : undefined}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categoria.map((category) => (
                      <SelectItem
                        key={category.id_categoria}
                        value={String(category.id_categoria)}
                      >
                        {category.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                    placeholder="Describe las características de la subcategoría"
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
              : "Crear Subcategoría"}
          </Button>
        </div>
      </form>
    </Form>
  );
}