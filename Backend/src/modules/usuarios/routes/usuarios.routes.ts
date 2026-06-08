import { Router } from "express";
import {
    listarUsuarios,
    obtenerUsuario,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
} from "../Controller/usuarios.controller";
import { autenticar } from "../../../middleware/autenticacion";
import { autorizar } from "../../../middleware/autorizacion";

const usuariosRoutes = Router();

// Todas las rutas de usuarios requieren autenticacion
usuariosRoutes.use(autenticar);

// GET /usuarios -> listar
usuariosRoutes.get("/", listarUsuarios);
// GET /usuarios/:id -> detalle
usuariosRoutes.get("/:id", obtenerUsuario);
// POST /usuarios -> crear (solo admin)
usuariosRoutes.post("/", autorizar(["admin"]), crearUsuario);
// PUT /usuarios/:id -> actualizar (solo admin)
usuariosRoutes.put("/:id", autorizar(["admin"]), actualizarUsuario);
// DELETE /usuarios/:id -> eliminar (solo admin)
usuariosRoutes.delete("/:id", autorizar(["admin"]), eliminarUsuario);

export default usuariosRoutes;
