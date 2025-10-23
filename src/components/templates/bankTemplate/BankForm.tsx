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
import { BankFormValue, BankSchema } from "./BankSchema";
import { useBankStore } from "@/store";
import { useBank } from "@/hooks/useBank/useBank";
import { Bank } from "@/types";

interface BankFormProps {
  mode: "create" | "edit";
  bank?: Bank;
}

export function BankForm({ mode, bank }: BankFormProps) {
  const { createBankAsync, updateBankAsync } = useBank();
  const { toggleModal } = useBankStore();

  const isEditMode = mode === "edit";

  const form = useForm<BankFormValue>({
    resolver: zodResolver(BankSchema),
    defaultValues: isEditMode && bank
      ? {
          nombre: bank.nombre,
          descripcion: bank.descripcion,
          direccion: bank.direccion,
          telefono: bank.telefono,
          email: bank.email,
        }
      : {
          nombre: "",
          descripcion: "",
          direccion: "",
          telefono: "",
          email: "",
        },
  });

  const onSubmit = async (data: BankFormValue) => {
    try {
      if (isEditMode && bank) {
        // Editar banco existente
        await updateBankAsync({
          ...data,
          idBanco: bank.idBanco,
        });
      } else {
        // Crear nuevo banco
        await createBankAsync(data);
      }
      toggleModal();
      form.reset();
    } catch (error) {
      console.error("Error al guardar banco:", error);
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
                    <Input placeholder="Ingresa el nombre del banco" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="correo@banco.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Teléfono */}
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

            {/* Dirección */}
            <FormField
              control={form.control}
              name="direccion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dirección *</FormLabel>
                  <FormControl>
                    <Input placeholder="Dirección del banco" {...field} />
                  </FormControl>
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
                    placeholder="Describe información adicional del banco"
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
              : "Crear Banco"}
          </Button>
        </div>
      </form>
    </Form>
  );
}