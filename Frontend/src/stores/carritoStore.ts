import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ItemCarrito {
  productoId: string;
  nombre: string;
  precio: number;
  cantidad: number;
  imagen?: string;
}

interface CarritoState {
  items: ItemCarrito[];
  agregarProducto: (item: ItemCarrito) => void;
  removerProducto: (productoId: string) => void;
  actualizarCantidad: (productoId: string, cantidad: number) => void;
  vaciar: () => void;
  obtenerTotal: () => number;
}

export const useCarritoStore = create<CarritoState>()(
  persist(
    (set, get) => ({
      items: [],

      agregarProducto: (item) => {
        set((state) => {
          const existe = state.items.find((i) => i.productoId === item.productoId);
          if (existe) {
            return {
              items: state.items.map((i) =>
                i.productoId === item.productoId
                  ? { ...i, cantidad: i.cantidad + item.cantidad }
                  : i
              ),
            };
          }
          return { items: [...state.items, item] };
        });
      },

      removerProducto: (productoId) => {
        set((state) => ({
          items: state.items.filter((i) => i.productoId !== productoId),
        }));
      },

      actualizarCantidad: (productoId, cantidad) => {
        if (cantidad < 1) return;
        set((state) => ({
          items: state.items.map((i) =>
            i.productoId === productoId ? { ...i, cantidad } : i
          ),
        }));
      },

      vaciar: () => {
        set({ items: [] });
      },

      obtenerTotal: () => {
        return get().items.reduce((total, item) => total + item.precio * item.cantidad, 0);
      },
    }),
    {
      name: 'carrito-storage',
    }
  )
);

export default useCarritoStore;
