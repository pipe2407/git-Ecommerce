// Store de usuarios (Zustand).
import { create } from 'zustand';
import usuariosService from '../services/api/usuariosService';
import type { Usuario } from '../types';

interface UsuariosState {
  usuarios: Usuario[];
  loading: boolean;
  error: string | null;
  fetchUsuarios: () => Promise<void>;
  crearUsuario: (datos: Partial<Usuario> & { password?: string }) => Promise<Usuario>;
}

export const useUsuariosStore = create<UsuariosState>((set) => ({
  usuarios: [],
  loading: false,
  error: null,

  fetchUsuarios: async () => {
    set({ loading: true, error: null });
    try {
      const usuarios = await usuariosService.getUsuarios();
      set({ usuarios, loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  crearUsuario: async (datos) => {
    set({ loading: true, error: null });
    try {
      const nuevo = await usuariosService.crearUsuario(datos);
      set((state) => ({ usuarios: [...state.usuarios, nuevo], loading: false }));
      return nuevo;
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
      throw err;
    }
  },
}));

export default useUsuariosStore;
