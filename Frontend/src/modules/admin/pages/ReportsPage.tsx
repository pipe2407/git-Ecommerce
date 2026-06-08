// EC-010 — Panel de informes (Admin) — conectado a /reportes

import { useEffect, useMemo, useState } from 'react';
import Layout from '../../../shared/components/Layout';
import { useReportesStore } from '../../../stores/reportesStore';
import reportesService from '../../../services/api/reportesService';
import { useProductosStore } from '../../../stores/productosStore';
import { useOrdenesStore } from '../../../stores/ordenesStore';
import authService from '../../../services/api/authService';
import type { ReporteItem } from '../../../types';

export default function ReportsPage() {
  const resumen = useReportesStore((s) => s.resumen);
  const fetchResumen = useReportesStore((s) => s.fetchResumen);
  const [porTipo, setPorTipo] = useState<ReporteItem[]>([]);
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const [dateFrom, setDateFrom] = useState(firstDayOfMonth.toISOString().split('T')[0]);
  const [dateTo, setDateTo] = useState(lastDayOfMonth.toISOString().split('T')[0]);

  const productos = useProductosStore((s) => s.productos);
  const fetchProductos = useProductosStore((s) => s.fetchProductos);

  const ordenes = useOrdenesStore((s) => s.ordenes);
  const fetchMisOrdenes = useOrdenesStore((s) => s.fetchMisOrdenes);
  const fetchTodasLasOrdenes = useOrdenesStore((s) => s.fetchTodasLasOrdenes);
  const userRole = localStorage.getItem('userRole');

  useEffect(() => {
    fetchResumen();
    reportesService.getPorTipo().then(setPorTipo).catch(() => setPorTipo([]));
    fetchProductos();

    // Si es admin, traer todas las órdenes; si no, traer sus órdenes
    if (userRole === 'admin') {
      fetchTodasLasOrdenes();
    } else {
      fetchMisOrdenes();
    }
  }, [fetchResumen, fetchProductos, fetchMisOrdenes, fetchTodasLasOrdenes, userRole]);

  const handleGenerarInforme = async () => {
    try {
      fetchResumen();
      await reportesService.getPorTipo().then(setPorTipo).catch(() => setPorTipo([]));
      fetchProductos();
      if (userRole === 'admin') {
        await fetchTodasLasOrdenes();
      } else {
        await fetchMisOrdenes();
      }
    } catch (error) {
      console.error('Error al generar informe:', error);
    }
  };

  const handleExportExcel = () => {
    const data = [
      ['REPORTE DE VENTAS', '', '', '', ''],
      ['Desde:', dateFrom, 'Hasta:', dateTo, ''],
      ['', '', '', '', ''],
      ['RESUMEN GENERAL', '', '', '', ''],
      ['Métrica', 'Valor', '', '', ''],
      ['Total Notificaciones', resumen?.totalNotificaciones ?? 0, '', '', ''],
      ['Total Usuarios', resumen?.totalUsuarios ?? 0, '', '', ''],
      ['Pendientes', resumen?.pendientes ?? 0, '', '', ''],
      ['Enviadas', resumen?.enviadas ?? 0, '', '', ''],
      ['', '', '', '', ''],
      ['TOP PRODUCTOS MÁS VENDIDOS', '', '', '', ''],
      ['Posición', 'Producto', 'Categoría', 'Cantidad Vendida', 'Precio'],
      ...topVendidos.map((p, i) => [i + 1, p.nombre, p.categoria || 'N/A', p.cantidadVendida, p.precio]),
      ['', '', '', '', ''],
      ['ÓRDENES', '', '', '', ''],
      ['ID Orden', 'Producto', 'Cantidad', 'Precio Total', 'Estado'],
      ...ordenes.map(o => [o.id, o.producto.nombre, o.cantidad, o.precioTotal, o.estado]),
    ];

    const csv = data.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `reporte_ventas_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const topVendidos = useMemo(() => {
    const ventasPorProducto = new Map<number, { nombre: string; categoria?: string; precio: number; cantidad: number }>();

    const dateFromObj = new Date(dateFrom);
    const dateToObj = new Date(dateTo);

    ordenes.forEach(orden => {
      const ordenDate = new Date(orden.fechaCreacion);
      if (ordenDate >= dateFromObj && ordenDate <= dateToObj) {
        const key = Number(orden.producto.id);
        const existing = ventasPorProducto.get(key);
        if (existing) {
          existing.cantidad += orden.cantidad;
        } else {
          ventasPorProducto.set(key, {
            nombre: orden.producto.nombre,
            categoria: '',
            precio: orden.producto.precio,
            cantidad: orden.cantidad,
          });
        }
      }
    });

    return Array.from(ventasPorProducto.values())
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 5)
      .map((p, i) => ({ ...p, cantidadVendida: p.cantidad }));
  }, [ordenes, dateFrom, dateTo]);

  const ventasPorDia = useMemo(() => {
    const ventas = new Map<string, number>();
    const dates = [
      '01', '02', '03', '04', '05', '06', '07', '08', '09', '10',
      '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
      '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'
    ];

    dates.forEach(d => ventas.set(d, 0));

    const dateFromObj = new Date(dateFrom);
    const dateToObj = new Date(dateTo);

    ordenes.forEach(orden => {
      const ordenDate = new Date(orden.fechaCreacion);
      if (ordenDate >= dateFromObj && ordenDate <= dateToObj) {
        const dia = ordenDate.getDate().toString().padStart(2, '0');
        const actual = ventas.get(dia) || 0;
        ventas.set(dia, actual + Number(orden.precioTotal));
      }
    });

    return dates.map(d => ventas.get(d) || 0);
  }, [ordenes, dateFrom, dateTo]);

  // Métricas derivadas del resumen real de la API (con fallback a 0).
  const metricas = useMemo(
    () => [
      { title: 'Total Notificaciones', value: String(resumen?.totalNotificaciones ?? 0), icon: '📦', trend: '+0%' },
      { title: 'Total Usuarios', value: String(resumen?.totalUsuarios ?? 0), icon: '👥', trend: '+0%' },
      { title: 'Pendientes', value: String(resumen?.pendientes ?? 0), icon: '⏳', trend: '+0%' },
      { title: 'Enviadas', value: String(resumen?.enviadas ?? 0), icon: '✅', trend: '+0%' },
    ],
    [resumen]
  );

  // Top por tipo, adaptado a la estructura visual previa.
  const bestSellers = useMemo(
    () => porTipo.map((item, i) => ({
      id: i + 1,
      name: item.nombre,
      category: 'Notificaciones',
      units: item.total,
      revenue: String(item.total),
    })),
    [porTipo]
  );

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
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="bg-transparent text-white text-sm outline-none cursor-pointer"
              />
            </div>
            <div className="flex items-center gap-2 glass-bright px-3 py-1.5" style={{ borderRadius: 12 }}>
              <span className="text-sm text-slate-400">Hasta:</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="bg-transparent text-white text-sm outline-none cursor-pointer"
              />
            </div>
            <button
              onClick={handleGenerarInforme}
              className="btn-primary"
              style={{ padding: '8px 20px' }}>
              Generar Informe
            </button>
            <button
              onClick={handleExportExcel}
              className="btn-ghost"
              style={{ padding: '8px 16px', display: 'flex', gap: '8px' }}>
              <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              Exportar CSV
            </button>
          </div>
        </div>

        {/* Resumen Métricas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {metricas.map((stat, i) => (
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
            {/* Visualización del Gráfico con datos reales */}
            <div className="flex-1 flex items-end justify-between gap-1 mt-4 relative pt-10 border-b border-white/10 pb-2">
              <div className="absolute top-0 left-0 w-full border-t border-dashed border-white/10" style={{ top: '25%' }} />
              <div className="absolute top-0 left-0 w-full border-t border-dashed border-white/10" style={{ top: '50%' }} />
              <div className="absolute top-0 left-0 w-full border-t border-dashed border-white/10" style={{ top: '75%' }} />
              {ventasPorDia.map((valor, i) => {
                const maxValue = Math.max(...ventasPorDia, 1);
                const percentaje = (valor / maxValue) * 100 || 5;
                return (
                  <div key={i} className="w-full h-full relative group flex items-end">
                    <div
                      className="w-full rounded-t-sm"
                      style={{
                        height: `${percentaje}%`,
                        background: 'linear-gradient(180deg, #00c8ff 0%, rgba(0, 200, 255, 0.1) 100%)',
                        transition: 'height 1s ease-out',
                        minHeight: '2px'
                      }}
                    />
                    {/* Tooltip Hover */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#0d1117] border border-white/10 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none shadow-lg whitespace-nowrap">
                      ${valor.toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between mt-3 text-xs text-slate-500 font-medium">
              <span>01</span>
              <span>07</span>
              <span>14</span>
              <span>21</span>
              <span>31</span>
            </div>
          </div>

          {/* Top Productos Rendimiento */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-bold text-white mb-1">Top Productos Más Vendidos</h3>
            <p className="text-sm text-slate-400 mb-6">Por volumen de ingresos.</p>

            <div className="space-y-4">
              {topVendidos.length > 0 ? topVendidos.map((product, idx) => (
                <div key={idx} className="flex items-center gap-4 p-3 rounded-xl border border-white/5 hover:bg-white/[0.02] transition-colors">
                  <div className="w-8 h-8 rounded bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center font-bold text-slate-300 border border-white/10 shrink-0">
                    #{idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{product.nombre}</p>
                    <p className="text-xs text-slate-500">{product.categoria || 'General'}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-[#00c8ff]">${(product.precio * product.cantidadVendida).toLocaleString('es-CO', { maximumFractionDigits: 0 })}</p>
                    <p className="text-xs text-emerald-400">{product.cantidadVendida} uds</p>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-slate-400 text-center py-4">Sin datos de ventas disponibles</p>
              )}
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
