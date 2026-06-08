// EC-003 — Recuperar contraseña
import { useState } from 'react';
import { Link } from 'react-router-dom';
import api, { extraerMensajeError } from '../../../services/api/axiosConfig';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [confirmacionContrasena, setConfirmacionContrasena] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !nuevaContrasena || !confirmacionContrasena) {
      setError('Por favor completa todos los campos');
      return;
    }

    if (nuevaContrasena !== confirmacionContrasena) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (nuevaContrasena.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/reset-password', {
        email,
        nuevaContrasena,
      });

      setSuccess(true);
      setEmail('');
      setNuevaContrasena('');
      setConfirmacionContrasena('');
    } catch (err) {
      setError(extraerMensajeError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <div className="orb orb-purple w-96 h-96 -top-20 left-1/4" />

      <div className="w-full max-w-md relative z-10 animate-fade-in-up">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-2xl font-bold gradient-text" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>ShopNova</span>
          </Link>
          <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Restablecer contraseña
          </h1>
        </div>

        <div className="glass rounded-3xl p-8">
          {success ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">¡Contraseña actualizada!</h2>
              <p className="text-slate-400 text-sm mb-4">
                Tu contraseña ha sido cambiada correctamente.
              </p>
              <Link to="/login" className="btn-primary px-8">
                Ir al login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Correo electrónico</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="input-field"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Nueva contraseña</label>
                <input
                  type="password"
                  value={nuevaContrasena}
                  onChange={e => setNuevaContrasena(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="input-field"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Confirmar contraseña</label>
                <input
                  type="password"
                  value={confirmacionContrasena}
                  onChange={e => setConfirmacionContrasena(e.target.value)}
                  placeholder="Confirma tu contraseña"
                  className="input-field"
                  required
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3.5 disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Cambiando...
                  </>
                ) : 'Cambiar contraseña'}
              </button>

              <p className="text-center text-sm text-slate-500">
                <Link to="/login" className="text-purple-400 hover:text-purple-300 transition-colors">
                  ← Volver al login
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
