// Servicio HTTP para el módulo de Reportes.
import api, { extraerMensajeError } from './axiosConfig';
import type { ResumenReporte, ReporteItem } from '../../types';

function normalizarItems(payload: unknown): ReporteItem[] {
  if (Array.isArray(payload)) return payload as ReporteItem[];
  if (payload && typeof payload === 'object') {
    const obj = payload as { data?: unknown };
    if (Array.isArray(obj.data)) return obj.data as ReporteItem[];
  }
  return [];
}

export const reportesService = {
  async getResumen(): Promise<ResumenReporte> {
    try {
      const { data } = await api.get<ResumenReporte>('/reportes/resumen');
      return data;
    } catch (error) {
      throw new Error(extraerMensajeError(error, 'No se pudo cargar el resumen'));
    }
  },

  async getPorTipo(): Promise<ReporteItem[]> {
    try {
      const { data } = await api.get('/reportes/por-tipo');
      return normalizarItems(data);
    } catch (error) {
      throw new Error(extraerMensajeError(error, 'No se pudo cargar el reporte por tipo'));
    }
  },

  async getPorEstado(): Promise<ReporteItem[]> {
    try {
      const { data } = await api.get('/reportes/por-estado');
      return normalizarItems(data);
    } catch (error) {
      throw new Error(extraerMensajeError(error, 'No se pudo cargar el reporte por estado'));
    }
  },
};

export default reportesService;
