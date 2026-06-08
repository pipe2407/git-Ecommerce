import { prismaClient } from "../../../prisma/prisma.client";

interface FiltrosListado {
    tipo_id?: bigint;
    estado_id?: bigint;
    categoria_id?: bigint;
    skip: number;
    take: number;
}

interface DatosCrearNotificacion {
    asunto: string;
    descripcion: string;
    tipo_id: bigint;
    estado_id: bigint;
    categoria_id: bigint;
    usuario_id: bigint;
    plazo?: string | null;
    trimestre?: number | null;
    anioReporte?: number | null;
    entidad?: string | null;
    sector?: string | null;
    adjunto?: string | null;
    textoNotificacion?: string | null;
}

export interface DatosActualizarNotificacion {
    asunto?: string;
    descripcion?: string;
    tipo_id?: bigint;
    estado_id?: bigint;
    categoria_id?: bigint;
    plazo?: string | null;
    trimestre?: number | null;
    anioReporte?: number | null;
    entidad?: string | null;
    sector?: string | null;
    adjunto?: string | null;
    textoNotificacion?: string | null;
}

const incluirRelaciones = {
    tipo: true,
    estado: true,
    categoria: true,
    usuario: { select: { id: true, nombre: true, email: true } },
};

export class NotificacionesRepository {
    prismaClient = prismaClient;

    constructor() {}

    // Lista notificaciones con filtros y paginacion
    async listar(filtros: FiltrosListado) {
        const where: { tipo_id?: bigint; estado_id?: bigint; categoria_id?: bigint } = {};
        if (filtros.tipo_id !== undefined) where.tipo_id = filtros.tipo_id;
        if (filtros.estado_id !== undefined) where.estado_id = filtros.estado_id;
        if (filtros.categoria_id !== undefined) where.categoria_id = filtros.categoria_id;

        const [datos, total] = await Promise.all([
            this.prismaClient.modulonotificaciones.findMany({
                where,
                include: incluirRelaciones,
                orderBy: { id: "desc" },
                skip: filtros.skip,
                take: filtros.take,
            }),
            this.prismaClient.modulonotificaciones.count({ where }),
        ]);

        return { datos, total };
    }

    // Obtiene una notificacion con sus respuestas
    async obtenerPorId(id: bigint) {
        return this.prismaClient.modulonotificaciones.findUnique({
            where: { id },
            include: {
                ...incluirRelaciones,
                respuestas: {
                    include: { usuario: { select: { id: true, nombre: true, email: true } } },
                    orderBy: { id: "asc" },
                },
            },
        });
    }

    // Validaciones de existencia de relaciones
    async existeTipo(id: bigint) {
        return this.prismaClient.tiponotificaciones.findUnique({ where: { id } });
    }
    async existeEstado(id: bigint) {
        return this.prismaClient.estadonotificacion.findUnique({ where: { id } });
    }
    async existeCategoria(id: bigint) {
        return this.prismaClient.categoria.findUnique({ where: { id } });
    }
    async existeTipoPorNombre(nombre: string) {
        return this.prismaClient.tiponotificaciones.findUnique({ where: { nombre } });
    }
    async existeEstadoPorNombre(nombre: string) {
        return this.prismaClient.estadonotificacion.findUnique({ where: { nombre } });
    }
    async existeCategoriaPorNombre(nombre: string) {
        return this.prismaClient.categoria.findUnique({ where: { nombre } });
    }

    // Crea una notificacion
    async crear(data: DatosCrearNotificacion) {
        return this.prismaClient.modulonotificaciones.create({
            data,
            include: incluirRelaciones,
        });
    }

    // Actualiza una notificacion
    async actualizar(id: bigint, data: DatosActualizarNotificacion) {
        return this.prismaClient.modulonotificaciones.update({
            where: { id },
            data,
            include: incluirRelaciones,
        });
    }

    // Elimina una notificacion (las respuestas se eliminan en cascada)
    async eliminar(id: bigint) {
        return this.prismaClient.modulonotificaciones.delete({ where: { id } });
    }

    // Respuestas (hilo)
    async listarRespuestas(notificacionId: bigint) {
        return this.prismaClient.hiloRespuestaNotificacion.findMany({
            where: { notificacion_id: notificacionId },
            include: { usuario: { select: { id: true, nombre: true, email: true } } },
            orderBy: { id: "asc" },
        });
    }

    async crearRespuesta(data: { notificacion_id: bigint; usuario_id: bigint; mensaje: string; adjunto?: string | null }) {
        return this.prismaClient.hiloRespuestaNotificacion.create({
            data,
            include: { usuario: { select: { id: true, nombre: true, email: true } } },
        });
    }
}
