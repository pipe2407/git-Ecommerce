// Navbar premium — glassmorphism, search bar, categorías y carrito
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCarritoStore } from '../../stores/carritoStore';

const NAV_LINKS = [
  { to: '/catalog',                    label: 'Catálogo',      icon: '🏠', roles: ['all'] },
  { to: '/catalog?cat=Portátiles',     label: 'Portátiles',    icon: '💻', roles: ['all'] },
  { to: '/catalog?cat=Computadores',   label: 'Computadores',  icon: '🖥️', roles: ['all'] },
  { to: '/catalog?cat=Componentes',    label: 'Componentes',   icon: '🔧', roles: ['all'] },
  { to: '/catalog?cat=Monitores',      label: 'Monitores',     icon: '🖵', roles: ['all'] },
  { to: '/orders',                     label: 'Mis Pedidos',   icon: '📦', roles: ['buyer'] },
  { to: '/publish',                    label: 'Vender',        icon: '💰', roles: ['seller'] },
  { to: '/management',                 label: 'Mis Productos', icon: '📝', roles: ['seller'] },
  { to: '/admin/users',                label: 'Gestión Usu.',  icon: '👥', roles: ['admin'] },
  { to: '/admin/reports',              label: 'Reportes',      icon: '📊', roles: ['admin'] },
];

export default function Navbar() {
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [scrolled,  setScrolled]  = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const items = useCarritoStore((s) => s.items);
  const cartCount = items.length;

  // Verificar si hay sesión
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const role = localStorage.getItem('userRole') || 'buyer';

  const visibleLinks = NAV_LINKS.filter(l => l.roles.includes('all') || (isAuthenticated && l.roles.includes(role)));
  const categoryLinks = visibleLinks.filter(l => l.roles.includes('all'));
  const userLinks = visibleLinks.filter(l => !l.roles.includes('all'));

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    window.location.href = '/login'; // Forzamos recarga para limpiar estado
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (path: string) =>
    path === '/catalog'
      ? location.pathname === '/catalog'
      : location.pathname + location.search === path ||
        location.pathname === path.split('?')[0];

  return (
    <>
      {/* ── TOP ANNOUNCEMENT BAR ────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(90deg, #7c3aed, #0099cc)',
        padding: '8px 16px',
        textAlign: 'center',
        fontSize: '0.78rem',
        fontWeight: 600,
        color: '#fff',
        letterSpacing: '0.02em',
      }}>
        🚀 &nbsp;Envío gratis en compras +$200.000 &nbsp;|&nbsp; Hasta 24 cuotas sin interés &nbsp;|&nbsp; Garantía 1 año en todos los productos
      </div>

      {/* ── MAIN NAVBAR ─────────────────────────────────────── */}
      <header
        className="sticky top-0 z-40"
        style={{
          background: scrolled
            ? 'rgba(8,11,20,0.97)'
            : 'rgba(8,11,20,0.85)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          transition: 'background 0.3s ease',
          boxShadow: scrolled ? '0 8px 32px rgba(0,0,0,0.4)' : 'none',
        }}
      >
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top row */}
          <div className="flex items-center justify-between h-16 gap-4">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'linear-gradient(135deg, #0099cc, #7c3aed)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 16px rgba(0,200,255,0.35)',
              }}>
                {/* CPU icon */}
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
              <div>
                <span
                  className="gradient-text"
                  style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: '1.15rem', display: 'block', lineHeight: 1 }}
                >
                  TechCore
                </span>
                <span style={{ fontSize: '0.6rem', color: '#4b5563', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600 }}>
                  PC Store
                </span>
              </div>
            </Link>

            {/* Search bar — desktop */}
            <div className="hidden md:flex flex-1 max-w-xl mx-4">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Buscar portátiles, GPUs, procesadores..."
                  className="input-field pr-12"
                  style={{ borderRadius: 14, height: 42 }}
                />
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: '#00c8ff' }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-1 sm:gap-2">

              {/* Search mobile */}
              <button
                className="md:hidden btn-icon"
                onClick={() => setSearchOpen(v => !v)}
                aria-label="Buscar"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Cart */}
              <Link to="/cart" className="btn-icon relative" aria-label="Carrito">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartCount > 0 && (
                  <span style={{
                    position: 'absolute', top: -4, right: -4,
                    width: 18, height: 18, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #0099cc, #7c3aed)',
                    fontSize: '0.65rem', fontWeight: 700, color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>{cartCount}</span>
                )}
              </Link>

              {/* Auth buttons — desktop */}
              <div className="hidden sm:flex items-center gap-2">
                {isAuthenticated ? (
                  <button onClick={handleLogout} className="btn-ghost text-sm py-2 px-4 text-red-400 hover:text-red-300">
                    Cerrar Sesión
                  </button>
                ) : (
                  <>
                    <Link to="/login" className="btn-ghost text-sm py-2 px-4">
                      Ingresar
                    </Link>
                    <Link to="/register" className="btn-primary text-sm py-2 px-5">
                      Registrarse
                    </Link>
                  </>
                )}
              </div>

              {/* Hamburger */}
              <button
                onClick={() => setMenuOpen(true)}
                className="lg:hidden btn-icon"
                aria-label="Abrir menú"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Search bar mobile (expandable) */}
          {searchOpen && (
            <div className="md:hidden pb-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  className="input-field pr-10"
                  autoFocus
                />
                <svg className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#00c8ff' }}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          )}

          {/* Bottom nav row — categories */}
          <nav className="hidden lg:flex items-center gap-1 pb-2">
            {categoryLinks.map(l => (
              <Link
                key={l.label}
                to={l.to}
                className={`nav-link px-3 py-1.5 rounded-lg text-sm transition-all ${
                  isActive(l.to)
                    ? 'text-white font-semibold'
                    : 'hover:bg-white/5'
                }`}
                style={isActive(l.to)
                  ? { color: '#00c8ff', background: 'rgba(0,200,255,0.08)', borderBottom: 'none' }
                  : {}}
              >
                {l.label}
              </Link>
            ))}
            {isAuthenticated && userLinks.map(l => (
              <Link key={l.label} to={l.to} className={`nav-link px-3 py-1.5 rounded-lg text-sm hover:bg-white/5 ${l.roles.includes('admin') ? 'text-purple-400 font-semibold' : ''}`}>
                {l.label}
              </Link>
            ))}
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 600 }}>
                ● Disponibles ahora: 1,847 productos
              </span>
            </div>
          </nav>
        </div>
      </header>

      {/* ── MOBILE MENU BACKDROP ─────────────────────────────── */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 98,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            animation: 'fadeIn 0.2s ease',
          }}
        />
      )}

      {/* ── MOBILE MENU SIDEBAR ──────────────────────────────── */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        {/* Header del drawer */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 24px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}>
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="gradient-text"
            style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.4rem', fontWeight: 800 }}
          >
            TechCore
          </Link>
          <button
            onClick={() => setMenuOpen(false)}
            className="btn-icon"
            aria-label="Cerrar menú"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Búsqueda dentro del drawer */}
        <div style={{ padding: '16px 24px 8px' }}>
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar productos..."
              className="input-field pr-10"
              style={{ borderRadius: 12, fontSize: '0.875rem' }}
            />
            <svg className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#00c8ff' }}
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Nav links con íconos */}
        <nav style={{ padding: '8px 16px', flex: 1, overflowY: 'auto' }}>
          <p style={{ fontSize: '0.65rem', color: '#4b5563', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '8px 8px 12px' }}>Navegar</p>
          {visibleLinks.map(l => (
            <Link
              key={l.label}
              to={l.to}
              onClick={() => setMenuOpen(false)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 12px',
                borderRadius: 12,
                textDecoration: 'none',
                marginBottom: 2,
                color: isActive(l.to) ? '#00c8ff' : '#94a3b8',
                background: isActive(l.to) ? 'rgba(0,200,255,0.08)' : 'transparent',
                fontWeight: isActive(l.to) ? 600 : 500,
                transition: 'all 0.2s ease',
                fontSize: '0.95rem',
              }}
              className="drawer-nav-link"
            >
              <span style={{ fontSize: '1.15rem', width: 28, textAlign: 'center' }}>{l.icon}</span>
              <span>{l.label}</span>
              {isActive(l.to) && (
                <svg style={{ marginLeft: 'auto', color: '#00c8ff' }} className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </Link>
          ))}
        </nav>

        {/* CTA Buttons */}
        <div style={{
          padding: '16px 24px 24px',
          borderTop: '1px solid rgba(255,255,255,0.07)',
          display: 'flex', flexDirection: 'column', gap: 10,
        }}>
          <Link to="/cart" onClick={() => setMenuOpen(false)}
            className="btn-ghost w-full text-center"
            style={{ borderRadius: 12, padding: '11px 20px', fontSize: '0.875rem' }}>
            🛒 Carrito ({cartCount})
          </Link>
          {isAuthenticated ? (
             <button onClick={handleLogout}
               className="btn-ghost w-full text-center text-red-500 hover:bg-red-500/10"
               style={{ borderRadius: 12, padding: '11px 20px', fontSize: '0.875rem' }}>
               Cerrar Sesión
             </button>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)}
                className="btn-ghost w-full text-center"
                style={{ borderRadius: 12, padding: '11px 20px', fontSize: '0.875rem' }}>
                Ingresar
              </Link>
              <Link to="/register" onClick={() => setMenuOpen(false)}
                className="btn-primary w-full text-center"
                style={{ borderRadius: 12, padding: '11px 20px', fontSize: '0.875rem' }}>
                Crear cuenta gratis
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
