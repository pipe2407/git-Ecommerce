// Store de categorías (Zustand).
import { create } from 'zustand';
import categoriasService from '../services/api/categoriasService';
import type { Categoria } from '../types';

interface CategoriasState {
  categorias: Categoria[];
  loading: boolean;
  error: string | null;
  fetchCategorias: (tipo?: string) => Promise<void>;
}

export const useCategoriasStore = create<CategoriasState>((set) => ({
  categorias: [],
  loading: false,
  error: null,

  fetchCategorias: async (tipo?: string) => {
    set({ loading: true, error: null });
    try {
      const categorias = await categoriasService.getCategorias(tipo);
      set({ categorias, loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },
}));

export default useCategoriasStore;
