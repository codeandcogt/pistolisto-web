import { ModalMode } from "@/types";

export const getModalTexts = (mode: ModalMode) => {
  const texts = {
    create: {
      title: "Crear nuevo producto",
      subtitle: "Completa el formulario para agregar un nuevo producto al catálogo.",
      buttonLabel: "Crear Producto",
      buttonVariant: "default" as const,
    },
    edit: {
      title: "Editar producto",
      subtitle:
        "Modifica la información del producto y guarda los cambios realizados.",
      buttonLabel: "Guardar Cambios",
      buttonVariant: "default" as const,
    },
    delete: {
      title: "Eliminar producto",
      subtitle:
        "¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.",
      buttonLabel: "Eliminar Producto",
      buttonVariant: "destructive" as const,
    },
  };

  return texts[mode];
};