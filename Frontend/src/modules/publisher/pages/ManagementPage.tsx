// EC-009 — Gestión de productos publicados del usuario
import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../../shared/components/Layout';
import { useProductosStore } from '../../../stores/productosStore';
import authService from '../../../services/api/authService';

const getImageUrl = (imagen: string | null | undefined, id: string) => {
  if (imagen?.startsWith('data:')) return imagen;
  if (imagen) return imagen;
  return `https://picsum.photos/seed/prod${id}/80/80`;
};

interface Listing {
  id: number;
  name: string;
  image: string;
  price: number;
  category: string;
  stock: number;
}

export default function ManagementPage() {
  const productos = useProductosStore((s) => s.productos);
  const fetchProductos = useProductosStore((s) => s.fetchProductos);
  const eliminarProducto = useProductosStore((s) => s.eliminarProducto);

  // Listar productos del usuario autenticado.
  useEffect(() => {
    fetchProductos();
  }, [fetchProductos]);

  // Mapea los productos a la forma `Listing` que consume la tabla.
  const listings: Listing[] = useMemo(
    () => {
      const usuario = authService.getStoredUser();
      const misProductos = productos.filter(p => String(p.publicador.id) === String(usuario?.id));
      return misProductos.map((p) => ({
        id: Number(p.id),
        name: p.nombre,
        image: getImageUrl(p.imagen, p.id),
        price: p.precio,
        category: p.categoria.nombre,
        stock: p.stock,
      }));
    },
    [productos]
  );

  const deleteListing = (id: number) => {
    eliminarProducto(id).catch(() => {});
  };

  const filtered = listings;
  const totalRevenue = listings.reduce((a, l) => a + l.price, 0);
  const totalStock = listings.reduce((a, l) => a + l.stock, 0);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Mis Productos
            </h1>
            <p className="text-slate-500 mt-1">{listings.length} productos publicados</p>
          </div>
          <Link to="/publish" className="btn-primary px-5 py-2.5 text-sm">
            + Publicar producto
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Publicados', value: listings.length, icon: '📦', badge: 'badge-primary' },
            { label: 'Stock total', value: totalStock + ' uds.', icon: '📊', badge: 'badge-success' },
            { label: 'Catálogo valor', value: '$' + (totalRevenue / 1000000).toFixed(1) + 'M', icon: '💰', badge: 'badge-warning' },
          ].map(s => (
            <div key={s.label} className="glass rounded-2xl p-4 text-center card-hover">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-xl font-bold text-white">{s.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Table (desktop) / Cards (mobile) */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">📭</div>
            <h3 className="text-xl font-bold text-white mb-2">Sin productos</h3>
            <p className="text-slate-500 mb-6">Publica tu primer producto ahora</p>
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
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(l => (
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
                      <td>
                        <button
                          onClick={() => deleteListing(l.id)}
                          className="text-xs font-medium px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-4">
              {filtered.map(l => (
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
                      <span className="badge badge-primary mt-1">{l.category}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="glass rounded-lg p-2 flex-1">
                      <p className="text-xs text-slate-500">Precio</p>
                      <p className="text-sm font-bold text-white">${(l.price / 1000).toFixed(0)}K</p>
                    </div>
                    <div className="glass rounded-lg p-2 flex-1">
                      <p className="text-xs text-slate-500">Stock</p>
                      <p className={`text-sm font-bold ${l.stock === 0 ? 'text-red-400' : 'text-white'}`}>{l.stock}</p>
                    </div>
                    <button onClick={() => deleteListing(l.id)} className="btn-danger text-xs">
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
