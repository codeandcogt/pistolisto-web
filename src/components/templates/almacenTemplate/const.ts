import { ModalMode } from "@/types";

export const getModalTexts = (mode: ModalMode) => {
  const texts = {
    create: {
      title: "Crear nuevo almacén",
      subtitle: "Completa el formulario para agregar un nuevo almacén al sistema.",
      buttonLabel: "Crear Almacén",
      buttonVariant: "default" as const,
    },
    edit: {
      title: "Editar almacén",
      subtitle:
        "Modifica la información del almacén y guarda los cambios realizados.",
      buttonLabel: "Guardar Cambios",
      buttonVariant: "default" as const,
    },
    delete: {
      title: "Eliminar almacén",
      subtitle:
        "¿Estás seguro de que deseas eliminar este almacén? Esta acción no se puede deshacer.",
      buttonLabel: "Eliminar Almacén",
      buttonVariant: "destructive" as const,
    },
  };

  return texts[mode];
};