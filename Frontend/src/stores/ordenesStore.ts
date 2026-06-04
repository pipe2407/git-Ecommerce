import { create } from 'zustand';
import ordenesService from '../services/api/ordenesService';
import type { Orden, CrearOrdenData } from '../services/api/ordenesService';

interface OrdenesState {
  ordenes: Orden[];
  loading: boolean;
  error: string | null;
  fetchMisOrdenes: () => Promise<void>;
  crearOrden: (datos: CrearOrdenData) => Promise<Orden>;
}

export const useOrdenesStore = create<OrdenesState>((set) => ({
  ordenes: [],
  loading: false,
  error: null,

  fetchMisOrdenes: async () => {
    set({ loading: true, error: null });
    try {
      const ordenes = await ordenesService.getMisOrdenes();
      set({ ordenes, loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  crearOrden: async (datos) => {
    set({ loading: true, error: null });
    try {
      const nueva = await ordenesService.crearOrden(datos);
      set((state) => ({ ordenes: [nueva, ...state.ordenes], loading: false }));
      return nueva;
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
      throw err;
    }
  },
}));

export default useOrdenesStore;
