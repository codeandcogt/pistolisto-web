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
import { CoinFormValue, CoinSchema } from "./CoinSchema";
import { useCoinStore } from "@/store";
import { useCoin } from "@/hooks/useCoin/useCoin";
import { Coin } from "@/types";

interface CoinFormProps {
  mode: "create" | "edit";
  coin?: Coin;
}

export function CoinForm({ mode, coin }: CoinFormProps) {
  const { createCoinAsync, updateCoinAsync } = useCoin();
  const { toggleModal } = useCoinStore();

  const isEditMode = mode === "edit";

  const form = useForm<CoinFormValue>({
    resolver: zodResolver(CoinSchema),
    defaultValues: isEditMode && coin
      ? {
          nombre: coin.nombre,
          codigo: coin.codigo,
          simbolo: coin.simbolo,
          tasaCambio: coin.tasaCambio,
          descripcion: coin.descripcion,
        }
      : {
          nombre: "",
          codigo: "",
          simbolo: "",
          tasaCambio: 1,
          descripcion: "",
        },
  });

  const onSubmit = async (data: CoinFormValue) => {
    try {
      if (isEditMode && coin) {
        // Editar moneda existente
        await updateCoinAsync({
          ...data,
          idMoneda: coin.idMoneda,
        });
      } else {
        // Crear nueva moneda
        await createCoinAsync(data);
      }
      toggleModal();
      form.reset();
    } catch (error) {
      console.error("Error al guardar moneda:", error);
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
                    <Input placeholder="Ej: Dólar estadounidense" {...field} />
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
                      placeholder="Ej: USD"
                      maxLength={10}
                      {...field}
                      onChange={(e) =>
                        field.onChange(e.target.value.toUpperCase())
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    Código ISO de 3 letras (se convertirá a mayúsculas)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Símbolo */}
            <FormField
              control={form.control}
              name="simbolo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Símbolo *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: $" maxLength={5} {...field} />
                  </FormControl>
                  <FormDescription>Símbolo de la moneda</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tasa de Cambio */}
            <FormField
              control={form.control}
              name="tasaCambio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tasa de Cambio *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.0001"
                      min="0.0001"
                      max="999999.99"
                      placeholder="Ej: 7.85"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    Tasa de cambio respecto a la moneda base
                  </FormDescription>
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
                    placeholder="Describe información adicional de la moneda"
                    className="resize-none"
                    rows={3}
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
              : "Crear Moneda"}
          </Button>
        </div>
      </form>
    </Form>
  );
}