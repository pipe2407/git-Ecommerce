// EC-007 — Historial de pedidos del usuario
import Layout from '../../../shared/components/Layout';
import { MOCK_ORDERS } from '../../../shared/mockData';
import type { Order } from '../../../shared/mockData';
import { Link } from 'react-router-dom';

const STATUS_CONFIG: Record<Order['status'], { label: string; badge: string; icon: string }> = {
  entregado:  { label: 'Entregado',   badge: 'badge-success', icon: '✅' },
  en_camino:  { label: 'En camino',   badge: 'badge-cyan',    icon: '🚚' },
  procesando: { label: 'Procesando',  badge: 'badge-warning', icon: '⏳' },
  cancelado:  { label: 'Cancelado',   badge: 'badge-danger',  icon: '❌' },
};

export default function HistoryPage() {
  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Mis Pedidos
            </h1>
            <p className="text-slate-500 mt-1">{MOCK_ORDERS.length} pedidos en tu historial</p>
          </div>
          <Link to="/catalog" className="btn-ghost text-sm px-5 py-2.5">
            Seguir comprando
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total pedidos', value: MOCK_ORDERS.length, icon: '📦' },
            { label: 'Entregados',    value: MOCK_ORDERS.filter(o => o.status === 'entregado').length, icon: '✅' },
            { label: 'En camino',     value: MOCK_ORDERS.filter(o => o.status === 'en_camino').length, icon: '🚚' },
            {
              label: 'Total gastado',
              value: `$${MOCK_ORDERS.reduce((a, o) => a + o.total, 0).toLocaleString('es-CO')}`,
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

        {/* Orders list */}
        <div className="space-y-4">
          {MOCK_ORDERS.map(order => {
            const cfg = STATUS_CONFIG[order.status];
            return (
              <div key={order.id} className="glass rounded-2xl overflow-hidden card-hover">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-white/[0.05]">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-sm text-slate-500 font-medium">Pedido</p>
                      <p className="text-white font-bold">{order.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Fecha</p>
                      <p className="text-slate-300 text-sm">
                        {new Date(order.date).toLocaleDateString('es-CO', { day: '2-digit', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`badge ${cfg.badge}`}>
                      {cfg.icon} {cfg.label}
                    </span>
                    <span className="text-white font-bold text-lg">
                      ${order.total.toLocaleString('es-CO')}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="px-5 py-4">
                  {order.items.map(item => (
                    <div key={item.name} className="flex items-center justify-between text-sm py-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-purple-400 opacity-60" />
                        <span className="text-slate-300">{item.name}</span>
                        <span className="text-slate-600">×{item.qty}</span>
                      </div>
                      <span className="text-slate-400">${item.price.toLocaleString('es-CO')}</span>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="px-5 py-3 border-t border-white/[0.05] flex flex-wrap gap-2">
                  {order.status === 'entregado' && (
                    <button className="btn-ghost text-xs py-2 px-4">
                      Dejar reseña
                    </button>
                  )}
                  {order.status === 'en_camino' && (
                    <button className="btn-ghost text-xs py-2 px-4">
                      🗺️ Rastrear envío
                    </button>
                  )}
                  <button className="btn-ghost text-xs py-2 px-4">
                    Ver detalles
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
