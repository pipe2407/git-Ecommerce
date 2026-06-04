// Adaptadores entre las entidades del backend (Notificaciones) y las
// estructuras visuales existentes (Product), de modo que los componentes
// conserven el 100% de su diseño sin depender de MOCK_DATA.
import type { Product } from './mockData';
import type { Notificacion } from '../types';

// Convierte una Notificación de la API en la forma `Product` que consume
// ProductCard / CatalogPage / ProductDetailPage, sin alterar la UI.
export function notificacionToProduct(n: Notificacion): Product {
  const idNum = Number(n.id);
  return {
    id: Number.isNaN(idNum) ? 0 : idNum,
    name: n.asunto,
    price: 0,
    image: n.adjunto ?? `https://picsum.photos/seed/notif${n.id}/600/600`,
    rating: 0,
    reviews: 0,
    category: n.categoria?.nombre ?? n.tipo?.nombre ?? 'General',
    inStock: true,
    description: n.descripcion,
    sku: String(n.id),
    brand: n.estado?.nombre,
  };
}

export function notificacionesToProducts(items: Notificacion[]): Product[] {
  return items.map(notificacionToProduct);
}
