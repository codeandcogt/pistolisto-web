import { ModalMode } from "@/types";

export const getModalTexts = (mode: ModalMode) => {
  const texts = {
    create: {
      title: "Crear nuevo artículo",
      subtitle: "Completa el formulario para agregar un nuevo artículo al inventario.",
      buttonLabel: "Crear Artículo",
      buttonVariant: "default" as const,
    },
    edit: {
      title: "Editar artículo",
      subtitle:
        "Modifica la información del artículo y guarda los cambios realizados.",
      buttonLabel: "Guardar Cambios",
      buttonVariant: "default" as const,
    },
    delete: {
      title: "Eliminar artículo",
      subtitle:
        "¿Estás seguro de que deseas eliminar este artículo? Esta acción no se puede deshacer.",
      buttonLabel: "Eliminar Artículo",
      buttonVariant: "destructive" as const,
    },
  };

  return texts[mode];
};