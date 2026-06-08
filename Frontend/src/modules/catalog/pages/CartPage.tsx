// EC-005 — Carrito de compras
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../../../shared/components/Layout';
import { useCarritoStore } from '../../../stores/carritoStore';

const getImageUrl = (imagen: string | null | undefined, productoId: string) => {
  if (imagen?.startsWith('data:')) return imagen;
  if (imagen) return imagen;
  return `https://picsum.photos/seed/${productoId}/200/200`;
};

export default function CartPage() {
  const navigate = useNavigate();
  const items = useCarritoStore((s) => s.items);
  const actualizarCantidad = useCarritoStore((s) => s.actualizarCantidad);
  const removerProducto = useCarritoStore((s) => s.removerProducto);

  const updateQty = (productoId: string, qty: number) => {
    if (qty < 1) return;
    actualizarCantidad(productoId, qty);
  };

  const remove = (productoId: string) => {
    removerProducto(productoId);
  };

  const subtotal = items.reduce((acc, i) => acc + i.precio * i.cantidad, 0);
  const shipping = subtotal >= 200000 ? 0 : 15000;
  const total = subtotal + shipping;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-white mb-8" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          Mi Carrito
          <span className="ml-3 text-lg font-normal text-slate-500">({items.length} productos)</span>
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-7xl mb-4">🛒</div>
            <h3 className="text-2xl font-bold text-white mb-2">Tu carrito está vacío</h3>
            <p className="text-slate-400 mb-8">Agrega productos desde el catálogo</p>
            <Link to="/catalog" className="btn-primary px-8">Ver catálogo</Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.productoId} className="glass rounded-2xl p-4 flex gap-4 animate-fade-in">
                  <Link to={`/product/${item.productoId}`}>
                    <img
                      src={getImageUrl(item.imagen, item.productoId)}
                      alt={item.nombre}
                      className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-xl flex-shrink-0 hover:scale-105 transition-transform"
                      onError={e => { (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${item.productoId}/200/200`; }}
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <Link to={`/product/${item.productoId}`}>
                        <h3 className="text-sm sm:text-base font-semibold text-white line-clamp-2 hover:text-purple-400 transition-colors">
                          {item.nombre}
                        </h3>
                      </Link>
                      <button
                        onClick={() => remove(item.productoId)}
                        className="text-slate-600 hover:text-red-400 transition-colors flex-shrink-0"
                        aria-label="Eliminar"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Qty */}
                      <div className="flex items-center glass rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQty(item.productoId, item.cantidad - 1)}
                          className="px-3 py-1.5 text-slate-400 hover:text-white transition-colors text-lg"
                        >
                          −
                        </button>
                        <span className="px-3 py-1.5 text-white font-semibold text-sm min-w-[32px] text-center">{item.cantidad}</span>
                        <button
                          onClick={() => updateQty(item.productoId, item.cantidad + 1)}
                          className="px-3 py-1.5 text-slate-400 hover:text-white transition-colors text-lg"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-white font-bold text-base">
                        ${(item.precio * item.cantidad).toLocaleString('es-CO')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="glass rounded-2xl p-6 sticky top-20">
                <h2 className="text-lg font-bold text-white mb-6" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Resumen del pedido
                </h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Subtotal</span>
                    <span className="text-white">${subtotal.toLocaleString('es-CO')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Envío</span>
                    <span className={shipping === 0 ? 'text-green-400' : 'text-white'}>
                      {shipping === 0 ? 'Gratis' : `$${shipping.toLocaleString('es-CO')}`}
                    </span>
                  </div>
                  {shipping === 0 && (
                    <p className="text-xs text-green-400">🎉 ¡Envío gratis en tu pedido!</p>
                  )}

                  <div className="h-px bg-white/[0.06] my-2" />

                  <div className="flex justify-between text-lg">
                    <span className="font-semibold text-white">Total</span>
                    <span className="font-bold gradient-text">${total.toLocaleString('es-CO')}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/checkout')}
                  className="btn-primary w-full py-4 mt-6 text-base"
                >
                  Proceder al pago
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>

                <Link to="/catalog" className="block text-center text-sm text-slate-500 hover:text-slate-300 transition-colors mt-4">
                  ← Continuar comprando
                </Link>

                {/* Accepted payments */}
                <div className="mt-6 pt-5 border-t border-white/[0.06]">
                  <p className="text-xs text-slate-600 text-center mb-3">Métodos de pago aceptados</p>
                  <div className="flex justify-center gap-2 flex-wrap">
                    {['Visa', 'MC', 'PSE', 'Nequi'].map(m => (
                      <span key={m} className="px-2.5 py-1 glass rounded-lg text-xs text-slate-400 font-medium">{m}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
