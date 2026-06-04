// EC-001 — Registro de usuario
// Conectado al backend vía authStore (POST /auth/register).

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../stores/authStore';

type Role = 'comprador' | 'vendedor';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const register = useAuthStore((s) => s.register);
  const [role, setRole] = useState<Role>('comprador');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const strength = (() => {
    if (password.length === 0) return 0;
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  })();

  const strengthLabel = ['', 'Débil', 'Regular', 'Fuerte', 'Muy fuerte'][strength];
  const strengthColor = ['', 'bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'][strength];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !password || !confirm) {
      setError('Completa todos los campos.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('El correo no tiene un formato válido.');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (password !== confirm) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    try {
      await register({ nombre: name, email, password, rol: role });
      navigate('/login');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background orbs */}
      <div className="orb orb-cyan w-96 h-96 -top-20 -right-20" />
      <div className="orb orb-purple w-72 h-72 bottom-10 -left-10" />

      <div className="w-full max-w-md relative z-10 animate-fade-in-up mt-8">
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 text-sm font-medium">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Volver al catálogo
        </Link>
        
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #0099cc, #7c3aed)', boxShadow: '0 0 16px rgba(0,200,255,0.35)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="4" width="16" height="16" rx="2" />
                <rect x="9" y="9" width="6" height="6" />
                <line x1="9" y1="1" x2="9" y2="4" />
                <line x1="15" y1="1" x2="15" y2="4" />
                <line x1="9" y1="20" x2="9" y2="23" />
                <line x1="15" y1="20" x2="15" y2="23" />
                <line x1="20" y1="9" x2="23" y2="9" />
                <line x1="20" y1="14" x2="23" y2="14" />
                <line x1="1" y1="9" x2="4" y2="9" />
                <line x1="1" y1="14" x2="4" y2="14" />
              </svg>
            </div>
            <span className="text-2xl font-bold gradient-text" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>TechCore</span>
          </Link>
          <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Crea tu cuenta
          </h1>
          <p className="text-slate-400 mt-2">Únete y empieza a comprar o vender hoy</p>
        </div>

        <div className="glass rounded-3xl p-8">
          {/* Role toggle */}
          <div className="flex rounded-xl overflow-hidden border border-white/[0.08] mb-6">
            {(['comprador', 'vendedor'] as Role[]).map(r => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`flex-1 py-3 text-sm font-semibold capitalize transition-all ${
                  role === r
                    ? 'gradient-bg text-white'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {r === 'comprador' ? '🛍️ Comprador' : '🏪 Vendedor'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Nombre completo</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Juan Pérez"
                className="input-field"
                autoComplete="name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Correo electrónico</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="input-field"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Contraseña</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="input-field pr-12"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
              {/* Strength bar */}
              {password.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map(i => (
                      <div
                        key={i}
                        className={`flex-1 h-1 rounded-full transition-all ${i <= strength ? strengthColor : 'bg-white/[0.08]'}`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Contraseña: {strengthLabel}</p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Confirmar contraseña</label>
              <input
                type="password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder="Repite tu contraseña"
                className="input-field"
                autoComplete="new-password"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <p className="text-xs text-slate-500 leading-relaxed">
              Al registrarte aceptas nuestros{' '}
              <a href="#" className="text-purple-400 hover:underline">Términos de Servicio</a>{' '}
              y{' '}
              <a href="#" className="text-purple-400 hover:underline">Política de Privacidad</a>.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 text-base disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creando cuenta...
                </>
              ) : 'Crear cuenta gratis'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
