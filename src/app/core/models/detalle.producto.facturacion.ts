export interface DetalleFactura {
  id_catalogo: number;
  codigo: string;
  nombre: string;
  precio_sin_iva: number;
  precio_con_iva: number;
  cantidad: number;
  subtotal: number;
  descuento: number;
  id_descuento: number;
  iva: number;
  total: number;
}
