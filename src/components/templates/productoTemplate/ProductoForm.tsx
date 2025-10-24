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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductFormValue, ProductSchema } from "./ProductoSchema";
import { Producto } from "@/types";
import { useProducto } from "@/hooks/useProducto/useProducto";
import { useArticulo } from "@/hooks/useArticulo/useArticulo";
import { useProductoStore } from "@/store/producto";


interface ProductFormProps {
  mode: "create" | "edit";
  product?: Producto;
}

export function ProductForm({ mode, product }: ProductFormProps) {
  const { createProductoAsync, updateProductoAsync } = useProducto();
  const { articulos } = useArticulo();
//   const { discounts } = useDiscount();
  const { toggleModal } = useProductoStore();

  const isEditMode = mode === "edit";

  const form = useForm<ProductFormValue>({
    resolver: zodResolver(ProductSchema),
    defaultValues: isEditMode && product
      ? {
          sku: product.sku,
          costo: product.costo,
          precio: product.precio,
          unidad_medida: product.unidad_medida,
          id_articulo: product.id_articulo,
          id_descuento: product.id_descuento || undefined,
        }
      : {
          sku: "",
          costo: 0,
          precio: 0,
          unidad_medida: "",
          id_articulo: 0,
          id_descuento: undefined,
        },
  });

  const onSubmit = async (data: ProductFormValue) => {
    try {
      if (isEditMode && product) {
        // Editar producto existente
        await updateProductoAsync({
          ...data,
          id_producto: product.id_producto,
        });
      } else {
        // Crear nuevo producto
        await createProductoAsync(data);
      }
      toggleModal();
      form.reset();
    } catch (error) {
      console.error("Error al guardar producto:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* SKU */}
            <FormField
              control={form.control}
              name="sku"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SKU *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej: PROD-001"
                      {...field}
                      onChange={(e) =>
                        field.onChange(e.target.value.toUpperCase())
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    Código único del producto (se convertirá a mayúsculas)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Unidad de Medida */}
            <FormField
              control={form.control}
              name="unidad_medida"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unidad de Medida *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona unidad" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Unidad">Unidad</SelectItem>
                      <SelectItem value="Kilogramo">Kilogramo (kg)</SelectItem>
                      <SelectItem value="Gramo">Gramo (g)</SelectItem>
                      <SelectItem value="Libra">Libra (lb)</SelectItem>
                      <SelectItem value="Litro">Litro (L)</SelectItem>
                      <SelectItem value="Mililitro">Mililitro (ml)</SelectItem>
                      <SelectItem value="Metro">Metro (m)</SelectItem>
                      <SelectItem value="Centímetro">Centímetro (cm)</SelectItem>
                      <SelectItem value="Caja">Caja</SelectItem>
                      <SelectItem value="Paquete">Paquete</SelectItem>
                      <SelectItem value="Docena">Docena</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Costo */}
            <FormField
              control={form.control}
              name="costo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Costo *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min={0}
                      max={999999.99}
                      placeholder="0.00"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>Costo de adquisición</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Precio */}
            <FormField
              control={form.control}
              name="precio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio de Venta *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min={0}
                      max={999999.99}
                      placeholder="0.00"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>Precio al público</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Artículo */}
            <FormField
              control={form.control}
              name="id_articulo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Artículo *</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    defaultValue={field.value ? String(field.value) : undefined}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona un artículo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {articulos.map((article) => (
                        <SelectItem
                          key={article.idArticulo}
                          value={String(article.idArticulo)}
                        >
                          {article.nombre} - {article.color}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Descuento */}
            {/* <FormField
              control={form.control}
              name="id_descuento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descuento (Opcional)</FormLabel>
                  <Select
                    onValueChange={(value) => 
                      field.onChange(value === "none" ? undefined : Number(value))
                    }
                    defaultValue={field.value ? String(field.value) : "none"}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sin descuento" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">Sin descuento</SelectItem>
                      {discounts.map((discount) => (
                        <SelectItem
                          key={discount.idDescuento}
                          value={String(discount.idDescuento)}
                        >
                          {discount.nombre} - {discount.porcentaje}%
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Aplica un descuento al producto</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
          </div>

          {/* Cálculo de Margen */}
          {form.watch("costo") > 0 && form.watch("precio") > 0 && (
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-2">Información de Precios:</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Margen Bruto:</span>
                  <span className="ml-2 font-semibold">
                    Q{(form.watch("precio") - form.watch("costo")).toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Margen %:</span>
                  <span className="ml-2 font-semibold">
                    {(
                      ((form.watch("precio") - form.watch("costo")) /
                        form.watch("costo")) *
                      100
                    ).toFixed(2)}
                    %
                  </span>
                </div>
              </div>
            </div>
          )}
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
              : "Crear Producto"}
          </Button>
        </div>
      </form>
    </Form>
  );
}