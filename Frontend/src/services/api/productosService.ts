import api, { extraerMensajeError } from './axiosConfig';

export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  precioOriginal?: number;
  imagen?: string;
  categoria: { id: string; nombre: string };
  publicador: { id: string; nombre: string; email: string };
  stock: number;
  estado: boolean;
  sku?: string;
  marca?: string;
  fechaCreacion: string;
  fechaModificacion: string;
}

export interface CrearProductoData {
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

function normalizarLista(payload: unknown): Producto[] {
  if (Array.isArray(payload)) return payload as Producto[];
  if (payload && typeof payload === 'object') {
    const obj = payload as { datos?: unknown; data?: unknown; productos?: unknown };
    if (Array.isArray(obj.datos)) return obj.datos as Producto[];
    if (Array.isArray(obj.data)) return obj.data as Producto[];
    if (Array.isArray(obj.productos)) return obj.productos as Producto[];
  }
  return [];
}

export const productosService = {
  async getProductos(filtros?: { categoria?: string; pagina?: number; limite?: number }) {
    try {
      const { data } = await api.get('/productos', { params: filtros });
      const lista = normalizarLista(data.datos || data);
      return { productos: lista, total: data.total || lista.length, pagina: data.pagina || 1 };
    } catch (error) {
      throw new Error(extraerMensajeError(error, 'No se pudieron cargar los productos'));
    }
  },

  async getProducto(id: string | number): Promise<Producto> {
    try {
      const { data } = await api.get<Producto>(`/productos/${id}`);
      return data;
    } catch (error) {
      throw new Error(extraerMensajeError(error, 'No se pudo cargar el producto'));
    }
  },

  async crearProducto(datos: CrearProductoData): Promise<Producto> {
    try {
      const { data } = await api.post<Producto>('/productos', datos);
      return data;
    } catch (error) {
      throw new Error(extraerMensajeError(error, 'No se pudo crear el producto'));
    }
  },

  async actualizarProducto(id: string | number, datos: Partial<CrearProductoData>): Promise<Producto> {
    try {
      const { data } = await api.put<Producto>(`/productos/${id}`, datos);
      return data;
    } catch (error) {
      throw new Error(extraerMensajeError(error, 'No se pudo actualizar el producto'));
    }
  },

  async eliminarProducto(id: string | number): Promise<void> {
    try {
      await api.delete(`/productos/${id}`);
    } catch (error) {
      throw new Error(extraerMensajeError(error, 'No se pudo eliminar el producto'));
    }
  },
};

export default productosService;
