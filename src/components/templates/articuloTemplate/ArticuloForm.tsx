// ArticleForm.tsx
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
import { ArticleFormValue, ArticleSchema } from "./ArticuloSchema";
import { useArticulo } from "@/hooks/useArticulo/useArticulo";
import { useArticuloStore } from "@/store/articulo";
import { Articulo } from "@/types";
import { useAlmacen } from "@/hooks/useAlmacen/useAlmacen";
import { useSubCategoria } from "@/hooks/useSubcategoria/useSubcategoria";

interface ArticleFormProps {
  mode: "create" | "edit";
  article?: Articulo;
}

export function ArticleForm({ mode, article }: ArticleFormProps) {
  const { createArticuloAsync, updateArticuloAsync } = useArticulo();
    const { almacenes } = useAlmacen();
    const { subcategories } = useSubCategoria();
  const { toggleModal } = useArticuloStore();

  const isEditMode = mode === "edit";

  const form = useForm<ArticleFormValue>({
    resolver: zodResolver(ArticleSchema),
    defaultValues:
      isEditMode && article
        ? {
            nombre: article.nombre,
            descripcion: article.descripcion,
            peso: article.peso,
            dimension: article.dimension,
            color: article.color,
            idAlmacen: article.idAlmacen,
            idSubCategoria: article.idSubCategoria,
          }
        : {
            nombre: "",
            descripcion: "",
            peso: 0,
            dimension: "",
            color: "",
            idAlmacen: 0,
            idSubCategoria: 0,
          },
  });

  const onSubmit = async (data: ArticleFormValue) => {
    try {
      if (isEditMode && article) {
        // Editar artículo existente
        await updateArticuloAsync({
          ...data,
          idArticulo: article.idArticulo,
        });
      } else {
        // Crear nuevo artículo
        await createArticuloAsync(data);
      }
      toggleModal();
      form.reset();
    } catch (error) {
      console.error("Error al guardar artículo:", error);
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
                    <Input
                      placeholder="Ingresa el nombre del artículo"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Color */}
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Rojo, Azul, Negro" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Peso */}
            <FormField
              control={form.control}
              name="peso"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Peso (kg) *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min={0}
                      max={100000}
                      placeholder="Ej: 5.5"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>Peso en kilogramos</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Dimensión */}
            <FormField
              control={form.control}
              name="dimension"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dimensiones *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: 50x30x20 cm" {...field} />
                  </FormControl>
                  <FormDescription>
                    Formato: largo x ancho x alto
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Almacén */}
            <FormField
              control={form.control}
              name="idAlmacen"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Almacén *</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    defaultValue={field.value ? String(field.value) : undefined}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona un almacén" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {almacenes.map((warehouse) => (
                        <SelectItem
                          key={warehouse.id_almacen}
                          value={String(warehouse.id_almacen)}
                        >
                          {warehouse.nombre} - {warehouse.tipo_almacen}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Subcategoría */}
            <FormField
              control={form.control}
              name="idSubCategoria"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subcategoría *</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    defaultValue={field.value ? String(field.value) : undefined}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona una subcategoría" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {subcategories.map((subCategory) => (
                        <SelectItem
                          key={subCategory.idSubCategoria}
                          value={String(subCategory.idSubCategoria)}
                        >
                          {subCategory.nombre}
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
                    placeholder="Describe las características del artículo"
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
                : "Crear Artículo"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
