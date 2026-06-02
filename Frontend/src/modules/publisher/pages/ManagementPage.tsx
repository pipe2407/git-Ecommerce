// EC-009 — Gestión de publicaciones del vendedor
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../../shared/components/Layout';
import { MOCK_PRODUCTS } from '../../../shared/mockData';

type ListingStatus = 'activo' | 'pausado' | 'agotado';

interface Listing {
  id: number;
  name: string;
  image: string;
  price: number;
  category: string;
  stock: number;
  sales: number;
  status: ListingStatus;
}

const INITIAL_LISTINGS: Listing[] = MOCK_PRODUCTS.slice(0, 5).map((p, i) => ({
  id: p.id,
  name: p.name,
  image: p.image,
  price: p.price,
  category: p.category,
  stock: p.inStock ? (i === 1 ? 3 : Math.floor(Math.random() * 20) + 5) : 0,
  sales: Math.floor(Math.random() * 100) + 10,
  status: p.inStock ? (i % 3 === 0 ? 'pausado' : 'activo') : 'agotado',
}));

const STATUS_CONFIG: Record<ListingStatus, { label: string; badge: string }> = {
  activo:  { label: 'Activo',   badge: 'badge-success' },
  pausado: { label: 'Pausado',  badge: 'badge-warning' },
  agotado: { label: 'Agotado', badge: 'badge-danger'  },
};

export default function ManagementPage() {
  const [listings, setListings] = useState<Listing[]>(INITIAL_LISTINGS);
  const [filter, setFilter] = useState<ListingStatus | 'todos'>('todos');

  const toggleStatus = (id: number) => {
    setListings(prev => prev.map(l =>
      l.id === id
        ? { ...l, status: l.status === 'activo' ? 'pausado' : 'activo' }
        : l
    ));
  };

  const deleteListing = (id: number) => {
    setListings(prev => prev.filter(l => l.id !== id));
  };

  const filtered = filter === 'todos' ? listings : listings.filter(l => l.status === filter);

  const totalSales = listings.reduce((a, l) => a + l.sales, 0);
  const totalRevenue = listings.reduce((a, l) => a + l.sales * l.price, 0);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Mis Publicaciones
            </h1>
            <p className="text-slate-500 mt-1">{listings.length} productos publicados</p>
          </div>
          <Link to="/publish" className="btn-primary px-5 py-2.5 text-sm">
            + Nueva publicación
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Publicaciones', value: listings.length, icon: '📦', badge: 'badge-primary' },
            { label: 'Activos', value: listings.filter(l => l.status === 'activo').length, icon: '✅', badge: 'badge-success' },
            { label: 'Total ventas', value: totalSales + ' uds.', icon: '📈', badge: 'badge-cyan' },
            { label: 'Ingresos est.', value: '$' + (totalRevenue / 1000000).toFixed(1) + 'M', icon: '💰', badge: 'badge-warning' },
          ].map(s => (
            <div key={s.label} className="glass rounded-2xl p-4 text-center card-hover">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-xl font-bold text-white">{s.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {(['todos', 'activo', 'pausado', 'agotado'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all border capitalize ${
                filter === f
                  ? 'gradient-bg text-white border-transparent'
                  : 'border-white/[0.1] text-slate-400 hover:text-white'
              }`}
            >
              {f === 'todos' ? 'Todos' : STATUS_CONFIG[f].label}
            </button>
          ))}
        </div>

        {/* Table (desktop) / Cards (mobile) */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">📭</div>
            <h3 className="text-xl font-bold text-white mb-2">Sin publicaciones</h3>
            <p className="text-slate-500 mb-6">No tienes publicaciones en este estado</p>
            <Link to="/publish" className="btn-primary">+ Publicar ahora</Link>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block glass rounded-2xl overflow-hidden">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Categoría</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Ventas</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(l => {
                    const cfg = STATUS_CONFIG[l.status];
                    return (
                      <tr key={l.id}>
                        <td>
                          <div className="flex items-center gap-3">
                            <img
                              src={l.image}
                              alt={l.name}
                              className="w-10 h-10 rounded-lg object-cover"
                              onError={e => { (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${l.id}/80/80`; }}
                            />
                            <span className="text-slate-200 font-medium line-clamp-1 max-w-[220px]">{l.name}</span>
                          </div>
                        </td>
                        <td><span className="badge badge-primary">{l.category}</span></td>
                        <td className="text-white font-semibold">${l.price.toLocaleString('es-CO')}</td>
                        <td className={l.stock === 0 ? 'text-red-400' : l.stock <= 3 ? 'text-yellow-400' : 'text-slate-300'}>
                          {l.stock} uds.
                        </td>
                        <td>{l.sales} ventas</td>
                        <td><span className={`badge ${cfg.badge}`}>{cfg.label}</span></td>
                        <td>
                          <div className="flex gap-2">
                            {l.status !== 'agotado' && (
                              <button
                                onClick={() => toggleStatus(l.id)}
                                className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${
                                  l.status === 'activo'
                                    ? 'border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10'
                                    : 'border-green-500/30 text-green-400 hover:bg-green-500/10'
                                }`}
                              >
                                {l.status === 'activo' ? 'Pausar' : 'Activar'}
                              </button>
                            )}
                            <button
                              onClick={() => deleteListing(l.id)}
                              className="text-xs font-medium px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all"
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-4">
              {filtered.map(l => {
                const cfg = STATUS_CONFIG[l.status];
                return (
                  <div key={l.id} className="glass rounded-2xl p-4">
                    <div className="flex gap-3 mb-3">
                      <img
                        src={l.image}
                        alt={l.name}
                        className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                        onError={e => { (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${l.id}/80/80`; }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white line-clamp-2">{l.name}</p>
                        <span className={`badge ${cfg.badge} mt-1`}>{cfg.label}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center mb-3">
                      <div className="glass rounded-lg p-2">
                        <p className="text-xs text-slate-500">Precio</p>
                        <p className="text-sm font-bold text-white">${(l.price / 1000).toFixed(0)}K</p>
                      </div>
                      <div className="glass rounded-lg p-2">
                        <p className="text-xs text-slate-500">Stock</p>
                        <p className={`text-sm font-bold ${l.stock === 0 ? 'text-red-400' : 'text-white'}`}>{l.stock}</p>
                      </div>
                      <div className="glass rounded-lg p-2">
                        <p className="text-xs text-slate-500">Ventas</p>
                        <p className="text-sm font-bold text-white">{l.sales}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {l.status !== 'agotado' && (
                        <button
                          onClick={() => toggleStatus(l.id)}
                          className="flex-1 btn-ghost text-xs py-2"
                        >
                          {l.status === 'activo' ? 'Pausar' : 'Activar'}
                        </button>
                      )}
                      <button onClick={() => deleteListing(l.id)} className="btn-danger text-xs flex-1">
                        Eliminar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
