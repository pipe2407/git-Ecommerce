import { Router } from "express";
import {
    listarNotificaciones,
    obtenerNotificacion,
    crearNotificacion,
    actualizarNotificacion,
    eliminarNotificacion,
    listarRespuestas,
    crearRespuesta,
} from "../controller/notificaciones.controller";
import { autenticar } from "../../../middleware/autenticacion";

const notificacionesRoutes = Router();

// Todas las rutas requieren usuario autenticado
notificacionesRoutes.use(autenticar);

// GET /notificaciones -> listar (con filtros)
notificacionesRoutes.get("/", listarNotificaciones);
// GET /notificaciones/:id -> detalle con respuestas
notificacionesRoutes.get("/:id", obtenerNotificacion);
// POST /notificaciones -> crear
notificacionesRoutes.post("/", crearNotificacion);
// PUT /notificaciones/:id -> actualizar
notificacionesRoutes.put("/:id", actualizarNotificacion);
// DELETE /notificaciones/:id -> eliminar
notificacionesRoutes.delete("/:id", eliminarNotificacion);
// GET /notificaciones/:id/respuestas -> listar respuestas
notificacionesRoutes.get("/:id/respuestas", listarRespuestas);
// POST /notificaciones/:id/respuestas -> agregar respuesta
notificacionesRoutes.post("/:id/respuestas", crearRespuesta);

export default notificacionesRoutes;
