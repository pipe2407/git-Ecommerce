import { Request, Response, NextFunction } from "express";
import { NotificacionesService } from "../service/notificaciones.service";
import { errorNoAutorizado } from "../../../utils/errores";
import { RequestAutenticado } from "../../../types/express";

const notificacionesService = new NotificacionesService();

// GET /notificaciones -> listar con filtros
export const listarNotificaciones = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const resultado = await notificacionesService.listar({
            tipo: request.query.tipo as string | undefined,
            estado: request.query.estado as string | undefined,
            categoria: request.query.categoria as string | undefined,
            pagina: request.query.pagina as string | undefined,
            limite: request.query.limite as string | undefined,
        });
        response.status(200).json(resultado);
    } catch (error) {
        next(error);
    }
};

// GET /notificaciones/:id -> detalle con respuestas
export const obtenerNotificacion = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const notificacion = await notificacionesService.obtener(request.params.id);
        response.status(200).json(notificacion);
    } catch (error) {
        next(error);
    }
};

// POST /notificaciones -> crear (requiere auth)
export const crearNotificacion = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const req = request as RequestAutenticado;
        if (!req.usuario) throw errorNoAutorizado();
        const notificacion = await notificacionesService.crear(request.body, req.usuario.usuario_id);
        response.status(201).json(notificacion);
    } catch (error) {
        next(error);
    }
};

// PUT /notificaciones/:id -> actualizar
export const actualizarNotificacion = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const notificacion = await notificacionesService.actualizar(request.params.id, request.body);
        response.status(200).json(notificacion);
    } catch (error) {
        next(error);
    }
};

// DELETE /notificaciones/:id -> eliminar
export const eliminarNotificacion = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        await notificacionesService.eliminar(request.params.id);
        response.status(200).json({ ok: true });
    } catch (error) {
        next(error);
    }
};

// GET /notificaciones/:id/respuestas -> listar respuestas
export const listarRespuestas = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const respuestas = await notificacionesService.listarRespuestas(request.params.id);
        response.status(200).json(respuestas);
    } catch (error) {
        next(error);
    }
};

// POST /notificaciones/:id/respuestas -> agregar respuesta (requiere auth)
export const crearRespuesta = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const req = request as RequestAutenticado;
        if (!req.usuario) throw errorNoAutorizado();
        const respuesta = await notificacionesService.crearRespuesta(request.params.id, request.body, req.usuario.usuario_id);
        response.status(201).json(respuesta);
    } catch (error) {
        next(error);
    }
};
