import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../../shared/components/Layout';
import { useCarritoStore } from '../../../stores/carritoStore';
import { useOrdenesStore } from '../../../stores/ordenesStore';
import authService from '../../../services/api/authService';

export default function CheckoutPage() {
  const items = useCarritoStore((s) => s.items);
  const vaciar = useCarritoStore((s) => s.vaciar);
  const crearOrden = useOrdenesStore((s) => s.crearOrden);
  const [loading, setLoading] = useState(false);
  const usuario = authService.getStoredUser();
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    nombreComprador: usuario?.nombre || '',
    emailComprador: usuario?.email || '',
    direccion: '',
    ciudad: '',
    departamento: '',
    codigoPostal: '',
    telefonoComprador: '',
    metodoPago: 'tarjeta',
    numeroTarjeta: '',
    nombreTitular: '',
    fechaVencimiento: '',
  });

  const subtotal = items.reduce((acc, i) => acc + i.precio * i.cantidad, 0);
  const shipping = subtotal >= 200000 ? 0 : 15000;
  const total = subtotal + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      for (const item of items) {
        await crearOrden({
          producto_id: item.productoId,
          cantidad: item.cantidad,
          nombreComprador: form.nombreComprador,
          emailComprador: form.emailComprador,
          direccion: form.direccion,
          ciudad: form.ciudad,
          departamento: form.departamento,
          codigoPostal: form.codigoPostal,
          telefonoComprador: form.telefonoComprador,
          metodoPago: form.metodoPago,
          numeroTarjeta: form.numeroTarjeta,
          nombreTitular: form.nombreTitular,
          fechaVencimiento: form.fechaVencimiento,
        });
      }
      vaciar();
      setSuccess(true);
    } catch (error) {
      alert('Error: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Layout>
        <div className="min-h-[70vh] flex items-center justify-center px-4">
          <div className="max-w-md text-center">
            <div className="mb-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              ¡Compra realizada!
            </h1>
            <p className="text-slate-400 mb-6">
              Tu pedido ha sido procesado exitosamente. Recibirás un correo de confirmación en <span className="text-white font-medium">{form.emailComprador}</span>
            </p>

            <div className="glass rounded-2xl p-6 mb-6">
              <div className="text-left space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Cantidad de artículos:</span>
                  <span className="text-white font-medium">{items.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total pagado:</span>
                  <span className="text-white font-medium">${total.toLocaleString('es-CO')}</span>
                </div>
                <div className="border-t border-white/10 mt-3 pt-3 flex justify-between">
                  <span className="text-slate-300">Método de pago:</span>
                  <span className="text-white font-medium">{form.metodoPago}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Link to="/catalog" className="btn-ghost flex-1">
                Seguir comprando
              </Link>
              <Link to="/orders" className="btn-primary flex-1">
                Ver mis órdenes
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (items.length === 0) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto px-4 text-center py-20">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-3xl font-bold text-white mb-2">Tu carrito está vacío</h1>
          <p className="text-slate-400 mb-8">Necesitas agregar productos para proceder</p>
          <Link to="/catalog" className="btn-primary px-8 py-3">Volver al catálogo</Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-white mb-8" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          Finalizar compra
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
            {/* Información del comprador */}
            <div className="glass rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Información del comprador</h2>
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="nombreComprador"
                    placeholder="Nombre completo"
                    value={form.nombreComprador}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                  />
                  <input
                    type="email"
                    name="emailComprador"
                    placeholder="Email"
                    value={form.emailComprador}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                  />
                </div>
                <input
                  type="tel"
                  name="telefonoComprador"
                  placeholder="Teléfono"
                  value={form.telefonoComprador}
                  onChange={handleInputChange}
                  required
                  className="input-field"
                />
              </div>
            </div>

            {/* Dirección de entrega */}
            <div className="glass rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Dirección de entrega</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  name="direccion"
                  placeholder="Dirección"
                  value={form.direccion}
                  onChange={handleInputChange}
                  required
                  className="input-field"
                />
                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="ciudad"
                    placeholder="Ciudad"
                    value={form.ciudad}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                  />
                  <input
                    type="text"
                    name="departamento"
                    placeholder="Departamento"
                    value={form.departamento}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                  />
                </div>
                <input
                  type="text"
                  name="codigoPostal"
                  placeholder="Código postal"
                  value={form.codigoPostal}
                  onChange={handleInputChange}
                  required
                  className="input-field"
                />
              </div>
            </div>

            {/* Método de pago */}
            <div className="glass rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Método de pago</h2>
              <div className="space-y-4">
                <select
                  name="metodoPago"
                  value={form.metodoPago}
                  onChange={handleInputChange}
                  className="input-field bg-[#13131a] cursor-pointer"
                >
                  <option value="tarjeta">Tarjeta de crédito/débito</option>
                  <option value="transferencia">Transferencia bancaria</option>
                  <option value="pse">PSE</option>
                </select>

                {form.metodoPago === 'tarjeta' && (
                  <>
                    <input
                      type="text"
                      name="numeroTarjeta"
                      placeholder="Número de tarjeta (16 dígitos)"
                      maxLength={19}
                      value={form.numeroTarjeta}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                    />
                    <div className="grid sm:grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="nombreTitular"
                        placeholder="Nombre del titular"
                        value={form.nombreTitular}
                        onChange={handleInputChange}
                        required
                        className="input-field"
                      />
                      <input
                        type="text"
                        name="fechaVencimiento"
                        placeholder="MM/AA"
                        maxLength={5}
                        value={form.fechaVencimiento}
                        onChange={handleInputChange}
                        required
                        className="input-field"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="w-5 h-5 animate-spin inline mr-2" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Procesando pago...
                </>
              ) : (
                `Pagar $${total.toLocaleString('es-CO')}`
              )}
            </button>
          </form>

          {/* Resumen del pedido */}
          <div className="lg:col-span-1">
            <div className="glass rounded-2xl p-6 sticky top-20">
              <h2 className="text-lg font-bold text-white mb-6" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Resumen del pedido
              </h2>

              <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.productoId} className="flex justify-between text-sm text-slate-300">
                    <span>{item.nombre} x{item.cantidad}</span>
                    <span>${(item.precio * item.cantidad).toLocaleString('es-CO')}</span>
                  </div>
                ))}
              </div>

              <div className="h-px bg-white/[0.06] mb-4" />

              <div className="space-y-3 text-sm mb-6">
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
              </div>

              <div className="h-px bg-white/[0.06] mb-4" />

              <div className="flex justify-between text-lg mb-6">
                <span className="font-semibold text-white">Total</span>
                <span className="font-bold gradient-text">${total.toLocaleString('es-CO')}</span>
              </div>

              <Link to="/cart" className="block text-center text-sm text-slate-500 hover:text-slate-300 transition-colors">
                ← Volver al carrito
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
