// Servicio HTTP para el módulo de Categorías.
import api, { extraerMensajeError } from './axiosConfig';
import type { Categoria } from '../../types';

export const categoriasService = {
  async getCategorias(tipo?: string): Promise<Categoria[]> {
    try {
      const { data } = await api.get('/categorias', { params: tipo ? { tipo } : {} });
      if (Array.isArray(data)) return data as Categoria[];
      const obj = data as { data?: unknown; categorias?: unknown };
      if (Array.isArray(obj?.data)) return obj.data as Categoria[];
      if (Array.isArray(obj?.categorias)) return obj.categorias as Categoria[];
      return [];
    } catch (error) {
      throw new Error(extraerMensajeError(error, 'No se pudieron cargar las categorías'));
    }
  },

  async crearCategoria(datos: Partial<Categoria>): Promise<Categoria> {
    try {
      const { data } = await api.post<Categoria>('/categorias', datos);
      return data;
    } catch (error) {
      throw new Error(extraerMensajeError(error, 'No se pudo crear la categoría'));
    }
  },
};

export default categoriasService;
