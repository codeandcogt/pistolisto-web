import { ModalMode } from "@/types";

export const getModalTexts = (mode: ModalMode) => {
  const texts = {
    create: {
      title: "Crear nuevo piloto",
      subtitle: "Completa el formulario para agregar un nuevo piloto al sistema.",
      buttonLabel: "Crear Piloto",
      buttonVariant: "default" as const,
    },
    edit: {
      title: "Editar piloto",
      subtitle:
        "Modifica la información del piloto y guarda los cambios realizados.",
      buttonLabel: "Guardar Cambios",
      buttonVariant: "default" as const,
    },
    delete: {
      title: "Eliminar piloto",
      subtitle:
        "¿Estás seguro de que deseas eliminar este piloto? Esta acción no se puede deshacer.",
      buttonLabel: "Eliminar Piloto",
      buttonVariant: "destructive" as const,
    },
  };

  return texts[mode];
};