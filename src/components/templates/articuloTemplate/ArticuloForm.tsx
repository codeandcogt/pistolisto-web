"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, ChangeEvent } from "react";
import Image from "next/image";
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
import { X, ImageIcon } from "lucide-react";
import { uploadImage } from "@/services/s3/s3";

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

  // Estados para la imagen
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(article?.imagen || "");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageError, setImageError] = useState<string>("");

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
            imagen: article.imagen || "",
          }
        : {
            nombre: "",
            descripcion: "",
            peso: 0,
            dimension: "",
            color: "",
            idAlmacen: 0,
            idSubCategoria: 0,
            imagen: "",
          },
  });

  // Manejar cambio de archivo
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageError("");
    if (file) {
      // Validar tipo de archivo
      const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      if (!validTypes.includes(file.type)) {

        setImageError("Solo se permiten imágenes (JPEG, PNG, GIF, WEBP)");
        return;
      }

      // Validar tamaño (máximo 5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        setImageError("La imagen es muy grande. Máximo 5MB");
        return;
      }

      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Eliminar imagen seleccionada
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(isEditMode && article?.imagen ? article.imagen : "");
    setImageError("");
  };

  const onSubmit = async (data: ArticleFormValue) => {
    try {
      let imageUrl = data.imagen || "";

      // Si hay una nueva imagen, subirla a S3
      if (imageFile) {
        setUploadingImage(true);
        try {

          const result = await uploadImage(imageFile, "articulos");
          

          imageUrl = result.url;
        } catch (error) {

          setImageError("Error al subir la imagen");
          console.error("Error al subir imagen:", error);
          setUploadingImage(false);
          return;
        }
        setUploadingImage(false);
      }

      // Guardar artículo con la URL de la imagen
      const articleData = {
        ...data,
        imagen: imageUrl,
      };

      if (isEditMode && article) {
        await updateArticuloAsync({
          ...articleData,
          idArticulo: article.idArticulo,
        });
      } else {
        await createArticuloAsync(articleData);
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
          {/* Sección de Imagen */}
          <div className="border rounded-lg p-4 bg-muted/50">
            <FormLabel className="text-base">Imagen del Artículo</FormLabel>
            <FormDescription className="mb-3">
              Sube una imagen del producto (máximo 5MB)
            </FormDescription>

            <div className="flex flex-col md:flex-row gap-4 items-start">
              {/* Preview de la imagen */}
              <div className="flex-shrink-0">
                {imagePreview ? (
                  <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-border">
                    <Image
                      src={imagePreview}
                      alt="Preview del artículo"
                      fill
                      className="object-cover"
                      sizes="128px"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90 z-10"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-lg border-2 border-dashed border-border flex items-center justify-center bg-muted">
                    <ImageIcon className="w-12 h-12 text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Input de archivo */}
              <div className="flex-1 space-y-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                  disabled={uploadingImage}
                />
                {imageError && (
                  <p className="text-sm text-destructive">{imageError}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Formatos: JPG, PNG, GIF, WEBP
                </p>
              </div>
            </div>
          </div>

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
          <Button 
            type="submit" 
            disabled={form.formState.isSubmitting || uploadingImage}
          >
            {uploadingImage
              ? "Subiendo imagen..."
              : form.formState.isSubmitting
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