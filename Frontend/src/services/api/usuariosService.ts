// Servicio HTTP para el módulo de Usuarios.
import api, { extraerMensajeError } from './axiosConfig';
import type { Usuario } from '../../types';

function normalizarLista(payload: unknown): Usuario[] {
  if (Array.isArray(payload)) return payload as Usuario[];
  if (payload && typeof payload === 'object') {
    const obj = payload as { data?: unknown; usuarios?: unknown };
    if (Array.isArray(obj.data)) return obj.data as Usuario[];
    if (Array.isArray(obj.usuarios)) return obj.usuarios as Usuario[];
  }
  return [];
}

export const usuariosService = {
  async getUsuarios(): Promise<Usuario[]> {
    try {
      const { data } = await api.get('/usuarios');
      return normalizarLista(data);
    } catch (error) {
      throw new Error(extraerMensajeError(error, 'No se pudieron cargar los usuarios'));
    }
  },

  async getUsuario(id: string | number): Promise<Usuario> {
    try {
      const { data } = await api.get<Usuario>(`/usuarios/${id}`);
      return data;
    } catch (error) {
      throw new Error(extraerMensajeError(error, 'No se pudo cargar el usuario'));
    }
  },

  async crearUsuario(datos: Partial<Usuario> & { password?: string }): Promise<Usuario> {
    try {
      const { data } = await api.post<Usuario>('/usuarios', datos);
      return data;
    } catch (error) {
      throw new Error(extraerMensajeError(error, 'No se pudo crear el usuario'));
    }
  },

  async actualizarUsuario(id: string | number, datos: Partial<Usuario>): Promise<Usuario> {
    try {
      const { data } = await api.put<Usuario>(`/usuarios/${id}`, datos);
      return data;
    } catch (error) {
      throw new Error(extraerMensajeError(error, 'No se pudo actualizar el usuario'));
    }
  },

  async eliminarUsuario(id: string | number): Promise<void> {
    try {
      await api.delete(`/usuarios/${id}`);
    } catch (error) {
      throw new Error(extraerMensajeError(error, 'No se pudo eliminar el usuario'));
    }
  },
};

export default usuariosService;
