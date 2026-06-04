// Configuración central de Axios para todo el frontend.
// - baseURL desde VITE_API_URL (fallback http://localhost:3400/api)
// - Interceptor de request: agrega Authorization: Bearer {token}
// - Interceptor de response: maneja 401 (logout + redirect) y 403
import axios from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';

export const TOKEN_KEY = 'access_token';
export const REFRESH_TOKEN_KEY = 'refresh_token';
export const USER_KEY = 'auth_user';

const baseURL: string =
  (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:3400/api';

const api: AxiosInstance = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

// ── Request: inyectar token JWT ───────────────────────────────────────
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

// ── Response: manejo global de errores de autenticación/autorización ──
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;

    if (status === 401) {
      // Token inválido o expirado: limpiar sesión y redirigir a login.
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem('isAuthenticated');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    if (status === 403) {
      // Sin permisos: se deja que el componente decida cómo mostrarlo.
      console.warn('Acceso denegado (403):', error.config?.url);
    }

    return Promise.reject(error);
  }
);

// Helper para extraer un mensaje de error legible de una respuesta de Axios.
export function extraerMensajeError(error: unknown, fallback = 'Error desconocido'): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string; error?: string } | undefined;
    return data?.message || data?.error || error.message || fallback;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}

export default api;
