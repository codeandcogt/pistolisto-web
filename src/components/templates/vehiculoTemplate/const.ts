import { ModalMode } from "@/types";

export const getModalTexts = (mode: ModalMode) => {
  const texts = {
    create: {
      title: "Crear nuevo vehículo",
      subtitle: "Completa el formulario para agregar un nuevo vehículo a la flota.",
      buttonLabel: "Crear Vehículo",
      buttonVariant: "default" as const,
    },
    edit: {
      title: "Editar vehículo",
      subtitle:
        "Modifica la información del vehículo y guarda los cambios realizados.",
      buttonLabel: "Guardar Cambios",
      buttonVariant: "default" as const,
    },
    delete: {
      title: "Eliminar vehículo",
      subtitle:
        "¿Estás seguro de que deseas eliminar este vehículo? Esta acción no se puede deshacer.",
      buttonLabel: "Eliminar Vehículo",
      buttonVariant: "destructive" as const,
    },
  };

  return texts[mode];
};