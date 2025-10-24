// const.ts

import { ModalMode } from "@/types";

export const getModalTexts = (mode: ModalMode) => {
  const texts = {
    create: {
      title: "Crear nuevo banco",
      subtitle: "Completa el formulario para agregar un nuevo banco al sistema.",
      buttonLabel: "Crear Banco",
      buttonVariant: "default" as const,
    },
    edit: {
      title: "Editar banco",
      subtitle: "Modifica la información del banco y guarda los cambios realizados.",
      buttonLabel: "Guardar Cambios",
      buttonVariant: "default" as const,
    },
    delete: {
      title: "Eliminar banco",
      subtitle:
        "¿Estás seguro de que deseas eliminar este banco? Esta acción no se puede deshacer.",
      buttonLabel: "Eliminar Banco",
      buttonVariant: "destructive" as const,
    },
  };

  return texts[mode];
};