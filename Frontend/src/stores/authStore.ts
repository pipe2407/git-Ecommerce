// Store de autenticación (Zustand).
import { create } from 'zustand';
import authService from '../services/api/authService';
import { TOKEN_KEY } from '../services/api/axiosConfig';
import type { Usuario, RegisterDatos } from '../types';

interface AuthState {
  usuario: Usuario | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (datos: RegisterDatos) => Promise<Usuario>;
  logout: () => Promise<void>;
  setToken: (token: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  usuario: authService.getStoredUser(),
  token: localStorage.getItem(TOKEN_KEY),
  isAuthenticated: authService.isAuthenticated(),

  login: async (email, password) => {
    const data = await authService.login(email, password);
    const usuario = data.usuario ?? data.user ?? null;
    const token = data.token ?? data.accessToken ?? data.access_token ?? null;
    set({ usuario, token, isAuthenticated: true });
  },

  register: async (datos) => {
    return authService.register(datos);
  },

  logout: async () => {
    await authService.logout();
    set({ usuario: null, token: null, isAuthenticated: false });
  },

  setToken: (token) => {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
    set({ token, isAuthenticated: Boolean(token) });
  },
}));

export default useAuthStore;
