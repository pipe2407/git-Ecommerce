// Store de reportes (Zustand).
import { create } from 'zustand';
import reportesService from '../services/api/reportesService';
import type { ResumenReporte } from '../types';

interface ReportesState {
  resumen: ResumenReporte | null;
  loading: boolean;
  error: string | null;
  fetchResumen: () => Promise<void>;
}

export const useReportesStore = create<ReportesState>((set) => ({
  resumen: null,
  loading: false,
  error: null,

  fetchResumen: async () => {
    set({ loading: true, error: null });
    try {
      const resumen = await reportesService.getResumen();
      set({ resumen, loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },
}));

export default useReportesStore;
