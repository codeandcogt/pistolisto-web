import { ModalMode } from '@/store/users/Users';

export const getModalTexts = (mode: ModalMode) => {
  const texts = {
    create: {
      title: "Crear nuevo rol",
      subtitle: "Completa el formulario para agregar un nuevo rol al sistema.",
      buttonLabel: "Crear rol",
    },
    edit: {
      title: "Editar rol",
      subtitle: "Modifica la información del rol y guarda los cambios realizados.",
      buttonLabel: "Guardar Cambios",
    },
    delete: {
      title: "Eliminar rol",
      subtitle: "¿Estás seguro de que deseas eliminar este rol? Esta acción no se puede deshacer.",
      buttonLabel: "Eliminar rol",
    },
  };

  return texts[mode];
};