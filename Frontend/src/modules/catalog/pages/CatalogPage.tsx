// EC-004 — Catálogo de productos con filtros por categoría y búsqueda
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../../shared/components/Layout';
import ProductCard from '../../../shared/components/ProductCard';
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '../../../shared/mockData';

type SortKey = 'default' | 'price-asc' | 'price-desc' | 'rating';

const CATEGORY_ICONS: Record<string, string> = {
  'Todos': '🛡️',
  'Portátiles': '💻',
  'Computadores': '🖥️',
  'Componentes': '🔧',
  'Monitores': '🖵',
  'Periféricos': '🎧',
};

export default function CatalogPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todos');
  const [sort, setSort] = useState<SortKey>('default');
  const [cartCount, setCartCount] = useState(0);

  const filtered = useMemo(() => {
    let list = [...MOCK_PRODUCTS];
    if (category !== 'Todos') list = list.filter(p => p.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    if (sort === 'price-asc')  list.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') list.sort((a, b) => b.price - a.price);
    if (sort === 'rating')     list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [search, category, sort]);

  return (
    <Layout>
      {/* Hero banner */}
      <section className="relative py-16 px-4 overflow-hidden circuit-pattern">
        <div className="orb orb-purple w-96 h-96 -top-20 -left-20 opacity-25" />
        <div className="orb orb-cyan w-72 h-72 top-0 right-10 opacity-20" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.14em',
                textTransform: 'uppercase', color: '#00c8ff',
                background: 'rgba(0,200,255,0.1)', border: '1px solid rgba(0,200,255,0.25)',
                borderRadius: 20, padding: '4px 12px', marginBottom: 12,
              }}>
                ● LIVE &nbsp;·&nbsp; 1,847 productos disponibles
              </span>
              <h1
                className="text-4xl sm:text-5xl font-extrabold text-white mb-3"
                style={{ fontFamily: 'Space Grotesk, sans-serif', lineHeight: 1.1 }}
              >
                Nuestro <span className="gradient-text">Catálogo</span>
              </h1>
              <p className="text-slate-400 text-lg max-w-xl">
                Los mejores productos tech al mejor precio, con garantía y envío express.
              </p>
            </div>
            {/* Stat pills */}
            <div className="flex gap-3 flex-wrap">
              {[
                { label: 'Marcas', value: '50+' },
                { label: 'Reseñas', value: '18K+' },
                { label: 'Garantía', value: '1 año' },
              ].map(s => (
                <div key={s.label} className="glass-bright" style={{ padding: '10px 18px', textAlign: 'center', minWidth: 80 }}>
                  <div className="stat-number" style={{ fontSize: '1.25rem' }}>{s.value}</div>
                  <div style={{ fontSize: '0.7rem', color: '#4b5563', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Filters bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar productos..."
              className="input-field pl-10"
            />
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={e => setSort(e.target.value as SortKey)}
            className="input-field sm:w-52 bg-[#13131a] cursor-pointer"
          >
            <option value="default">Ordenar por</option>
            <option value="price-asc">Precio: menor a mayor</option>
            <option value="price-desc">Precio: mayor a menor</option>
            <option value="rating">Mejor valorados</option>
          </select>
        </div>

        {/* Category chips */}
        <div className="flex gap-2 flex-wrap mb-8">
          {MOCK_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                category === cat
                  ? 'gradient-bg text-white border-transparent shadow-lg'
                  : 'border-white/[0.1] text-slate-400 hover:text-white hover:border-white/20 hover:bg-white/[0.04]'
              }`}
            >
              <span style={{ fontSize: '0.95rem' }}>{CATEGORY_ICONS[cat] ?? '📦'}</span>
              {cat}
            </button>
          ))}
        </div>

        {/* Result count */}
        <p className="text-sm text-slate-500 mb-6">
          Mostrando <span className="text-white font-medium">{filtered.length}</span> productos
          {category !== 'Todos' && <> en <span className="text-purple-400">{category}</span></>}
        </p>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {filtered.map(product => (
              <Link key={product.id} to={`/product/${product.id}`} className="block">
                <ProductCard
                  {...product}
                  onAddToCart={(id) => {
                    setCartCount(c => c + 1);
                    console.log('Added to cart:', id, '| Total:', cartCount + 1);
                  }}
                />
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-white mb-2">Sin resultados</h3>
            <p className="text-slate-500">No encontramos productos para tu búsqueda</p>
            <button
              onClick={() => { setSearch(''); setCategory('Todos'); }}
              className="btn-ghost mt-6"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </section>
    </Layout>
  );
}
