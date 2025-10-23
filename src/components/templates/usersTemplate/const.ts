import { ModalMode } from '@/store/users/Users';

export const getModalTexts = (mode: ModalMode) => {
  const texts = {
    create: {
      title: "Crear nuevo usuario",
      subtitle: "Completa el formulario para agregar un nuevo usuario al sistema.",
      buttonLabel: "Crear Usuario",
    },
    edit: {
      title: "Editar usuario",
      subtitle: "Modifica la información del usuario y guarda los cambios realizados.",
      buttonLabel: "Guardar Cambios",
    },
    delete: {
      title: "Eliminar usuario",
      subtitle: "¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.",
      buttonLabel: "Eliminar Usuario",
    },
  };

  return texts[mode];
};