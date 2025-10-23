export interface Role {
  id_rol: number
  nombre: string
  descripcion: string
  nivel: number
  estado?: boolean
  fecha_creacion?: string
  fecha_modificacion?: string
}