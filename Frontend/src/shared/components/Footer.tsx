// Footer premium para TechCore — PC & Portátiles Store
import { Link } from 'react-router-dom';
import authService from '../../services/api/authService';

const getFooterSections = () => {
  const isAuthenticated = authService.isAuthenticated();
  const user = authService.getStoredUser();
  const userRole = user?.rol || localStorage.getItem('userRole') || 'buyer';

  const sections = [
    {
      title: 'Productos',
      links: [
        { label: 'Portátiles Gaming', to: '/catalog?cat=Portátiles' },
        { label: 'Computadores de Escritorio', to: '/catalog?cat=Computadores' },
        { label: 'Tarjetas Gráficas GPU', to: '/catalog?cat=Componentes' },
        { label: 'Procesadores CPU', to: '/catalog?cat=Componentes' },
        { label: 'Monitores Gaming', to: '/catalog?cat=Monitores' },
        { label: 'Periféricos', to: '/catalog?cat=Periféricos' },
      ],
    },
    {
      title: 'Ofertas',
      links: [
        { label: 'Ofertas del día', to: '/catalog?filter=sale' },
        { label: 'Productos nuevos', to: '/catalog?filter=new' },
        { label: 'Más vendidos', to: '/catalog?filter=hot' },
        { label: 'Combos armados', to: '/catalog?filter=bundle' },
        { label: 'Liquidación', to: '/catalog?filter=clearance' },
      ],
    },
    {
      title: 'Mi Cuenta',
      links: [
        ...(isAuthenticated
          ? [
              { label: 'Mis pedidos', to: '/orders' },
              { label: 'Mis favoritos', to: '/wishlist' },
              ...(userRole === 'seller'
                ? [{ label: 'Publicar producto', to: '/publish' }]
                : []),
            ]
          : [
              { label: 'Iniciar sesión', to: '/login' },
              { label: 'Registrarse', to: '/register' },
            ]),
      ],
    },
    {
      title: 'Soporte',
      links: [
        { label: 'Centro de ayuda', to: '#' },
        { label: 'Garantías', to: '#' },
        { label: 'Devoluciones', to: '#' },
        { label: 'Rastrear pedido', to: '#' },
        { label: 'Contacto', to: '#' },
      ],
    },
  ];

  return sections;
};

const BRANDS = ['ASUS ROG', 'MSI', 'Lenovo', 'Dell', 'HP', 'Apple', 'NVIDIA', 'AMD', 'Intel', 'Corsair', 'Samsung', 'LG'];

const PAYMENT_METHODS = ['💳 Visa', '💳 Mastercard', '🏦 PSE', '💱 Nequi', '💸 Daviplata'];

export default function Footer() {
  const footerSections = getFooterSections();

  return (
    <footer style={{ background: '#060910', borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: 'auto' }}>

      {/* ── BRANDS ROW ──────────────────────────────────────── */}
      <div style={{
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        padding: '24px 0',
        overflow: 'hidden',
      }}>
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <p style={{ fontSize: '0.7rem', color: '#4b5563', textTransform: 'uppercase',
            letterSpacing: '0.15em', fontWeight: 700, textAlign: 'center', marginBottom: 16 }}>
            Marcas oficiales que distribuimos
          </p>
          <div className="scroll-x" style={{ justifyContent: 'center', flexWrap: 'wrap', gap: 8 }}>
            {BRANDS.map(b => (
              <span key={b} className="brand-logo">{b}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── MAIN FOOTER ─────────────────────────────────────── */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4" style={{ textDecoration: 'none' }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'linear-gradient(135deg, #0099cc, #7c3aed)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round">
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
              <span className="gradient-text" style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: '1.2rem' }}>
                TechCore
              </span>
            </Link>

            <p style={{ fontSize: '0.82rem', color: '#4b5563', lineHeight: 1.7, marginBottom: 20 }}>
              Tu tienda especializada en computadores, portátiles y componentes de alto rendimiento. Tecnología de élite al precio justo.
            </p>

            {/* Social icons */}
            <div style={{ display: 'flex', gap: 8 }}>
              {[
                { icon: 'fb',  label: 'Facebook',  color: '#3b82f6' },
                { icon: 'ig',  label: 'Instagram', color: '#ec4899' },
                { icon: 'yt',  label: 'YouTube',   color: '#ef4444' },
                { icon: 'tw',  label: 'Twitter/X', color: '#e2e8f0' },
                { icon: 'tg',  label: 'Telegram',  color: '#0ea5e9' },
              ].map(s => (
                <a
                  key={s.icon}
                  href="#"
                  aria-label={s.label}
                  className="btn-icon"
                  style={{ '--hover-color': s.color } as React.CSSProperties}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="9" />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {footerSections.map(sec => (
            <div key={sec.title}>
              <h4 style={{
                fontSize: '0.72rem', fontWeight: 700, color: '#f0f6ff',
                textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 16,
              }}>
                {sec.title}
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {sec.links.map(l => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      style={{ fontSize: '0.82rem', color: '#4b5563', textDecoration: 'none', transition: 'color 0.2s' }}
                      className="hover:text-slate-300 transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── NEWSLETTER ──────────────────────────────────── */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 w-full mt-10 p-6 sm:p-8 rounded-2xl border border-blue-500/10" style={{ background: 'linear-gradient(135deg, rgba(0,200,255,0.06), rgba(124,58,237,0.06))' }}>
          <div className="flex-1 w-full">
            <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: '#f0f6ff', fontSize: '1rem', marginBottom: 4 }}>
              📧 Recibe las mejores ofertas de tecnología
            </p>
            <p style={{ fontSize: '0.8rem', color: '#4b5563' }}>
              Sé el primero en saber sobre nuevos lanzamientos, drops exclusivos y descuentos.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto shrink-0">
            <input
              type="email"
              placeholder="tu@email.com"
              className="input-field w-full sm:w-64"
            />
            <button className="btn-primary w-full sm:w-auto">
              Suscribirse
            </button>
          </div>
        </div>

        {/* ── PAYMENT + BOTTOM ────────────────────────────── */}
        <div className="section-divider" />

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {PAYMENT_METHODS.map(p => (
              <span key={p} style={{
                padding: '4px 12px', borderRadius: 8,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                fontSize: '0.72rem', color: '#6b7280', fontWeight: 600,
              }}>
                {p}
              </span>
            ))}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', color: '#374151' }}>
              © 2026 TechCore. Todos los derechos reservados.
            </span>
            {['Privacidad', 'Términos', 'Cookies'].map(l => (
              <a key={l} href="#"
                style={{ fontSize: '0.78rem', color: '#374151', textDecoration: 'none' }}
                className="hover:text-slate-400 transition-colors">
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
