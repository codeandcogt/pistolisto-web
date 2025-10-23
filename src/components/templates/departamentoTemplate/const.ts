import { ModalMode } from "@/types";

export const getModalTexts = (mode: ModalMode) => {
  const texts = {
    create: {
      title: "Crear nuevo departamento",
      subtitle: "Completa el formulario para agregar un nuevo departamento al sistema.",
      buttonLabel: "Crear Departamento",
      buttonVariant: "default" as const,
    },
    edit: {
      title: "Editar departamento",
      subtitle: "Modifica la información del departamento y guarda los cambios realizados.",
      buttonLabel: "Guardar Cambios",
      buttonVariant: "default" as const,
    },
    delete: {
      title: "Eliminar departamento",
      subtitle:
        "¿Estás seguro de que deseas eliminar este departamento? Esta acción no se puede deshacer.",
      buttonLabel: "Eliminar Departamento",
      buttonVariant: "destructive" as const,
    },
  };

  return texts[mode];
};