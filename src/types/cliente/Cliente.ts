export interface Cliente {
  idCliente: number;
  nombre: string;
  apellido: string;
  cui: string | null;
  nit: string | null;
  email: string;
  telefono: string | null;
  nombreUsuario: string;
  contrasena: string;
  fecha_nacimiento: string | null;
  genero: string | null;
  tipo_cliente: string | null;
  primer_login: boolean;
  estado: boolean;
  fecha_modificacion: string;
  fecha_creacion: string;
}

export interface DataCliente {
  cliente: Cliente
  token: string
}