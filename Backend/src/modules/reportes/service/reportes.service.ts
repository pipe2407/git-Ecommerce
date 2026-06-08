import { ReportesRepository } from "../repository/reportes.repository";
import { iResumenReporte, iEstadisticaItem } from "../models/reportes.model";

export class ReportesService {
    private repo: ReportesRepository;

    constructor() {
        this.repo = new ReportesRepository();
    }

    // Resumen: totales de usuarios, notificaciones y respuestas
    async resumen(): Promise<iResumenReporte> {
        const totales = await this.repo.totales();
        return {
            totalUsuarios: totales.usuarios,
            totalNotificaciones: totales.notificaciones,
            totalRespuestas: totales.respuestas,
        };
    }

    // Estadisticas: notificaciones por tipo
    async porTipo(): Promise<iEstadisticaItem[]> {
        const tipos = await this.repo.contarPorTipo();
        return tipos.map((t) => ({
            id: t.id.toString(),
            nombre: t.nombre,
            total: t._count.notificaciones,
        }));
    }

    // Estadisticas: notificaciones por estado
    async porEstado(): Promise<iEstadisticaItem[]> {
        const estados = await this.repo.contarPorEstado();
        return estados.map((e) => ({
            id: e.id.toString(),
            nombre: e.nombre,
            total: e._count.notificaciones,
        }));
    }
}
