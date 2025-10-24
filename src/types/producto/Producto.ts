export interface Producto {
  id_producto: number
  sku: string
  costo: number
  precio: number
  unidad_medida: string
  id_articulo: number
  id_descuento?: number
  estado: boolean
  fecha_modificacion: string
  fecha_creacion: string
}
