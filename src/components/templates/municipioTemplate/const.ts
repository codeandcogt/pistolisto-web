import { ModalMode } from "@/types";

export const getModalTexts = (mode: ModalMode) => {
  const texts = {
    create: {
      title: "Crear nuevo municipio",
      subtitle: "Completa el formulario para agregar un nuevo municipio al sistema.",
      buttonLabel: "Crear Municipio",
      buttonVariant: "default" as const,
    },
    edit: {
      title: "Editar municipio",
      subtitle:
        "Modifica la información del municipio y guarda los cambios realizados.",
      buttonLabel: "Guardar Cambios",
      buttonVariant: "default" as const,
    },
    delete: {
      title: "Eliminar municipio",
      subtitle:
        "¿Estás seguro de que deseas eliminar este municipio? Esta acción no se puede deshacer.",
      buttonLabel: "Eliminar Municipio",
      buttonVariant: "destructive" as const,
    },
  };

  return texts[mode];
};