import { ModalMode } from "@/types";

export const getModalTexts = (mode: ModalMode) => {
  const texts = {
    create: {
      title: "Asignar permiso a rol",
      subtitle: "Selecciona un rol y un permiso para crear la asignación.",
      buttonLabel: "Asignar Permiso",
      buttonVariant: "default" as const,
    },
    edit: {
      title: "Editar asignación de permiso",
      subtitle:
        "Modifica la asignación de permiso. Nota: No se puede cambiar el rol o permiso, solo su estado.",
      buttonLabel: "Guardar Cambios",
      buttonVariant: "default" as const,
    },
    delete: {
      title: "Eliminar asignación de permiso",
      subtitle:
        "¿Estás seguro de que deseas eliminar esta asignación? El rol perderá este permiso.",
      buttonLabel: "Eliminar Asignación",
      buttonVariant: "destructive" as const,
    },
  };

  return texts[mode];
};