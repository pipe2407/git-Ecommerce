// EC-007 — Historial de órdenes del usuario
import { useEffect, useState } from 'react';
import Layout from '../../../shared/components/Layout';
import { Link } from 'react-router-dom';
import { useOrdenesStore } from '../../../stores/ordenesStore';

const STATUS_CONFIG: Record<string, { label: string; badge: string; icon: string }> = {
  pendiente:  { label: 'Pendiente',   badge: 'badge-warning', icon: '⏳' },
  procesando: { label: 'Procesando',  badge: 'badge-warning', icon: '⏳' },
  enviado:    { label: 'En camino',   badge: 'badge-cyan',    icon: '🚚' },
  entregado:  { label: 'Entregado',   badge: 'badge-success', icon: '✅' },
  cancelado:  { label: 'Cancelado',   badge: 'badge-danger',  icon: '❌' },
};

export default function HistoryPage() {
  const [detallesAbiertoId, setDetallesAbiertoId] = useState<string | null>(null);
  const ordenes = useOrdenesStore((s) => s.ordenes);
  const fetchMisOrdenes = useOrdenesStore((s) => s.fetchMisOrdenes);
  const loading = useOrdenesStore((s) => s.loading);

  useEffect(() => {
    fetchMisOrdenes();
  }, [fetchMisOrdenes]);

  if (loading) {
    return (
      <Layout>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
          <p className="text-slate-400">Cargando órdenes...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Mis Pedidos
            </h1>
            <p className="text-slate-500 mt-1">{ordenes.length} pedido{ordenes.length !== 1 ? 's' : ''} en tu historial</p>
          </div>
          <Link to="/catalog" className="btn-ghost text-sm px-5 py-2.5">
            Seguir comprando
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total pedidos', value: ordenes.length, icon: '📦' },
            { label: 'Entregados',    value: ordenes.filter(o => o.estado === 'entregado').length, icon: '✅' },
            { label: 'En camino',     value: ordenes.filter(o => o.estado === 'enviado').length, icon: '🚚' },
            {
              label: 'Total gastado',
              value: `$${ordenes.reduce((a, o) => a + o.precioTotal, 0).toLocaleString('es-CO')}`,
              icon: '💰',
            },
          ].map(s => (
            <div key={s.label} className="glass rounded-2xl p-4 text-center card-hover">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-xl font-bold text-white">{s.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {ordenes.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-2xl font-bold text-white mb-2">No tienes órdenes aún</h3>
            <p className="text-slate-400 mb-8">Comienza comprando en nuestro catálogo</p>
            <Link to="/catalog" className="btn-primary px-8 py-3">Ir al catálogo</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {ordenes.map(orden => {
              const cfg = STATUS_CONFIG[orden.estado] || STATUS_CONFIG['pendiente'];
              return (
                <div key={orden.id} className="glass rounded-2xl overflow-hidden card-hover">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-white/[0.05]">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-sm text-slate-500 font-medium">Pedido</p>
                        <p className="text-white font-bold">#{orden.id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Fecha</p>
                        <p className="text-slate-300 text-sm">
                          {new Date(orden.fechaCreacion).toLocaleDateString('es-CO', { day: '2-digit', month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`badge ${cfg.badge}`}>
                        {cfg.icon} {cfg.label}
                      </span>
                      <span className="text-white font-bold text-lg">
                        ${orden.precioTotal.toLocaleString('es-CO')}
                      </span>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="px-5 py-4">
                    <div className="flex items-center justify-between text-sm py-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-purple-400 opacity-60" />
                        <span className="text-slate-300">{orden.producto.nombre}</span>
                        <span className="text-slate-600">×{orden.cantidad}</span>
                      </div>
                      <span className="text-slate-400">${orden.producto.precio.toLocaleString('es-CO')}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="px-5 py-3 border-t border-white/[0.05] flex flex-wrap gap-2">
                    {orden.estado === 'entregado' && (
                      <button className="btn-ghost text-xs py-2 px-4">
                        Dejar reseña
                      </button>
                    )}
                    {orden.estado === 'enviado' && (
                      <button className="btn-ghost text-xs py-2 px-4">
                        🗺️ Rastrear envío
                      </button>
                    )}
                    <button
                      onClick={() => setDetallesAbiertoId(detallesAbiertoId === orden.id ? null : orden.id)}
                      className="btn-ghost text-xs py-2 px-4">
                      {detallesAbiertoId === orden.id ? 'Ocultar detalles' : 'Ver detalles'}
                    </button>
                  </div>

                  {/* Detalles expandibles */}
                  {detallesAbiertoId === orden.id && (
                    <div className="px-5 py-4 bg-white/[0.02] border-t border-white/[0.05] space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-slate-500 text-xs uppercase">Comprador</p>
                          <p className="text-white font-medium">{orden.comprador.nombre}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 text-xs uppercase">Email</p>
                          <p className="text-white font-medium">{orden.comprador.email}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 text-xs uppercase">Producto</p>
                          <p className="text-white font-medium">{orden.producto.nombre}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 text-xs uppercase">Cantidad</p>
                          <p className="text-white font-medium">{orden.cantidad} unidad(es)</p>
                        </div>
                        <div>
                          <p className="text-slate-500 text-xs uppercase">Precio Unitario</p>
                          <p className="text-white font-medium">${orden.producto.precio.toLocaleString('es-CO')}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 text-xs uppercase">Total</p>
                          <p className="text-purple-400 font-bold">${orden.precioTotal.toLocaleString('es-CO')}</p>
                        </div>
                      </div>
                      <div className="text-sm">
                        <p className="text-slate-500 text-xs uppercase mb-1">Fecha de orden</p>
                        <p className="text-white">
                          {new Date(orden.fechaCreacion).toLocaleDateString('es-CO', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
