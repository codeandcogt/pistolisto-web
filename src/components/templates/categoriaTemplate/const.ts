import { ModalMode } from "@/types";

export const getModalTexts = (mode: ModalMode) => {
  const texts = {
    create: {
      title: "Crear nueva categoría",
      subtitle: "Completa el formulario para agregar una nueva categoría al sistema.",
      buttonLabel: "Crear Categoría",
      buttonVariant: "default" as const,
    },
    edit: {
      title: "Editar categoría",
      subtitle:
        "Modifica la información de la categoría y guarda los cambios realizados.",
      buttonLabel: "Guardar Cambios",
      buttonVariant: "default" as const,
    },
    delete: {
      title: "Eliminar categoría",
      subtitle:
        "¿Estás seguro de que deseas eliminar esta categoría? Esta acción no se puede deshacer.",
      buttonLabel: "Eliminar Categoría",
      buttonVariant: "destructive" as const,
    },
  };

  return texts[mode];
};