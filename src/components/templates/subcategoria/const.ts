import { ModalMode } from "@/types";

export const getModalTexts = (mode: ModalMode) => {
  const texts = {
    create: {
      title: "Crear nueva subcategoría",
      subtitle: "Completa el formulario para agregar una nueva subcategoría al sistema.",
      buttonLabel: "Crear Subcategoría",
      buttonVariant: "default" as const,
    },
    edit: {
      title: "Editar subcategoría",
      subtitle:
        "Modifica la información de la subcategoría y guarda los cambios realizados.",
      buttonLabel: "Guardar Cambios",
      buttonVariant: "default" as const,
    },
    delete: {
      title: "Eliminar subcategoría",
      subtitle:
        "¿Estás seguro de que deseas eliminar esta subcategoría? Esta acción no se puede deshacer.",
      buttonLabel: "Eliminar Subcategoría",
      buttonVariant: "destructive" as const,
    },
  };

  return texts[mode];
};