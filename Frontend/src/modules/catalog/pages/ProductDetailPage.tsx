// EC-004b — Detalle del producto
import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Layout from '../../../shared/components/Layout';
import { useProductosStore } from '../../../stores/productosStore';
import { useCarritoStore } from '../../../stores/carritoStore';
import type { Product } from '../../../shared/mockData';

const getImageUrl = (imagen: string | null | undefined, id: string | number) => {
  if (imagen?.startsWith('data:')) return imagen;
  if (imagen) return imagen;
  return `https://picsum.photos/seed/prod${id}/600/600`;
};

function Stars({ rating, large }: { rating: number; large?: boolean }) {
  const size = large ? 'w-5 h-5' : 'w-4 h-4';
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(s => (
        <svg key={s} className={`${size} ${s <= Math.round(rating) ? 'star-filled' : 'star-empty'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const productoDetalle = useProductosStore((s) => s.productoDetalle);
  const fetchProducto = useProductosStore((s) => s.fetchProducto);
  const productos = useProductosStore((s) => s.productos);
  const loading = useProductosStore((s) => s.loading);

  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const agregarAlCarrito = useCarritoStore((s) => s.agregarProducto);

  useEffect(() => {
    if (id) fetchProducto(id);
  }, [id, fetchProducto]);

  const product: Product | null = productoDetalle ? {
    id: Number(productoDetalle.id),
    name: productoDetalle.nombre,
    price: productoDetalle.precio,
    originalPrice: productoDetalle.precioOriginal,
    image: getImageUrl(productoDetalle.imagen, productoDetalle.id),
    rating: 0,
    reviews: 0,
    category: productoDetalle.categoria.nombre,
    inStock: productoDetalle.stock > 0,
    description: productoDetalle.descripcion,
    sku: productoDetalle.sku || String(productoDetalle.id),
    brand: productoDetalle.marca,
  } : null;

  if (loading && !product) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center text-slate-400">
          Cargando...
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
          <div className="text-7xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-white mb-2">Producto no encontrado</h2>
          <p className="text-slate-400 mb-6">El producto que buscas no existe o fue eliminado.</p>
          <Link to="/catalog" className="btn-primary">Ver catálogo</Link>
        </div>
      </Layout>
    );
  }

  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
  const related = productos
    .filter(p => p.categoria.nombre === product.category && Number(p.id) !== product.id)
    .slice(0, 3)
    .map(p => ({
      id: Number(p.id),
      name: p.nombre,
      price: p.precio,
      originalPrice: p.precioOriginal,
      image: getImageUrl(p.imagen, p.id),
      rating: 0,
      reviews: 0,
      category: p.categoria.nombre,
      inStock: p.stock > 0,
      description: p.descripcion,
      sku: p.sku || String(p.id),
      brand: p.marca,
    }));

  const handleAgregarAlCarrito = () => {
    if (!product || !id) return;
    agregarAlCarrito({
      productoId: id,
      nombre: product.name,
      precio: product.price,
      cantidad: qty,
      imagen: product.image,
    });
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      navigate('/cart');
    }, 1500);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <Link to="/" className="hover:text-slate-300 transition-colors">Inicio</Link>
          <span>/</span>
          <Link to="/catalog" className="hover:text-slate-300 transition-colors">Catálogo</Link>
          <span>/</span>
          <span className="text-slate-300">{product.category}</span>
          <span>/</span>
          <span className="text-white truncate max-w-[200px]">{product.name}</span>
        </nav>

        {/* Main product */}
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
          {/* Image */}
          <div className="relative">
            <div className="glass rounded-3xl overflow-hidden aspect-square">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={e => { (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${product.id}/600/600`; }}
              />
            </div>
            {product.isNew && (
              <span className="absolute top-4 left-4 badge badge-cyan text-sm">Nuevo</span>
            )}
            {discount > 0 && (
              <span className="absolute top-4 right-4 badge badge-danger text-sm">-{discount}%</span>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <span className="badge badge-primary mb-3 w-fit">{product.category}</span>
            <h1
              className="text-2xl sm:text-3xl font-bold text-white leading-tight mb-4"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-6">
              <Stars rating={product.rating} large />
              <span className="text-white font-semibold">{product.rating}</span>
              <span className="text-slate-500 text-sm">({product.reviews.toLocaleString()} reseñas)</span>
            </div>

            {/* Price */}
            <div className="flex items-end gap-3 mb-6">
              <span className="text-4xl font-extrabold text-white">
                ${product.price.toLocaleString('es-CO')}
              </span>
              {product.originalPrice && (
                <span className="text-xl text-slate-500 line-through mb-1">
                  ${product.originalPrice.toLocaleString('es-CO')}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-slate-400 leading-relaxed mb-8">{product.description}</p>

            {/* Stock */}
            <div className={`flex items-center gap-2 text-sm font-medium mb-6 ${product.inStock ? 'text-green-400' : 'text-red-400'}`}>
              <div className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-green-400' : 'bg-red-400'}`} />
              {product.inStock ? 'En stock — listo para enviar' : 'Sin stock disponible'}
            </div>

            {/* SKU */}
            <p className="text-xs text-slate-600 mb-6">SKU: {product.sku}</p>

            {/* Qty + Actions */}
            {product.inStock && (
              <>
                <div className="flex items-center gap-4 mb-5">
                  <div className="flex items-center glass rounded-xl overflow-hidden">
                    <button
                      onClick={() => setQty(q => Math.max(1, q - 1))}
                      className="px-4 py-3 text-slate-300 hover:text-white hover:bg-white/[0.06] transition-all"
                    >
                      −
                    </button>
                    <span className="px-5 py-3 text-white font-semibold min-w-[48px] text-center">{qty}</span>
                    <button
                      onClick={() => setQty(q => q + 1)}
                      className="px-4 py-3 text-slate-300 hover:text-white hover:bg-white/[0.06] transition-all"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-slate-500 text-sm">unidades</span>
                </div>

                <button
                  onClick={handleAgregarAlCarrito}
                  disabled={added}
                  className={`btn-primary w-full py-4 text-base transition-all ${added ? 'bg-green-500' : ''}`}
                >
                  {added ? (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      ¡Agregado al carrito!
                    </>
                  ) : (
                    <>
                      🛒 Agregar al carrito
                    </>
                  )}
                </button>
              </>
            )}

            {/* Features */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              {[
                { icon: '🚚', label: 'Envío gratis', sub: 'En pedidos +$200k' },
                { icon: '🔄', label: '30 días devolución', sub: 'Garantía total' },
                { icon: '🔒', label: 'Pago seguro', sub: 'Encriptado SSL' },
                { icon: '⭐', label: 'Garantía oficial', sub: '12 meses' },
              ].map(f => (
                <div key={f.label} className="glass rounded-xl p-3 flex items-center gap-3">
                  <span className="text-2xl">{f.icon}</span>
                  <div>
                    <p className="text-xs font-semibold text-white">{f.label}</p>
                    <p className="text-xs text-slate-500">{f.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-20">
            <div className="section-divider" />
            <h2 className="text-2xl font-bold text-white mb-8" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Productos relacionados
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {related.map(p => (
                <Link key={p.id} to={`/product/${p.id}`} className="block glass rounded-2xl overflow-hidden card-hover">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full aspect-video object-cover"
                    onError={e => { (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${p.id}/400/225`; }}
                  />
                  <div className="p-3">
                    <p className="text-sm font-semibold text-white line-clamp-1">{p.name}</p>
                    <p className="text-purple-400 font-bold mt-1">${p.price.toLocaleString('es-CO')}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
