// Servicio HTTP para el módulo de Roles.
import api, { extraerMensajeError } from './axiosConfig';
import type { Rol } from '../../types';

export const rolesService = {
  async getRoles(): Promise<Rol[]> {
    try {
      const { data } = await api.get('/roles');
      if (Array.isArray(data)) return data as Rol[];
      const obj = data as { data?: unknown; roles?: unknown };
      if (Array.isArray(obj?.data)) return obj.data as Rol[];
      if (Array.isArray(obj?.roles)) return obj.roles as Rol[];
      return [];
    } catch (error) {
      throw new Error(extraerMensajeError(error, 'No se pudieron cargar los roles'));
    }
  },
};

export default rolesService;
