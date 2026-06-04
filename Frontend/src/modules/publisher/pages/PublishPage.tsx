// EC-008 — Publicar producto
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../../shared/components/Layout';
import { MOCK_CATEGORIES } from '../../../shared/mockData';
import { useCategoriasStore } from '../../../stores/categoriasStore';
import { useProductosStore } from '../../../stores/productosStore';

export default function PublishPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', category: '', price: '', originalPrice: '',
    description: '', sku: '', stock: '', marca: '',
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const categorias = useCategoriasStore((s) => s.categorias);
  const fetchCategorias = useCategoriasStore((s) => s.fetchCategorias);
  const crearProducto = useProductosStore((s) => s.crearProducto);

  useEffect(() => {
    fetchCategorias('productos');
  }, [fetchCategorias]);

  const categoryOptions = useMemo(
    () => (categorias.length > 0
      ? categorias.map((c) => c.nombre)
      : MOCK_CATEGORIES.filter((c) => c !== 'Todos')),
    [categorias]
  );

  const update = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setImagePreview(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const seleccionada = categorias.find((c) => c.nombre === form.category);
      await crearProducto({
        nombre: form.name,
        descripcion: form.description,
        precio: form.price,
        precioOriginal: form.originalPrice || undefined,
        categoria_id: seleccionada?.id ?? form.category,
        stock: Number(form.stock),
        sku: form.sku || undefined,
        marca: form.marca || undefined,
        imagen: imagePreview || undefined,
      });
      navigate('/management');
    } catch (error) {
      alert('Error al publicar: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const isComplete = form.name.trim() !== '' &&
    form.category.trim() !== '' &&
    form.price.trim() !== '' &&
    form.description.trim() !== '' &&
    form.stock.trim() !== '';

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Publicar producto
          </h1>
          <p className="text-slate-400 mt-1">Completa los datos para publicar en el catálogo</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image upload */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-base font-semibold text-white mb-4">Imagen del producto</h2>
            <label className="block cursor-pointer">
              {imagePreview ? (
                <div className="relative rounded-xl overflow-hidden aspect-video">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <span className="text-white font-medium">Cambiar imagen</span>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-white/10 rounded-xl aspect-video flex flex-col items-center justify-center gap-3 hover:border-purple-500/50 transition-colors">
                  <div className="w-14 h-14 rounded-full glass flex items-center justify-center">
                    <svg className="w-7 h-7 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-slate-300">Haz clic para subir imagen</p>
                    <p className="text-xs text-slate-600 mt-1">PNG, JPG, WEBP hasta 5MB</p>
                  </div>
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
            </label>
          </div>

          {/* Basic Info */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-base font-semibold text-white mb-4">Información básica</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Nombre del producto *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={update('name')}
                  placeholder="Ej: Samsung Galaxy S24 Ultra 512GB"
                  className="input-field"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Categoría *</label>
                  <select value={form.category} onChange={update('category')} className="input-field bg-[#13131a] cursor-pointer">
                    <option value="">Seleccionar...</option>
                    {categoryOptions.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Marca (opcional)</label>
                  <input
                    type="text"
                    value={form.marca}
                    onChange={update('marca')}
                    placeholder="Ej: Samsung, Apple"
                    className="input-field"
                  />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">SKU (opcional)</label>
                  <input
                    type="text"
                    value={form.sku}
                    onChange={update('sku')}
                    placeholder="Ej: SAM-S24U-512"
                    className="input-field"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Descripción *</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  placeholder="Describe las características y estado del producto..."
                  rows={4}
                  className="input-field resize-none"
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-base font-semibold text-white mb-4">Precio y stock</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Precio de venta *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                  <input
                    type="number"
                    value={form.price}
                    onChange={update('price')}
                    placeholder="0"
                    className="input-field pl-7"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Precio original (opcional)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                  <input
                    type="number"
                    value={form.originalPrice}
                    onChange={update('originalPrice')}
                    placeholder="0"
                    className="input-field pl-7"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Stock disponible *</label>
                <input
                  type="number"
                  value={form.stock}
                  onChange={update('stock')}
                  placeholder="0"
                  className="input-field"
                />
              </div>
            </div>
            {form.price && form.originalPrice && Number(form.originalPrice) > Number(form.price) && (
              <p className="text-sm text-green-400 mt-3">
                💚 Mostrará {Math.round((1 - Number(form.price) / Number(form.originalPrice)) * 100)}% de descuento
              </p>
            )}
          </div>

          {/* Submit */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <button type="button" onClick={() => navigate('/management')} className="btn-ghost px-8">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!isComplete || loading}
              className="btn-primary px-8 py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Publicando...
                </>
              ) : '🚀 Publicar producto'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
