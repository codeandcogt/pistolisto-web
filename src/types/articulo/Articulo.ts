export interface Articulo {
  idArticulo: number
  nombre: string
  descripcion: string
  peso: number
  dimension: string
  color: string
  idAlmacen: number
  idSubCategoria: number
  imagen?: string
  estado: boolean
  fecha_modificacion: string
  fecha_creacion: string
}
