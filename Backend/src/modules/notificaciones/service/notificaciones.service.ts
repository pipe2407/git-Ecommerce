import { NotificacionesRepository, DatosActualizarNotificacion } from "../repository/notificaciones.repository";
import {
    iCrearNotificacion,
    iActualizarNotificacion,
    iFiltrosNotificacion,
    iCrearRespuesta,
} from "../models/notificaciones.model";
import { validarRequerido, aBigInt } from "../../../utils/validaciones";
import { errorBadRequest, errorNoEncontrado } from "../../../utils/errores";

export class NotificacionesService {
    private repo: NotificacionesRepository;

    constructor() {
        this.repo = new NotificacionesRepository();
    }

    // Lista notificaciones aplicando filtros opcionales y paginacion
    async listar(filtros: iFiltrosNotificacion) {
        const pagina = Math.max(1, Number(filtros.pagina) || 1);
        const limite = Math.min(100, Math.max(1, Number(filtros.limite) || 10));
        const skip = (pagina - 1) * limite;

        const tipoId = await this.resolverFiltro(filtros.tipo, "tipo");
        const estadoId = await this.resolverFiltro(filtros.estado, "estado");
        const categoriaId = await this.resolverFiltro(filtros.categoria, "categoria");

        const { datos, total } = await this.repo.listar({
            tipo_id: tipoId,
            estado_id: estadoId,
            categoria_id: categoriaId,
            skip,
            take: limite,
        });

        return {
            datos: datos.map((n) => this.mapear(n)),
            total,
            pagina,
            limite,
            totalPaginas: Math.ceil(total / limite),
        };
    }

    // Detalle de una notificacion con respuestas
    async obtener(idParam: string) {
        const id = aBigInt(idParam, "id");
        const notificacion = await this.repo.obtenerPorId(id);
        if (!notificacion) {
            throw errorNoEncontrado("Notificacion no encontrada");
        }
        return this.mapearDetalle(notificacion);
    }

    // Crea una notificacion validando campos obligatorios y relaciones
    async crear(data: iCrearNotificacion, usuarioIdToken: string) {
        validarRequerido(data.asunto, "asunto");
        validarRequerido(data.descripcion, "descripcion");

        const tipoId = aBigInt(data.tipo_id, "tipo_id");
        const estadoId = aBigInt(data.estado_id, "estado_id");
        const categoriaId = aBigInt(data.categoria_id, "categoria_id");
        const usuarioId = aBigInt(usuarioIdToken, "usuario_id");

        await this.validarRelaciones(tipoId, estadoId, categoriaId);

        const creada = await this.repo.crear({
            asunto: data.asunto,
            descripcion: data.descripcion,
            tipo_id: tipoId,
            estado_id: estadoId,
            categoria_id: categoriaId,
            usuario_id: usuarioId,
            plazo: data.plazo ?? null,
            trimestre: data.trimestre ?? null,
            anioReporte: data.anioReporte ?? null,
            entidad: data.entidad ?? null,
            sector: data.sector ?? null,
            adjunto: data.adjunto ?? null,
            textoNotificacion: data.textoNotificacion ?? null,
        });

        return this.mapear(creada);
    }

    // Actualiza una notificacion (estado/datos)
    async actualizar(idParam: string, data: iActualizarNotificacion) {
        const id = aBigInt(idParam, "id");
        const existente = await this.repo.obtenerPorId(id);
        if (!existente) {
            throw errorNoEncontrado("Notificacion no encontrada");
        }

        const cambios: DatosActualizarNotificacion = {};

        if (data.asunto !== undefined) {
            validarRequerido(data.asunto, "asunto");
            cambios.asunto = data.asunto;
        }
        if (data.descripcion !== undefined) {
            validarRequerido(data.descripcion, "descripcion");
            cambios.descripcion = data.descripcion;
        }
        if (data.tipo_id !== undefined) {
            const tipoId = aBigInt(data.tipo_id, "tipo_id");
            if (!(await this.repo.existeTipo(tipoId))) throw errorBadRequest("El tipo indicado no existe");
            cambios.tipo_id = tipoId;
        }
        if (data.estado_id !== undefined) {
            const estadoId = aBigInt(data.estado_id, "estado_id");
            if (!(await this.repo.existeEstado(estadoId))) throw errorBadRequest("El estado indicado no existe");
            cambios.estado_id = estadoId;
        }
        if (data.categoria_id !== undefined) {
            const categoriaId = aBigInt(data.categoria_id, "categoria_id");
            if (!(await this.repo.existeCategoria(categoriaId))) throw errorBadRequest("La categoria indicada no existe");
            cambios.categoria_id = categoriaId;
        }
        if (data.plazo !== undefined) cambios.plazo = data.plazo;
        if (data.trimestre !== undefined) cambios.trimestre = data.trimestre;
        if (data.anioReporte !== undefined) cambios.anioReporte = data.anioReporte;
        if (data.entidad !== undefined) cambios.entidad = data.entidad;
        if (data.sector !== undefined) cambios.sector = data.sector;
        if (data.adjunto !== undefined) cambios.adjunto = data.adjunto;
        if (data.textoNotificacion !== undefined) cambios.textoNotificacion = data.textoNotificacion;

        const actualizada = await this.repo.actualizar(id, cambios);
        return this.mapear(actualizada);
    }

    // Elimina una notificacion
    async eliminar(idParam: string) {
        const id = aBigInt(idParam, "id");
        const existente = await this.repo.obtenerPorId(id);
        if (!existente) {
            throw errorNoEncontrado("Notificacion no encontrada");
        }
        await this.repo.eliminar(id);
    }

    // Lista las respuestas de una notificacion
    async listarRespuestas(idParam: string) {
        const id = aBigInt(idParam, "id");
        const existente = await this.repo.obtenerPorId(id);
        if (!existente) {
            throw errorNoEncontrado("Notificacion no encontrada");
        }
        const respuestas = await this.repo.listarRespuestas(id);
        return respuestas.map((r) => this.mapearRespuesta(r));
    }

    // Agrega una respuesta a una notificacion
    async crearRespuesta(idParam: string, data: iCrearRespuesta, usuarioIdToken: string) {
        const id = aBigInt(idParam, "id");
        validarRequerido(data.mensaje, "mensaje");

        const existente = await this.repo.obtenerPorId(id);
        if (!existente) {
            throw errorNoEncontrado("Notificacion no encontrada");
        }

        const respuesta = await this.repo.crearRespuesta({
            notificacion_id: id,
            usuario_id: aBigInt(usuarioIdToken, "usuario_id"),
            mensaje: data.mensaje,
            adjunto: data.adjunto ?? null,
        });

        return this.mapearRespuesta(respuesta);
    }

    // --- helpers privados ---

    // Resuelve un filtro que puede ser id numerico o nombre
    private async resolverFiltro(
        valor: string | undefined,
        tipoFiltro: "tipo" | "estado" | "categoria"
    ): Promise<bigint | undefined> {
        if (valor === undefined || valor === null || `${valor}`.trim() === "") {
            return undefined;
        }

        // Si es numerico, se usa como id
        if (/^\d+$/.test(`${valor}`.trim())) {
            return BigInt(`${valor}`.trim());
        }

        // Si no, se busca por nombre
        if (tipoFiltro === "tipo") {
            const t = await this.repo.existeTipoPorNombre(valor);
            return t ? t.id : -1n; // -1 fuerza resultado vacio si no existe
        }
        if (tipoFiltro === "estado") {
            const e = await this.repo.existeEstadoPorNombre(valor);
            return e ? e.id : -1n;
        }
        const c = await this.repo.existeCategoriaPorNombre(valor);
        return c ? c.id : -1n;
    }

    private async validarRelaciones(tipoId: bigint, estadoId: bigint, categoriaId: bigint): Promise<void> {
        if (!(await this.repo.existeTipo(tipoId))) {
            throw errorBadRequest("El tipo indicado no existe");
        }
        if (!(await this.repo.existeEstado(estadoId))) {
            throw errorBadRequest("El estado indicado no existe");
        }
        if (!(await this.repo.existeCategoria(categoriaId))) {
            throw errorBadRequest("La categoria indicada no existe");
        }
    }

    private mapear(n: any) {
        return {
            id: n.id.toString(),
            asunto: n.asunto,
            descripcion: n.descripcion,
            tipo: n.tipo ? { id: n.tipo.id.toString(), nombre: n.tipo.nombre } : null,
            estado: n.estado ? { id: n.estado.id.toString(), nombre: n.estado.nombre } : null,
            categoria: n.categoria ? { id: n.categoria.id.toString(), nombre: n.categoria.nombre } : null,
            remitente: n.usuario ? { id: n.usuario.id.toString(), nombre: n.usuario.nombre, email: n.usuario.email } : null,
            plazo: n.plazo,
            trimestre: n.trimestre,
            anioReporte: n.anioReporte,
            entidad: n.entidad,
            sector: n.sector,
            adjunto: n.adjunto,
            textoNotificacion: n.textoNotificacion,
            fechaCreacion: n.fechaCreacion,
            fechaModificacion: n.fechaModificacion,
        };
    }

    private mapearDetalle(n: any) {
        const base = this.mapear(n);
        return {
            ...base,
            respuestas: Array.isArray(n.respuestas) ? n.respuestas.map((r: any) => this.mapearRespuesta(r)) : [],
        };
    }

    private mapearRespuesta(r: any) {
        return {
            id: r.id.toString(),
            notificacion_id: r.notificacion_id.toString(),
            mensaje: r.mensaje,
            adjunto: r.adjunto,
            usuario: r.usuario ? { id: r.usuario.id.toString(), nombre: r.usuario.nombre, email: r.usuario.email } : null,
            fechaCreacion: r.fechaCreacion,
        };
    }
}
