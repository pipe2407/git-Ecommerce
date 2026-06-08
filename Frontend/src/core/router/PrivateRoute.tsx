import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../../services/api/authService';

interface PrivateRouteProps {
  children: ReactNode;
  requiredRoles?: string[];
}

export default function PrivateRoute({ children, requiredRoles = [] }: PrivateRouteProps) {
  const isAuthenticated = authService.isAuthenticated();
  const role = localStorage.getItem('userRole');

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRoles.length > 0 && !requiredRoles.includes(role || '')) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <div className="text-8xl mb-6">🔒</div>
        <h1 className="text-5xl font-extrabold text-white mb-3">403</h1>
        <p className="text-xl text-slate-400 mb-8">No tienes permisos para acceder a esta página.</p>
        <a href="/" className="btn-primary px-8 py-3.5">Ir al inicio</a>
      </div>
    );
  }

  return <>{children}</>;
}
