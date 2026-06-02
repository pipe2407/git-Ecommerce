// EC-006 — Proceso de checkout (sin backend)
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../../shared/components/Layout';

type Step = 1 | 2 | 3;

const PAYMENT_METHODS = [
  { id: 'card', label: 'Tarjeta de crédito/débito', icon: '💳' },
  { id: 'pse', label: 'PSE — Débito bancario', icon: '🏦' },
  { id: 'nequi', label: 'Nequi', icon: '📱' },
  { id: 'efecty', label: 'Efecty', icon: '💵' },
];

export default function CheckoutPage() {
  const [step, setStep] = useState<Step>(1);
  const [payMethod, setPayMethod] = useState('card');
  const [placing, setPlacing] = useState(false);

  // Shipping form state
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '',
    address: '', city: '', department: '', zip: '',
  });

  const [cardForm, setCardForm] = useState({
    number: '', name: '', expiry: '', cvv: '',
  });

  const updateForm = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const updateCard = (field: keyof typeof cardForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setCardForm(prev => ({ ...prev, [field]: e.target.value }));

  const shippingComplete = Object.values(form).every(v => v.trim() !== '');

  const handleOrder = () => {
    setPlacing(true);
    setTimeout(() => {
      setPlacing(false);
      setStep(3);
    }, 1800);
  };

  const ORDER_ID = `ORD-${Date.now().toString().slice(-6)}`;
  const TOTAL = '$7.065.000';

  const StepBadge = ({ n, label }: { n: Step; label: string }) => (
    <div className={`flex items-center gap-2 text-sm font-medium transition-all ${
      step === n ? 'text-white' : step > n ? 'text-green-400' : 'text-slate-600'
    }`}>
      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border transition-all ${
        step > n
          ? 'border-green-400 bg-green-400/20 text-green-400'
          : step === n
            ? 'border-purple-400 bg-purple-400/20 text-purple-400'
            : 'border-slate-700 text-slate-600'
      }`}>
        {step > n ? '✓' : n}
      </div>
      <span className="hidden sm:inline">{label}</span>
    </div>
  );

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="flex items-center gap-3 mb-10">
          <Link to="/cart" className="text-slate-500 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Finalizar compra
          </h1>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center gap-4 mb-10">
          <StepBadge n={1} label="Envío" />
          <div className={`flex-1 h-px transition-all ${step >= 2 ? 'bg-purple-400/30' : 'bg-white/[0.06]'}`} />
          <StepBadge n={2} label="Pago" />
          <div className={`flex-1 h-px transition-all ${step >= 3 ? 'bg-green-400/30' : 'bg-white/[0.06]'}`} />
          <StepBadge n={3} label="Confirmación" />
        </div>

        {/* ── Step 1: Shipping ── */}
        {step === 1 && (
          <div className="animate-fade-in-up">
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { field: 'fullName' as const, label: 'Nombre completo', placeholder: 'Juan Pérez', type: 'text' },
                { field: 'email' as const, label: 'Correo electrónico', placeholder: 'juan@email.com', type: 'email' },
                { field: 'phone' as const, label: 'Teléfono', placeholder: '+57 300 000 0000', type: 'tel' },
                { field: 'address' as const, label: 'Dirección', placeholder: 'Cra 10 #25-30', type: 'text' },
                { field: 'city' as const, label: 'Ciudad', placeholder: 'Bogotá', type: 'text' },
                { field: 'department' as const, label: 'Departamento', placeholder: 'Cundinamarca', type: 'text' },
              ].map(f => (
                <div key={f.field}>
                  <label className="block text-sm font-medium text-slate-300 mb-2">{f.label}</label>
                  <input
                    type={f.type}
                    value={form[f.field]}
                    onChange={updateForm(f.field)}
                    placeholder={f.placeholder}
                    className="input-field"
                  />
                </div>
              ))}
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">Código postal</label>
              <input
                type="text"
                value={form.zip}
                onChange={updateForm('zip')}
                placeholder="110111"
                className="input-field max-w-xs"
              />
            </div>

            <div className="flex justify-end mt-8">
              <button
                onClick={() => setStep(2)}
                disabled={!shippingComplete}
                className="btn-primary px-8 py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continuar al pago
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* ── Step 2: Payment ── */}
        {step === 2 && (
          <div className="animate-fade-in-up max-w-lg mx-auto">
            <h2 className="text-xl font-bold text-white mb-6">Método de pago</h2>

            <div className="space-y-3 mb-8">
              {PAYMENT_METHODS.map(m => (
                <label
                  key={m.id}
                  className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer border transition-all ${
                    payMethod === m.id
                      ? 'border-purple-500/50 bg-purple-500/10'
                      : 'glass hover:border-white/20'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={m.id}
                    checked={payMethod === m.id}
                    onChange={() => setPayMethod(m.id)}
                    className="accent-purple-500"
                  />
                  <span className="text-xl">{m.icon}</span>
                  <span className="text-sm font-medium text-slate-200">{m.label}</span>
                </label>
              ))}
            </div>

            {/* Card form */}
            {payMethod === 'card' && (
              <div className="glass rounded-2xl p-6 space-y-4 mb-6 animate-fade-in">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Número de tarjeta</label>
                  <input
                    type="text"
                    value={cardForm.number}
                    onChange={updateCard('number')}
                    placeholder="4242 4242 4242 4242"
                    maxLength={19}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Nombre en la tarjeta</label>
                  <input
                    type="text"
                    value={cardForm.name}
                    onChange={updateCard('name')}
                    placeholder="JUAN PÉREZ"
                    className="input-field"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Vencimiento</label>
                    <input
                      type="text"
                      value={cardForm.expiry}
                      onChange={updateCard('expiry')}
                      placeholder="MM/AA"
                      maxLength={5}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">CVV</label>
                    <input
                      type="password"
                      value={cardForm.cvv}
                      onChange={updateCard('cvv')}
                      placeholder="•••"
                      maxLength={4}
                      className="input-field"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Total */}
            <div className="glass rounded-xl p-4 flex items-center justify-between mb-6">
              <span className="text-slate-400">Total a pagar</span>
              <span className="text-2xl font-bold gradient-text">{TOTAL}</span>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="btn-ghost px-6">
                ← Volver
              </button>
              <button
                onClick={handleOrder}
                disabled={placing}
                className="btn-primary flex-1 py-4 disabled:opacity-70"
              >
                {placing ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Procesando pago...
                  </>
                ) : (
                  <>
                    🔒 Pagar {TOTAL}
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Confirmation ── */}
        {step === 3 && (
          <div className="animate-fade-in-up text-center max-w-md mx-auto py-10">
            <div className="w-20 h-20 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
              <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              ¡Pedido confirmado!
            </h2>
            <p className="text-slate-400 mb-2">Gracias por tu compra.</p>
            <p className="text-slate-500 text-sm mb-6">
              Tu número de pedido es{' '}
              <span className="font-bold text-purple-400">{ORDER_ID}</span>
            </p>
            <p className="text-slate-400 text-sm mb-8">
              Recibirás un correo de confirmación en <strong className="text-white">{form.email}</strong>
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/orders" className="btn-primary px-8">Ver mis pedidos</Link>
              <Link to="/catalog" className="btn-ghost px-8">Seguir comprando</Link>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
