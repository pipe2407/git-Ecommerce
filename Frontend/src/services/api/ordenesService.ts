import api, { extraerMensajeError } from './axiosConfig';

export interface Orden {
  id: string;
  producto: { id: string; nombre: string; precio: number; imagen: string | null };
  comprador: { id: string; nombre: string; email: string };
  cantidad: number;
  precioTotal: number;
  estado: string;
  fechaCreacion: string;
  fechaModificacion: string;
}

export interface CrearOrdenData {
  producto_id: string | number;
  cantidad: number;
  nombreComprador?: string;
  emailComprador?: string;
  direccion?: string;
  ciudad?: string;
  departamento?: string;
  codigoPostal?: string;
  telefonoComprador?: string;
  metodoPago?: string;
  numeroTarjeta?: string;
  nombreTitular?: string;
  fechaVencimiento?: string;
}

export const ordenesService = {
  async getTodasLasOrdenes(): Promise<Orden[]> {
    try {
      const { data } = await api.get('/ordenes/admin/todas');
      if (Array.isArray(data)) return data as Orden[];
      const obj = data as { datos?: unknown; data?: unknown };
      if (Array.isArray(obj.datos)) return obj.datos as Orden[];
      if (Array.isArray(obj.data)) return obj.data as Orden[];
      return [];
    } catch (error) {
      throw new Error(extraerMensajeError(error, 'No se pudieron cargar las órdenes'));
    }
  },

  async getMisOrdenes(): Promise<Orden[]> {
    try {
      const { data } = await api.get('/ordenes');
      if (Array.isArray(data)) return data as Orden[];
      const obj = data as { datos?: unknown; data?: unknown };
      if (Array.isArray(obj.datos)) return obj.datos as Orden[];
      if (Array.isArray(obj.data)) return obj.data as Orden[];
      return [];
    } catch (error) {
      throw new Error(extraerMensajeError(error, 'No se pudieron cargar las órdenes'));
    }
  },

  async getOrden(id: string | number): Promise<Orden> {
    try {
      const { data } = await api.get<Orden>(`/ordenes/${id}`);
      return data;
    } catch (error) {
      throw new Error(extraerMensajeError(error, 'No se pudo cargar la orden'));
    }
  },

  async crearOrden(datos: CrearOrdenData): Promise<Orden> {
    try {
      const { data } = await api.post<Orden>('/ordenes', datos);
      return data;
    } catch (error) {
      throw new Error(extraerMensajeError(error, 'No se pudo crear la orden'));
    }
  },
};

export default ordenesService;
