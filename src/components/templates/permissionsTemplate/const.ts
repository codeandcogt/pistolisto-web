import { ModalMode } from '@/store/users/Users';

export const getModalTexts = (mode: ModalMode) => {
  const texts = {
    create: {
      title: "Crear nuevo permiso",
      subtitle: "Completa el formulario para agregar un nuevo permiso al sistema.",
      buttonLabel: "Crear permiso",
    },
    edit: {
      title: "Editar permiso",
      subtitle: "Modifica la información del permiso y guarda los cambios realizados.",
      buttonLabel: "Guardar Cambios",
    },
    delete: {
      title: "Eliminar permiso",
      subtitle: "¿Estás seguro de que deseas eliminar este permiso? Esta acción no se puede deshacer.",
      buttonLabel: "Eliminar permiso",
    },
  };

  return texts[mode];
};