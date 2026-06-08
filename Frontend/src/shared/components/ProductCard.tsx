// ProductCard — card premium para tech e-commerce con specs, hover effects y badges
interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  category: string;
  inStock: boolean;
  isNew?: boolean;
  isHot?: boolean;
  specs?: string[];
  brand?: string;
  onAddToCart?: (id: number) => void;
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <svg
          key={s}
          className={`w-3.5 h-3.5 ${s <= Math.round(rating) ? 'star-filled' : 'star-empty'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function ProductCard({
  id, name, price, originalPrice, image, rating, reviews,
  category, inStock, isNew, isHot, specs, brand, onAddToCart
}: ProductCardProps) {
  const discount = originalPrice ? Math.round((1 - price / originalPrice) * 100) : 0;

  return (
    <div className="product-card group">

      {/* ── IMAGE ZONE ───────────────────────────────────── */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '4/3', background: 'linear-gradient(135deg, #0d1117, #111827)' }}>
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          onError={e => {
            const t = e.target as HTMLImageElement;
            t.src = `https://picsum.photos/seed/tech${id}/400/300`;
          }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {isNew  && <span className="badge badge-new">Nuevo</span>}
          {isHot  && <span className="badge badge-hot">🔥 Hot</span>}
          {discount > 0 && <span className="badge badge-sale">-{discount}%</span>}
          {!inStock && <span className="badge badge-warning">Sin Stock</span>}
        </div>

        {/* Brand chip */}
        {brand && (
          <div className="absolute top-3 right-3">
            <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md"
              style={{ background: 'rgba(0,0,0,0.7)', color: '#00c8ff', border: '1px solid rgba(0,200,255,0.3)' }}>
              {brand}
            </span>
          </div>
        )}

        {/* Quick-add CTA */}
        <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={e => { e.preventDefault(); e.stopPropagation(); onAddToCart?.(id); }}
            disabled={!inStock}
            className={`w-full text-sm font-bold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 ${
              inStock
                ? 'btn-primary'
                : 'cursor-not-allowed'
            }`}
            style={!inStock ? { background: 'rgba(55,65,81,0.8)', color: '#6b7280' } : {}}
          >
            {inStock ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Agregar al carrito
              </>
            ) : 'Sin stock'}
          </button>
        </div>
      </div>

      {/* ── CONTENT ──────────────────────────────────────── */}
      <div className="p-4">
        {/* Category */}
        <span className="text-[10px] font-bold uppercase tracking-widest"
          style={{ color: '#00c8ff', letterSpacing: '0.1em' }}>
          {category}
        </span>

        {/* Name */}
        <h3 className="text-sm font-semibold line-clamp-2 leading-snug mt-1"
          style={{ color: '#f0f6ff', fontFamily: 'Space Grotesk, sans-serif' }}>
          {name}
        </h3>

        {/* Specs chips */}
        {specs && specs.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {specs.slice(0, 2).map(s => (
              <span key={s} className="spec-tag">{s}</span>
            ))}
          </div>
        )}

        {/* Stars */}
        <div className="flex items-center gap-2 mt-2.5">
          <Stars rating={rating} />
          <span style={{ fontSize: '0.7rem', color: '#4b5563' }}>({reviews.toLocaleString()})</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mt-3 pt-3"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div>
            <span className="text-base font-extrabold text-white"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              ${price.toLocaleString('es-CO')}
            </span>
            {originalPrice && (
              <span className="text-xs line-through ml-2" style={{ color: '#4b5563' }}>
                ${originalPrice.toLocaleString('es-CO')}
              </span>
            )}
          </div>

          {/* Wishlist */}
          <button
            onClick={e => e.preventDefault()}
            className="btn-icon"
            title="Añadir a favoritos"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
