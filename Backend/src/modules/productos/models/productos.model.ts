export interface iCrearProducto {
  nombre: string;
  descripcion: string;
  precio: number | string;
  precioOriginal?: number | string;
  imagen?: string;
  categoria_id: string | number;
  stock: number;
  sku?: string;
  marca?: string;
}

export interface iActualizarProducto {
  nombre?: string;
  descripcion?: string;
  precio?: number | string;
  precioOriginal?: number | string;
  imagen?: string;
  categoria_id?: string | number;
  stock?: number;
  sku?: string;
  marca?: string;
  estado?: boolean;
}

export interface iProductoPublico {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  precioOriginal: number | null;
  imagen: string | null;
  categoria: { id: string; nombre: string };
  publicador: { id: string; nombre: string; email: string };
  stock: number;
  estado: boolean;
  sku: string | null;
  marca: string | null;
  fechaCreacion: string;
  fechaModificacion: string;
}
