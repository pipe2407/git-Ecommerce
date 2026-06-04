// Servicio HTTP para el módulo de Notificaciones.
import api, { extraerMensajeError } from './axiosConfig';
import type { Notificacion, NotificacionFiltros, Respuesta } from '../../types';

// El backend puede devolver una lista plana o un objeto paginado { data, total }.
function normalizarLista(payload: unknown): Notificacion[] {
  if (Array.isArray(payload)) return payload as Notificacion[];
  if (payload && typeof payload === 'object') {
    const obj = payload as { data?: unknown; items?: unknown; notificaciones?: unknown };
    if (Array.isArray(obj.data)) return obj.data as Notificacion[];
    if (Array.isArray(obj.items)) return obj.items as Notificacion[];
    if (Array.isArray(obj.notificaciones)) return obj.notificaciones as Notificacion[];
  }
  return [];
}

export const notificacionesService = {
  async getNotificaciones(filtros?: NotificacionFiltros): Promise<Notificacion[]> {
    try {
      const { data } = await api.get('/notificaciones', { params: filtros });
      return normalizarLista(data);
    } catch (error) {
      throw new Error(extraerMensajeError(error, 'No se pudieron cargar las notificaciones'));
    }
  },

  async getNotificacion(id: string | number): Promise<Notificacion> {
    try {
      const { data } = await api.get<Notificacion>(`/notificaciones/${id}`);
      return data;
    } catch (error) {
      throw new Error(extraerMensajeError(error, 'No se pudo cargar la notificación'));
    }
  },

  async crearNotificacion(datos: Partial<Notificacion>): Promise<Notificacion> {
    try {
      const { data } = await api.post<Notificacion>('/notificaciones', datos);
      return data;
    } catch (error) {
      throw new Error(extraerMensajeError(error, 'No se pudo crear la notificación'));
    }
  },

  async actualizarNotificacion(
    id: string | number,
    datos: Partial<Notificacion>
  ): Promise<Notificacion> {
    try {
      const { data } = await api.put<Notificacion>(`/notificaciones/${id}`, datos);
      return data;
    } catch (error) {
      throw new Error(extraerMensajeError(error, 'No se pudo actualizar la notificación'));
    }
  },

  async eliminarNotificacion(id: string | number): Promise<void> {
    try {
      await api.delete(`/notificaciones/${id}`);
    } catch (error) {
      throw new Error(extraerMensajeError(error, 'No se pudo eliminar la notificación'));
    }
  },

  async agregarRespuesta(id: string | number, mensaje: string): Promise<Respuesta> {
    try {
      const { data } = await api.post<Respuesta>(`/notificaciones/${id}/respuestas`, { mensaje });
      return data;
    } catch (error) {
      throw new Error(extraerMensajeError(error, 'No se pudo agregar la respuesta'));
    }
  },

  async getRespuestas(id: string | number): Promise<Respuesta[]> {
    try {
      const { data } = await api.get(`/notificaciones/${id}/respuestas`);
      return Array.isArray(data) ? (data as Respuesta[]) : [];
    } catch (error) {
      throw new Error(extraerMensajeError(error, 'No se pudieron cargar las respuestas'));
    }
  },
};

export default notificacionesService;
