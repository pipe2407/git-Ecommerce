// HomePage — TechCore PC Store | Landing premium para computadores y portátiles
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../shared/components/Layout';
import ProductCard from '../shared/components/ProductCard';
import { MOCK_PRODUCTS } from '../shared/mockData';
import { useProductosStore } from '../stores/productosStore';
import authService from '../services/api/authService';

/* ────────────────────────────────────────────────────
   DATA
──────────────────────────────────────────────────── */
const TICKER_ITEMS = [
  '🔥 RTX 4090 24GB — $7.900.000',
  '💻 MacBook Pro M3 Max — NUEVO',
  '⚡ SSD Samsung 990 Pro 2TB — $520.000',
  '🎮 ASUS ROG Zephyrus G16 — HOT DEAL',
  '🖥️ Monitor LG OLED 4K 240Hz — $3.800.000',
  '🧠 Ryzen 9 9900X — Nuevo en stock',
  '🎁 Envío gratis en compras +$200.000',
  '🛡️ Garantía 1 año en todos los equipos',
];

const CATEGORIES = [
  {
    label: 'Portátiles',
    icon: '💻',
    sub: 'Gaming · Ultrabooks · 2-en-1',
    gradient: 'linear-gradient(135deg, rgba(0,153,204,0.18) 0%, rgba(0,200,255,0.06) 100%)',
    border: 'rgba(0,200,255,0.2)',
    glow: 'rgba(0,200,255,0.12)',
    count: 48,
    to: '/catalog?cat=Portátiles',
  },
  {
    label: 'Componentes',
    icon: '🔧',
    sub: 'GPU · CPU · RAM · SSD',
    gradient: 'linear-gradient(135deg, rgba(124,58,237,0.18) 0%, rgba(124,58,237,0.06) 100%)',
    border: 'rgba(124,58,237,0.25)',
    glow: 'rgba(124,58,237,0.12)',
    count: 124,
    to: '/catalog?cat=Componentes',
  },
  {
    label: 'Computadores',
    icon: '🖥️',
    sub: 'PC Gamer · Workstation · All-in-One',
    gradient: 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(16,185,129,0.04) 100%)',
    border: 'rgba(16,185,129,0.2)',
    glow: 'rgba(16,185,129,0.10)',
    count: 35,
    to: '/catalog?cat=Computadores',
  },
  {
    label: 'Monitores',
    icon: '🖱️',
    sub: 'OLED · 4K · 240Hz · Ultrawide',
    gradient: 'linear-gradient(135deg, rgba(249,115,22,0.15) 0%, rgba(249,115,22,0.04) 100%)',
    border: 'rgba(249,115,22,0.2)',
    glow: 'rgba(249,115,22,0.10)',
    count: 22,
    to: '/catalog?cat=Monitores',
  },
  {
    label: 'Periféricos',
    icon: '⌨️',
    sub: 'Teclados · Ratones · Headsets',
    gradient: 'linear-gradient(135deg, rgba(236,72,153,0.15) 0%, rgba(236,72,153,0.04) 100%)',
    border: 'rgba(236,72,153,0.2)',
    glow: 'rgba(236,72,153,0.10)',
    count: 67,
    to: '/catalog?cat=Periféricos',
  },
  {
    label: 'Combos',
    icon: '🎁',
    sub: 'Sets armados · Bundles gaming',
    gradient: 'linear-gradient(135deg, rgba(245,158,11,0.15) 0%, rgba(245,158,11,0.04) 100%)',
    border: 'rgba(245,158,11,0.2)',
    glow: 'rgba(245,158,11,0.10)',
    count: 18,
    to: '/catalog?filter=bundle',
  },
];

const FEATURES = [
  {
    icon: '🚀',
    title: 'Envío express 24-48h',
    desc: 'Entregamos en todo Colombia. Gratis en compras sobre $200.000.',
    color: 'rgba(0,200,255,0.1)',
    border: 'rgba(0,200,255,0.2)',
  },
  {
    icon: '🔒',
    title: 'Pago 100% seguro',
    desc: 'SSL, PSE, Nequi, Daviplata y tarjetas en hasta 24 cuotas.',
    color: 'rgba(16,185,129,0.1)',
    border: 'rgba(16,185,129,0.2)',
  },
  {
    icon: '🛡️',
    title: 'Garantía 1 año',
    desc: 'Todos nuestros equipos tienen garantía de fábrica y soporte técnico.',
    color: 'rgba(124,58,237,0.1)',
    border: 'rgba(124,58,237,0.2)',
  },
  {
    icon: '🎧',
    title: 'Soporte especializado',
    desc: 'Expertos en tech disponibles por WhatsApp, chat y teléfono 7 días.',
    color: 'rgba(249,115,22,0.1)',
    border: 'rgba(249,115,22,0.2)',
  },
];

const STATS = [
  { value: '12.400+', label: 'Productos disponibles' },
  { value: '98.7%',  label: 'Clientes satisfechos' },
  { value: '24h',    label: 'Entrega express' },
  { value: '1 año',  label: 'Garantía incluida' },
];

/* ────────────────────────────────────────────────────
   COUNTDOWN HOOK
──────────────────────────────────────────────────── */
function useCountdown(hours: number, minutes: number, seconds: number) {
  const totalMs = useRef((hours * 3600 + minutes * 60 + seconds) * 1000);
  const [time, setTime] = useState({ h: hours, m: minutes, s: seconds });
  useEffect(() => {
    const id = setInterval(() => {
      totalMs.current -= 1000;
      if (totalMs.current <= 0) { clearInterval(id); return; }
      const h = Math.floor(totalMs.current / 3600000);
      const m = Math.floor((totalMs.current % 3600000) / 60000);
      const s = Math.floor((totalMs.current % 60000) / 1000);
      setTime({ h, m, s });
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

/* ────────────────────────────────────────────────────
   COMPONENT
──────────────────────────────────────────────────── */
export default function HomePage() {
  const countdown  = useCountdown(5, 47, 23);
  const productos = useProductosStore((s) => s.productos);
  const fetchProductos = useProductosStore((s) => s.fetchProductos);
  const isAuthenticated = authService.isAuthenticated();

  useEffect(() => {
    fetchProductos();
  }, [fetchProductos]);

  const featured   = (productos.length > 0 ? productos : MOCK_PRODUCTS).filter(p => {
    if (productos.length > 0) return p.stock > 0;
    return (p as any).inStock;
  }).slice(0, 8);

  const newArrivals = MOCK_PRODUCTS.filter(p => p.isNew).slice(0, 4);
  const hotDeals   = MOCK_PRODUCTS.filter(p => p.isHot || p.originalPrice).slice(0, 4);

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <Layout>

      {/* ══════════════════════════════════════════════════
          TICKER TAPE
      ══════════════════════════════════════════════════ */}
      <div className="ticker-wrap">
        <div
          className="ticker-content animate-ticker"
          style={{ fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8' }}
        >
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} style={{ flexShrink: 0 }}>
              {item}
              <span style={{ margin: '0 24px', color: 'rgba(0,200,255,0.4)' }}>·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{ minHeight: '82vh', display: 'flex', alignItems: 'center' }}
      >
        {/* Background elements */}
        <div className="circuit-pattern absolute inset-0" />
        <div className="orb orb-purple" style={{ width: 600, height: 600, top: -200, left: -200, opacity: 0.35 }} />
        <div className="orb orb-cyan"   style={{ width: 500, height: 500, bottom: -100, right: -100, opacity: 0.2 }} />
        <div className="orb orb-blue"   style={{ width: 300, height: 300, top: '40%', left: '50%', opacity: 0.15 }} />

        {/* Scan line animation */}
        <div style={{
          position: 'absolute', left: 0, right: 0, height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(0,200,255,0.4), transparent)',
          animation: 'scan-line 6s ease-in-out infinite',
          pointerEvents: 'none',
        }} />

        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 py-24">
          <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-center">

            {/* ── LEFT COPY ─────────────────────────────── */}
            <div>
              {/* Eyebrow badge */}
              <div
                className="animate-fade-in-up"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: 'rgba(0,200,255,0.08)',
                  border: '1px solid rgba(0,200,255,0.25)',
                  borderRadius: 50, padding: '6px 16px',
                  marginBottom: 24,
                }}
              >
                <span style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: '#10b981',
                  boxShadow: '0 0 8px #10b981',
                  animation: 'pulse 2s ease-in-out infinite',
                  display: 'inline-block',
                }} />
                <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>
                  +12.400 productos en stock · Envío hoy mismo
                </span>
              </div>

              {/* Headline */}
              <h1
                className="animate-fade-in-up delay-100 text-balance"
                style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: 800,
                  fontSize: 'clamp(2.4rem, 5vw, 4.5rem)',
                  lineHeight: 1.05,
                  marginBottom: 24,
                  color: '#f0f6ff',
                }}
              >
                La tecnología que{' '}
                <span style={{
                  background: 'linear-gradient(135deg, #00c8ff 0%, #7c3aed 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  impulsa tu rendimiento
                </span>
              </h1>

              {/* Subtext */}
              <p
                className="animate-fade-in-up delay-200"
                style={{
                  fontSize: '1.1rem', color: '#64748b', lineHeight: 1.75,
                  maxWidth: 480, marginBottom: 36,
                }}
              >
                Portátiles gaming, computadores de escritorio, componentes y periféricos de las mejores marcas. Asesoría especializada, garantía real y envío rápido a toda Colombia.
              </p>

              {/* CTAs */}
              <div className="animate-fade-in-up delay-300" style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 48 }}>
                <Link to="/catalog" className="btn-primary animate-pulse-glow" style={{ padding: '14px 32px', fontSize: '0.95rem' }}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M4 6h16M4 10h16M4 14h8" />
                  </svg>
                  Ver catálogo completo
                </Link>
                <Link to="/catalog?filter=sale" className="btn-ghost" style={{ padding: '14px 28px', fontSize: '0.95rem' }}>
                  🔥 Ofertas del día
                </Link>
              </div>

              {/* Trust stats */}
              <div
                className="animate-fade-in-up delay-400"
                style={{
                  display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: 16,
                }}
              >
                {STATS.map(s => (
                  <div key={s.label} style={{ textAlign: 'center' }}>
                    <div className="stat-number" style={{ fontSize: '1.4rem', display: 'block', marginBottom: 2 }}>
                      {s.value}
                    </div>
                    <span style={{ fontSize: '0.68rem', color: '#4b5563', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── RIGHT — FLOATING PRODUCT CARDS ────────── */}
            <div
              className="hidden lg:block relative animate-fade-in-up delay-200"
              style={{ height: 540 }}
            >
              {/* Central glow */}
              <div style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%,-50%)',
                width: 280, height: 280,
                background: 'radial-gradient(circle, rgba(0,200,255,0.12) 0%, transparent 70%)',
                borderRadius: '50%', pointerEvents: 'none',
              }} />

              {/* Floating cards */}
              {MOCK_PRODUCTS.slice(0, 4).map((p, i) => {
                const positions = [
                  { top: '0%',  left: '5%',  w: 200 },
                  { top: '15%', left: '45%', w: 230 },
                  { top: '52%', left: '0%',  w: 210 },
                  { top: '55%', left: '48%', w: 190 },
                ];
                const pos = positions[i];
                return (
                  <div
                    key={p.id}
                    className="animate-float glass-card"
                    style={{
                      position: 'absolute',
                      width: pos.w,
                      top: pos.top,
                      left: pos.left,
                      animationDelay: `${i * 0.8}s`,
                      overflow: 'hidden',
                      zIndex: i === 1 ? 10 : 5,
                    }}
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block' }}
                      onError={e => {
                        (e.target as HTMLImageElement).src =
                          `https://picsum.photos/seed/tech${p.id}/300/225`;
                      }}
                    />
                    <div style={{ padding: '10px 12px' }}>
                      {p.brand && (
                        <span style={{
                          fontSize: '0.6rem', color: '#00c8ff', fontWeight: 700,
                          textTransform: 'uppercase', letterSpacing: '0.12em',
                          display: 'block', marginBottom: 2,
                        }}>
                          {p.brand}
                        </span>
                      )}
                      <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#f0f6ff', marginBottom: 4 }}
                        className="line-clamp-1">
                        {p.name}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{
                          fontFamily: 'Space Grotesk, sans-serif',
                          fontWeight: 800, color: '#00c8ff', fontSize: '0.85rem',
                        }}>
                          ${(p.price / 1000000).toFixed(1)}M
                        </span>
                        {p.isNew && <span className="badge badge-new" style={{ fontSize: '0.55rem' }}>Nuevo</span>}
                        {p.isHot && <span className="badge badge-hot" style={{ fontSize: '0.55rem' }}>Hot</span>}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Spec badges floating */}
              <div
                className="glass-bright animate-float"
                style={{
                  position: 'absolute', bottom: '12%', right: '-4%',
                  padding: '10px 16px', animationDelay: '1.5s',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>💳</span>
                <div>
                  <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#f0f6ff' }}>Hasta 24 cuotas</p>
                  <p style={{ fontSize: '0.62rem', color: '#4b5563' }}>Sin interés con Bancolombia</p>
                </div>
              </div>

              <div
                className="glass-bright animate-float"
                style={{
                  position: 'absolute', top: '8%', right: '0%',
                  padding: '10px 16px', animationDelay: '2.2s',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>🛡️</span>
                <div>
                  <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#f0f6ff' }}>Garantía 1 año</p>
                  <p style={{ fontSize: '0.62rem', color: '#4b5563' }}>Soporte técnico incluido</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          CATEGORIES
      ══════════════════════════════════════════════════ */}
      <section style={{ padding: '80px 0' }}>
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div style={{ marginBottom: 48, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <p style={{ fontSize: '0.72rem', color: '#00c8ff', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 8 }}>
                Explorar por categoría
              </p>
              <h2
                className="section-title"
                style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 800, color: '#f0f6ff' }}
              >
                ¿Qué estás buscando?
              </h2>
            </div>
            <Link to="/catalog" className="btn-ghost" style={{ padding: '10px 20px', fontSize: '0.85rem' }}>
              Ver todo el catálogo →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map(cat => (
              <Link
                key={cat.label}
                to={cat.to}
                className="cat-card group"
                style={{ background: cat.gradient, borderColor: cat.border, textDecoration: 'none' }}
              >
                <div
                  className="feature-icon"
                  style={{
                    background: cat.gradient,
                    border: `1px solid ${cat.border}`,
                    fontSize: '1.8rem',
                    transition: 'transform 0.3s',
                  }}
                >
                  {cat.icon}
                </div>
                <span style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: '0.9rem', fontWeight: 700, color: '#f0f6ff',
                  textAlign: 'center',
                }}>
                  {cat.label}
                </span>
                <span style={{ fontSize: '0.68rem', color: '#4b5563', textAlign: 'center', lineHeight: 1.4 }}>
                  {cat.sub}
                </span>
                <span style={{
                  fontSize: '0.65rem', color: '#00c8ff', fontWeight: 700,
                  background: 'rgba(0,200,255,0.1)', padding: '2px 10px', borderRadius: 20,
                }}>
                  {cat.count} productos
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FLASH SALE BANNER
      ══════════════════════════════════════════════════ */}
      <section style={{ padding: '0 0 80px' }}>
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="promo-banner p-6 sm:p-10"
            style={{ position: 'relative', overflow: 'hidden' }}
          >
            {/* Orbs */}
            <div className="orb orb-cyan" style={{ width: 300, height: 300, top: -100, left: -80, opacity: 0.3 }} />
            <div className="orb orb-purple" style={{ width: 200, height: 200, bottom: -80, right: 100, opacity: 0.25 }} />

            <div className="relative z-10" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 32, justifyContent: 'space-between' }}>
              {/* Left */}
              <div>
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <span style={{
                    fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.15em', color: '#ef4444',
                    background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
                    padding: '3px 12px', borderRadius: 6, textTransform: 'uppercase',
                  }}>
                    ⚡ Flash Sale
                  </span>
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Termina en:</span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {[{ v: countdown.h, l: 'h' }, { v: countdown.m, l: 'm' }, { v: countdown.s, l: 's' }].map(({ v, l }) => (
                      <div key={l} className="countdown-box">
                        <span style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '1.1rem', color: '#00c8ff', lineHeight: 1 }}>
                          {pad(v)}
                        </span>
                        <span style={{ fontSize: '0.55rem', color: '#4b5563', fontWeight: 700, textTransform: 'uppercase' }}>{l}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 800, color: '#f0f6ff', marginBottom: 8 }}>
                  Hasta{' '}
                  <span style={{ background: 'linear-gradient(135deg,#ef4444,#f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    35% OFF
                  </span>{' '}
                  en componentes
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', maxWidth: 420, lineHeight: 1.6 }}>
                  GPUs, CPUs, RAM y SSDs seleccionados. Armá tu PC gamer al mejor precio del mercado.
                </p>
              </div>

              {/* Right — deal cards */}
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {hotDeals.slice(0, 3).map(p => {
                  const disc = p.originalPrice ? Math.round((1 - p.price / p.originalPrice) * 100) : 0;
                  return (
                    <Link
                      key={p.id}
                      to={`/product/${p.id}`}
                      style={{
                        flex: '1 1 120px',
                        maxWidth: 160,
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: 12,
                        overflow: 'hidden',
                        textDecoration: 'none',
                        transition: 'all 0.3s',
                        display: 'block',
                      }}
                      className="card-hover"
                    >
                      <img
                        src={p.image}
                        alt={p.name}
                        style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block' }}
                        onError={e => { (e.target as HTMLImageElement).src = `https://picsum.photos/seed/deal${p.id}/200/200`; }}
                      />
                      <div style={{ padding: '8px 10px' }}>
                        <p className="line-clamp-2" style={{ fontSize: '0.72rem', color: '#f0f6ff', fontWeight: 600, marginBottom: 4 }}>
                          {p.name}
                        </p>
                        {disc > 0 && (
                          <span style={{
                            fontSize: '0.65rem', fontWeight: 700, color: '#ef4444',
                            background: 'rgba(239,68,68,0.1)', padding: '1px 6px', borderRadius: 4, marginBottom: 4, display: 'inline-block',
                          }}>
                            -{disc}%
                          </span>
                        )}
                        <p style={{ fontFamily: 'Space Grotesk', fontWeight: 800, color: '#00c8ff', fontSize: '0.85rem' }}>
                          ${(p.price / 1000000).toFixed(1)}M
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>

              <Link to="/catalog?filter=sale" className="btn-danger" style={{ alignSelf: 'center', flexShrink: 0 }}>
                Ver todas las ofertas →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FEATURED PRODUCTS
      ══════════════════════════════════════════════════ */}
      <section style={{ padding: '0 0 80px' }}>
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header with tabs */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 36 }}>
            <div>
              <p style={{ fontSize: '0.72rem', color: '#00c8ff', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 8 }}>
                Selección editorial
              </p>
              <h2
                className="section-title"
                style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 800, color: '#f0f6ff' }}
              >
                Productos destacados
              </h2>
            </div>
            <Link to="/catalog" className="btn-ghost hidden sm:flex" style={{ padding: '10px 20px', fontSize: '0.85rem' }}>
              Ver todos →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {featured.map(product => {
              const mapped = productos.length > 0 ? {
                id: Number(product.id),
                name: product.nombre,
                price: product.precio,
                originalPrice: product.precioOriginal,
                image: product.imagen ? (product.imagen.startsWith('data:') ? product.imagen : product.imagen) : `https://picsum.photos/seed/prod${product.id}/600/600`,
                rating: 0,
                reviews: 0,
                category: product.categoria?.nombre || 'General',
                inStock: product.stock > 0,
                description: product.descripcion,
                sku: product.sku || String(product.id),
                brand: product.marca,
                isNew: false,
                isHot: false,
              } : product;

              return (
                <Link key={product.id} to={`/product/${product.id}`} style={{ textDecoration: 'none', display: 'block' }}>
                  <ProductCard {...mapped} />
                </Link>
              );
            })}
          </div>

          <div className="text-center mt-8 sm:hidden">
            <Link to="/catalog" className="btn-ghost" style={{ padding: '12px 36px' }}>
              Ver todos los productos
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          NEW ARRIVALS
      ══════════════════════════════════════════════════ */}
      <section style={{ padding: '0 0 80px' }}>
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 36 }}>
            <div>
              <p style={{ fontSize: '0.72rem', color: '#7c3aed', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 8 }}>
                Recién llegados
              </p>
              <h2
                style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 800, color: '#f0f6ff' }}
              >
                Nuevos lanzamientos
                <span className="badge badge-new" style={{ marginLeft: 12, verticalAlign: 'middle', fontSize: '0.7rem' }}>
                  Nuevo
                </span>
              </h2>
            </div>
            <Link to="/catalog?filter=new" className="btn-ghost hidden sm:flex" style={{ padding: '10px 20px', fontSize: '0.85rem' }}>
              Ver novedades →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5">
            {newArrivals.map(product => (
              <Link key={product.id} to={`/product/${product.id}`} style={{ textDecoration: 'none', display: 'block' }}>
                <ProductCard {...product} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          DUAL PROMO CARDS
      ══════════════════════════════════════════════════ */}
      <section style={{ padding: '0 0 80px' }}>
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Card 1: Gaming */}
            <div style={{
              borderRadius: 20,
              overflow: 'hidden',
              position: 'relative',
              minHeight: 240,
              display: 'flex',
              alignItems: 'center',
              padding: '36px 32px',
              background: 'linear-gradient(135deg, #0a0f1e 0%, #1a0d2e 50%, #0d1527 100%)',
              border: '1px solid rgba(124,58,237,0.25)',
            }}>
              <div className="orb orb-purple" style={{ width: 250, height: 250, top: -80, right: -60, opacity: 0.4 }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <span style={{
                  fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.15em', color: '#a78bfa',
                  textTransform: 'uppercase', display: 'block', marginBottom: 12,
                }}>
                  🎮 Gaming Setup
                </span>
                <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.6rem', fontWeight: 800, color: '#f0f6ff', marginBottom: 10 }}>
                  PC Gamer RTX 4080<br />desde{' '}
                  <span style={{ color: '#a78bfa' }}>$8.9M</span>
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: 20, maxWidth: 280 }}>
                  Juega en 4K ultra con el mejor rendimiento relación precio/potencia.
                </p>
                <Link to="/catalog?cat=Computadores" className="btn-ghost" style={{ padding: '10px 24px' }}>
                  Ver computadores gaming →
                </Link>
              </div>
              <div style={{ position: 'absolute', right: 24, bottom: 16, fontSize: '5rem', opacity: 0.15 }}>🖥️</div>
            </div>

            {/* Card 2: Componentes */}
            <div style={{
              borderRadius: 20,
              overflow: 'hidden',
              position: 'relative',
              minHeight: 240,
              display: 'flex',
              alignItems: 'center',
              padding: '36px 32px',
              background: 'linear-gradient(135deg, #0a1a14 0%, #0d1f1a 50%, #0a150f 100%)',
              border: '1px solid rgba(16,185,129,0.2)',
            }}>
              <div className="orb" style={{
                width: 250, height: 250, top: -80, right: -60, opacity: 0.35,
                background: 'radial-gradient(circle, rgba(16,185,129,0.3) 0%, transparent 70%)',
              }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <span style={{
                  fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.15em', color: '#34d399',
                  textTransform: 'uppercase', display: 'block', marginBottom: 12,
                }}>
                  🔧 Armá tu PC
                </span>
                <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.6rem', fontWeight: 800, color: '#f0f6ff', marginBottom: 10 }}>
                  Componentes top<br />GPU desde{' '}
                  <span style={{ color: '#34d399' }}>$520.000</span>
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: 20, maxWidth: 280 }}>
                  Procesadores, GPUs, SSD, RAM y placas base para el build perfecto.
                </p>
                <Link to="/catalog?cat=Componentes" className="btn-ghost" style={{ padding: '10px 24px' }}>
                  Ver componentes →
                </Link>
              </div>
              <div style={{ position: 'absolute', right: 24, bottom: 16, fontSize: '5rem', opacity: 0.15 }}>⚡</div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          WHY US — FEATURES
      ══════════════════════════════════════════════════ */}
      <section style={{
        padding: '80px 0',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        background: 'rgba(255,255,255,0.01)',
      }}>
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p style={{ fontSize: '0.72rem', color: '#00c8ff', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 8 }}>
              ¿Por qué TechCore?
            </p>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 800, color: '#f0f6ff' }}>
              La experiencia de compra perfecta
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map(f => (
              <div
                key={f.title}
                style={{
                  background: f.color,
                  border: `1px solid ${f.border}`,
                  borderRadius: 16,
                  padding: '28px 24px',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                }}
                className="group card-hover"
              >
                <div className="feature-icon" style={{ background: f.color, border: `1px solid ${f.border}`, marginBottom: 16 }}>
                  {f.icon}
                </div>
                <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: '#f0f6ff', fontSize: '1rem', marginBottom: 8 }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#4b5563', lineHeight: 1.65 }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          CTA FINAL
      ══════════════════════════════════════════════════ */}
      <section style={{ padding: '100px 0', position: 'relative', overflow: 'hidden' }}>
        <div className="orb orb-purple" style={{ width: 500, height: 500, left: -150, top: '50%', transform: 'translateY(-50%)', opacity: 0.25 }} />
        <div className="orb orb-cyan"   style={{ width: 400, height: 400, right: -100, top: '50%', transform: 'translateY(-50%)', opacity: 0.2 }} />

        <div
          className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
          style={{ textAlign: 'center' }}
        >
          {/* Grid decoration */}
          <div className="circuit-pattern absolute inset-0 opacity-5" />

          <span style={{
            display: 'inline-block',
            background: 'rgba(0,200,255,0.08)',
            border: '1px solid rgba(0,200,255,0.2)',
            borderRadius: 50,
            padding: '6px 20px',
            fontSize: '0.78rem',
            fontWeight: 700,
            color: '#00c8ff',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: 24,
          }}>
            🚀 Únete a más de 45.000 clientes satisfechos
          </span>

          <h2 style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 800,
            color: '#f0f6ff',
            marginBottom: 20,
            lineHeight: 1.1,
            maxWidth: 700,
            margin: '0 auto 20px',
          }}>
            ¿Listo para llevar tu setup al{' '}
            <span style={{
              background: 'linear-gradient(135deg, #00c8ff, #7c3aed)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              siguiente nivel?
            </span>
          </h2>

          <p style={{ color: '#64748b', fontSize: '1.05rem', lineHeight: 1.7, maxWidth: 520, margin: '0 auto 40px' }}>
            Crea tu cuenta gratis y accede a precios exclusivos, notificaciones de stock y financiación especial para clientes registrados.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center' }}>
            {!isAuthenticated && (
              <Link to="/register" className="btn-primary animate-pulse-glow" style={{ padding: '16px 40px', fontSize: '1rem' }}>
                Crear cuenta gratis
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            )}
            <Link to="/catalog" className="btn-ghost" style={{ padding: '16px 36px', fontSize: '1rem' }}>
              Explorar catálogo
            </Link>
          </div>

          {/* Trust line */}
          <p style={{ marginTop: 28, fontSize: '0.78rem', color: '#374151' }}>
            ✓ Sin costo de registro &nbsp;·&nbsp; ✓ Sin spam &nbsp;·&nbsp; ✓ Cancela cuando quieras
          </p>
        </div>
      </section>

    </Layout>
  );
}
