import { Router } from "express";
import authRoutes from "../modules/Auth/routes/auth.routes";
import notificacionesRoutes from "../modules/notificaciones/routes/notificaciones.routes";
import usuariosRoutes from "../modules/usuarios/routes/usuarios.routes";
import rolesRoutes from "../modules/roles/routes/roles.routes";
import categoriasRoutes from "../modules/categorias/routes/categorias.routes";
import reportesRoutes from "../modules/reportes/routes/reportes.routes";

const router = Router();

// Rutas de autenticacion
router.use("/auth", authRoutes);
// Rutas de notificaciones
router.use("/notificaciones", notificacionesRoutes);
// Rutas de usuarios
router.use("/usuarios", usuariosRoutes);
// Rutas de roles
router.use("/roles", rolesRoutes);
// Rutas de categorias
router.use("/categorias", categoriasRoutes);
// Rutas de reportes
router.use("/reportes", reportesRoutes);

export default router;
