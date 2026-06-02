// EC-003 — Recuperar contraseña
import { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1200);
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
            Recuperar contraseña
          </h1>
          <p className="text-slate-400 mt-2">Te enviaremos un enlace a tu correo</p>
        </div>

        <div className="glass rounded-3xl p-8">
          {sent ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">¡Correo enviado!</h2>
              <p className="text-slate-400 text-sm">
                Revisa tu bandeja de entrada en <strong className="text-white">{email}</strong> y sigue las instrucciones.
              </p>
              <Link to="/login" className="btn-primary mt-6 px-8">
                Volver al login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Correo electrónico</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="input-field"
                  required
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
                    Enviando...
                  </>
                ) : 'Enviar enlace de recuperación'}
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
