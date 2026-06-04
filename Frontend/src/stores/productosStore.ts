import { create } from 'zustand';
import productosService from '../services/api/productosService';
import type { Producto, CrearProductoData } from '../services/api/productosService';

interface ProductosState {
  productos: Producto[];
  productoDetalle: Producto | null;
  loading: boolean;
  error: string | null;
  fetchProductos: (filtros?: { categoria?: string; pagina?: number; limite?: number }) => Promise<void>;
  fetchProducto: (id: string | number) => Promise<void>;
  crearProducto: (datos: CrearProductoData) => Promise<Producto>;
  actualizarProducto: (id: string | number, datos: Partial<CrearProductoData>) => Promise<Producto>;
  eliminarProducto: (id: string | number) => Promise<void>;
}

export const useProductosStore = create<ProductosState>((set) => ({
  productos: [],
  productoDetalle: null,
  loading: false,
  error: null,

  fetchProductos: async (filtros) => {
    set({ loading: true, error: null });
    try {
      const { productos } = await productosService.getProductos(filtros);
      set({ productos, loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  fetchProducto: async (id) => {
    set({ loading: true, error: null, productoDetalle: null });
    try {
      const productoDetalle = await productosService.getProducto(id);
      set({ productoDetalle, loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  crearProducto: async (datos) => {
    set({ loading: true, error: null });
    try {
      const nuevo = await productosService.crearProducto(datos);
      set((state) => ({ productos: [nuevo, ...state.productos], loading: false }));
      return nuevo;
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
      throw err;
    }
  },

  actualizarProducto: async (id, datos) => {
    try {
      const actualizado = await productosService.actualizarProducto(id, datos);
      set((state) => ({
        productos: state.productos.map((p) =>
          String(p.id) === String(id) ? actualizado : p
        ),
      }));
      return actualizado;
    } catch (err) {
      set({ error: (err as Error).message });
      throw err;
    }
  },

  eliminarProducto: async (id) => {
    try {
      await productosService.eliminarProducto(id);
      set((state) => ({
        productos: state.productos.filter((p) => String(p.id) !== String(id)),
      }));
    } catch (err) {
      set({ error: (err as Error).message });
      throw err;
    }
  },
}));

export default useProductosStore;
