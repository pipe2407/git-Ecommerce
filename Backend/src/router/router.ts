import { Router } from "express";
import usuariosRoutes from "../modules/usuarios/Routes/usuarios.routes";

const router = Router();

// Rutas de usuarios
router.use('/usuarios', usuariosRoutes);

export default router;