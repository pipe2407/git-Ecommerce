// Tipos globales de la aplicación

export interface Rol {
  id: string | number;
  nombre: string;
  descripcion?: string;
  estado?: boolean;
  fechaCreacion?: string;
  fechaModificacion?: string;
}

export interface Usuario {
  id: string | number;
  nombre: string;
  email: string;
  rol?: Rol | string;
  estado?: boolean;
  fechaCreacion?: string;
  fechaModificacion?: string;
}

export interface Categoria {
  id: string | number;
  nombre: string;
  descripcion?: string;
  estado?: boolean;
}

export interface Producto {
  id: string | number;
  nombre: string;
  precio: number;
  descripcion?: string;
  imagen?: string;
  stock: number;
  categoria: Categoria;
  publicador: Usuario;
  estado?: boolean;
  fechaCreacion?: string;
  fechaModificacion?: string;
}

export interface Orden {
  id: string | number;
  usuario_id: string | number;
  producto: Producto;
  cantidad: number;
  precioTotal: number;
  estado: string;
  fechaCreacion?: string;
  fechaModificacion?: string;
}

export interface Carrito {
  producto_id: string | number;
  cantidad: number;
  precio: number;
}

export interface LoginResponse {
  token?: string;
  accessToken?: string;
  access_token?: string;
  refreshToken?: string;
  usuario?: Usuario;
  user?: Usuario;
}

export interface ReporteItem {
  id?: string | number;
  nombre: string;
  total: number;
}

export interface ReporteResumen {
  totalNotificaciones: number;
  totalUsuarios: number;
  pendientes: number;
  enviadas: number;
}
