// Servicio de autenticación: login, register, logout, refresh y gestión de token.
import api, {
  TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  USER_KEY,
  extraerMensajeError,
} from './axiosConfig';
import type { LoginResponse, RegisterDatos, Usuario } from '../../types';

function persistAuth(data: LoginResponse): void {
  const token = data.token ?? data.accessToken ?? data.access_token;
  if (token) localStorage.setItem(TOKEN_KEY, token);
  if (data.refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);

  const usuario = data.usuario ?? data.user;
  if (usuario) localStorage.setItem(USER_KEY, JSON.stringify(usuario));

  // Compatibilidad con la lógica previa del Navbar (isAuthenticated / userRole).
  localStorage.setItem('isAuthenticated', 'true');
  const rol = usuario?.rol;
  if (rol) localStorage.setItem('userRole', rol);
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const { data } = await api.post<LoginResponse>('/auth/login', { email, password });
      persistAuth(data);
      return data;
    } catch (error) {
      throw new Error(extraerMensajeError(error, 'No se pudo iniciar sesión'));
    }
  },

  async register(datos: RegisterDatos): Promise<Usuario> {
    try {
      const { data } = await api.post<Usuario>('/auth/register', datos);
      return data;
    } catch (error) {
      throw new Error(extraerMensajeError(error, 'No se pudo completar el registro'));
    }
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch {
      // Aún si el backend falla, limpiamos la sesión local.
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userRole');
    }
  },

  async refreshToken(): Promise<string | null> {
    try {
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      const { data } = await api.post<LoginResponse>('/auth/refresh', { refreshToken });
      const token = data.token ?? data.accessToken ?? data.access_token ?? null;
      if (token) localStorage.setItem(TOKEN_KEY, token);
      if (data.refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
      return token;
    } catch (error) {
      throw new Error(extraerMensajeError(error, 'No se pudo refrescar la sesión'));
    }
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  getStoredUser(): Usuario | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as Usuario;
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    return Boolean(localStorage.getItem(TOKEN_KEY));
  },
};

export default authService;
