import { prismaClient } from "../../../prisma/prisma.client";

export class ReportesRepository {
    prismaClient = prismaClient;

    constructor() {}

    // Totales generales del sistema
    async totales() {
        const [usuarios, notificaciones, respuestas] = await Promise.all([
            this.prismaClient.usuarios.count(),
            this.prismaClient.modulonotificaciones.count(),
            this.prismaClient.hiloRespuestaNotificacion.count(),
        ]);
        return { usuarios, notificaciones, respuestas };
    }

    // Conteo de notificaciones agrupado por tipo
    async contarPorTipo() {
        const tipos = await this.prismaClient.tiponotificaciones.findMany({
            select: {
                id: true,
                nombre: true,
                _count: { select: { notificaciones: true } },
            },
            orderBy: { id: "asc" },
        });
        return tipos;
    }

    // Conteo de notificaciones agrupado por estado
    async contarPorEstado() {
        const estados = await this.prismaClient.estadonotificacion.findMany({
            select: {
                id: true,
                nombre: true,
                _count: { select: { notificaciones: true } },
            },
            orderBy: { id: "asc" },
        });
        return estados;
    }
}
