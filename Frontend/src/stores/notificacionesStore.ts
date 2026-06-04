// Store de notificaciones (Zustand).
import { create } from 'zustand';
import notificacionesService from '../services/api/notificacionesService';
import type { Notificacion, NotificacionFiltros } from '../types';

interface NotificacionesState {
  notificaciones: Notificacion[];
  notificacionDetalle: Notificacion | null;
  loading: boolean;
  error: string | null;
  fetchNotificaciones: (filtros?: NotificacionFiltros) => Promise<void>;
  fetchNotificacion: (id: string | number) => Promise<void>;
  crearNotificacion: (datos: Partial<Notificacion>) => Promise<Notificacion>;
  actualizarNotificacion: (
    id: string | number,
    datos: Partial<Notificacion>
  ) => Promise<Notificacion>;
  eliminarNotificacion: (id: string | number) => Promise<void>;
}

export const useNotificacionesStore = create<NotificacionesState>((set) => ({
  notificaciones: [],
  notificacionDetalle: null,
  loading: false,
  error: null,

  fetchNotificaciones: async (filtros) => {
    set({ loading: true, error: null });
    try {
      const notificaciones = await notificacionesService.getNotificaciones(filtros);
      set({ notificaciones, loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  fetchNotificacion: async (id) => {
    set({ loading: true, error: null, notificacionDetalle: null });
    try {
      const notificacionDetalle = await notificacionesService.getNotificacion(id);
      set({ notificacionDetalle, loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  crearNotificacion: async (datos) => {
    set({ loading: true, error: null });
    try {
      const nueva = await notificacionesService.crearNotificacion(datos);
      set((state) => ({ notificaciones: [nueva, ...state.notificaciones], loading: false }));
      return nueva;
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
      throw err;
    }
  },

  actualizarNotificacion: async (id, datos) => {
    try {
      const actualizada = await notificacionesService.actualizarNotificacion(id, datos);
      set((state) => ({
        notificaciones: state.notificaciones.map((n) =>
          String(n.id) === String(id) ? actualizada : n
        ),
      }));
      return actualizada;
    } catch (err) {
      set({ error: (err as Error).message });
      throw err;
    }
  },

  eliminarNotificacion: async (id) => {
    try {
      await notificacionesService.eliminarNotificacion(id);
      set((state) => ({
        notificaciones: state.notificaciones.filter((n) => String(n.id) !== String(id)),
      }));
    } catch (err) {
      set({ error: (err as Error).message });
      throw err;
    }
  },
}));

export default useNotificacionesStore;
