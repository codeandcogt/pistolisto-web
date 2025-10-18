export interface DataSesion {
  admin: Admin
  token: string
}

export interface Admin {
  id_administrativo: number
  nombre: string
  apellido: string
  cui: string
  nit: string
  id_rol: number
  email: string
  telefono: string
  contrasenia: string
  nombre_usuario: string
  id_sucursal: number
  fecha_nacimiento: string
  genero: string
  primer_login: boolean
  estado: boolean
  fecha_creacion: string
  fecha_modificacion: string
}
