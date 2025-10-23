import { ModalMode } from "@/types";

export const getModalTexts = (mode: ModalMode) => {
  const texts = {
    create: {
      title: "Crear nueva moneda",
      subtitle: "Completa el formulario para agregar una nueva moneda al sistema.",
      buttonLabel: "Crear Moneda",
      buttonVariant: "default" as const,
    },
    edit: {
      title: "Editar moneda",
      subtitle: "Modifica la información de la moneda y guarda los cambios realizados.",
      buttonLabel: "Guardar Cambios",
      buttonVariant: "default" as const,
    },
    delete: {
      title: "Eliminar moneda",
      subtitle:
        "¿Estás seguro de que deseas eliminar esta moneda? Esta acción no se puede deshacer.",
      buttonLabel: "Eliminar Moneda",
      buttonVariant: "destructive" as const,
    },
  };

  return texts[mode];
};