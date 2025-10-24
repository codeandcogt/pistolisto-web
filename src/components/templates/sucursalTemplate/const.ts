import { ModalMode } from "@/types";

export const getModalTexts = (mode: ModalMode) => {
  const texts = {
    create: {
      title: "Crear nueva sucursal",
      subtitle: "Completa el formulario para agregar una nueva sucursal al sistema.",
      buttonLabel: "Crear Sucursal",
      buttonVariant: "default" as const,
    },
    edit: {
      title: "Editar sucursal",
      subtitle:
        "Modifica la información de la sucursal y guarda los cambios realizados.",
      buttonLabel: "Guardar Cambios",
      buttonVariant: "default" as const,
    },
    delete: {
      title: "Eliminar sucursal",
      subtitle:
        "¿Estás seguro de que deseas eliminar esta sucursal? Esta acción no se puede deshacer.",
      buttonLabel: "Eliminar Sucursal",
      buttonVariant: "destructive" as const,
    },
  };

  return texts[mode];
};