// EC-010 — Panel de informes de ventas (Admin)

import Layout from '../../../shared/components/Layout';

const MOCK_BEST_SELLERS = [
  { id: 1, name: 'RTX 4090 OC Edition', category: 'Componentes', units: 145, revenue: '$231,855' },
  { id: 2, name: 'MacBook Pro M3 Max', category: 'Portátiles', units: 89, revenue: '$311,411' },
  { id: 3, name: 'Monitor Odyssey Neo G9', category: 'Monitores', units: 210, revenue: '$419,790' },
  { id: 4, name: 'Logitech G Pro X Superlight', category: 'Periféricos', units: 580, revenue: '$86,420' },
  { id: 5, name: 'AMD Ryzen 9 7950X3D', category: 'Componentes', units: 310, revenue: '$216,690' },
];

export default function ReportsPage() {
  return (
    <Layout>
      <div className="max-w-screen-xl mx-auto px-4 py-12 relative">
        <div className="orb orb-cyan w-96 h-96 -top-20 -left-20 opacity-20" />
        
        {/* Header con Filtros */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-10 relative z-10 gap-6">
          <div>
            <h1 className="text-3xl font-extrabold text-white mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
              Panel de <span className="gradient-text">Informes y Ventas</span>
            </h1>
            <p className="text-slate-400">
              Analíticas detalladas del rendimiento comercial y productos más vendidos.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 glass-bright px-3 py-1.5" style={{ borderRadius: 12 }}>
              <span className="text-sm text-slate-400">Desde:</span>
              <input type="date" className="bg-transparent text-white text-sm outline-none cursor-pointer" defaultValue="2023-09-01" />
            </div>
            <div className="flex items-center gap-2 glass-bright px-3 py-1.5" style={{ borderRadius: 12 }}>
              <span className="text-sm text-slate-400">Hasta:</span>
              <input type="date" className="bg-transparent text-white text-sm outline-none cursor-pointer" defaultValue="2023-10-31" />
            </div>
            <button className="btn-primary" style={{ padding: '8px 20px' }}>
              Generar Informe
            </button>
            <button className="btn-ghost" style={{ padding: '8px 16px', display: 'flex', gap: '8px' }}>
              <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              Exportar Excel
            </button>
          </div>
        </div>

        {/* Resumen Métricas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {[
            { title: 'Ingresos Totales', value: '$1,266,166', icon: '💰', trend: '+14.5%' },
            { title: 'Total Pedidos', value: '3,842', icon: '📦', trend: '+5.2%' },
            { title: 'Ticket Promedio', value: '$329.50', icon: '🧾', trend: '-1.1%' },
            { title: 'Nuevos Usuarios', value: '+840', icon: '👥', trend: '+22.4%' },
          ].map((stat, i) => (
            <div key={i} className="glass-card p-6 flex flex-col relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 text-5xl group-hover:scale-110 transition-transform duration-500">{stat.icon}</div>
              <p className="text-sm text-slate-400 font-medium mb-1 uppercase tracking-wider">{stat.title}</p>
              <h3 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{stat.value}</h3>
              <p className={`text-xs font-semibold ${stat.trend.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
                {stat.trend} <span className="text-slate-500 font-normal">vs mes anterior</span>
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Gráfico de Ventas (Mock) */}
          <div className="lg:col-span-2 glass-card p-6 flex flex-col justify-between" style={{ minHeight: 400 }}>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Tendencia de Ventas (Diarias)</h3>
              <p className="text-sm text-slate-400 mb-6">Basado en el rango de fechas seleccionado.</p>
            </div>
            {/* Visualización Simulada del Gráfico */}
            <div className="flex-1 flex items-end justify-between gap-2 mt-4 relative pt-10 border-b border-white/10 pb-2">
              <div className="absolute top-0 left-0 w-full border-t border-dashed border-white/10" style={{ top: '25%' }} />
              <div className="absolute top-0 left-0 w-full border-t border-dashed border-white/10" style={{ top: '50%' }} />
              <div className="absolute top-0 left-0 w-full border-t border-dashed border-white/10" style={{ top: '75%' }} />
              {[30, 50, 45, 80, 60, 40, 90, 100, 75, 40, 65, 85].map((h, i) => (
                <div key={i} className="w-full h-full relative group flex items-end">
                  <div 
                    className="w-full rounded-t-sm" 
                    style={{ 
                      height: `${h}%`, 
                      background: 'linear-gradient(180deg, #00c8ff 0%, rgba(0, 200, 255, 0.1) 100%)',
                      transition: 'height 1s ease-out'
                    }} 
                  />
                  {/* Tooltip Hover */}
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#0d1117] border border-white/10 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none shadow-lg">
                    ${(h * 1500).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-3 text-xs text-slate-500 font-medium">
              <span>01 Sep</span>
              <span>15 Sep</span>
              <span>30 Sep</span>
              <span>15 Oct</span>
              <span>31 Oct</span>
            </div>
          </div>

          {/* Top Productos Rendimiento */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-bold text-white mb-1">Top Productos Más Vendidos</h3>
            <p className="text-sm text-slate-400 mb-6">Por volumen de ingresos.</p>

            <div className="space-y-4">
              {MOCK_BEST_SELLERS.map((product, idx) => (
                <div key={product.id} className="flex items-center gap-4 p-3 rounded-xl border border-white/5 hover:bg-white/[0.02] transition-colors">
                  <div className="w-8 h-8 rounded bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center font-bold text-slate-300 border border-white/10 shrink-0">
                    #{idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{product.name}</p>
                    <p className="text-xs text-slate-500">{product.category}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-[#00c8ff]">{product.revenue}</p>
                    <p className="text-xs text-emerald-400">{product.units} uds</p>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-6 btn-ghost text-xs">
              Ver reporte completo de inventario
            </button>
          </div>

        </div>
      </div>
    </Layout>
  );
}
