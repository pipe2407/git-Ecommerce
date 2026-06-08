import { Router } from "express";
import { obtenerResumen, obtenerPorTipo, obtenerPorEstado } from "../controller/reportes.controller";
import { autenticar } from "../../../middleware/autenticacion";

const reportesRoutes = Router();

// Todos los reportes requieren autenticacion
reportesRoutes.use(autenticar);

// GET /reportes/resumen -> totales generales
reportesRoutes.get("/resumen", obtenerResumen);
// GET /reportes/por-tipo -> estadisticas por tipo
reportesRoutes.get("/por-tipo", obtenerPorTipo);
// GET /reportes/por-estado -> estadisticas por estado
reportesRoutes.get("/por-estado", obtenerPorEstado);

export default reportesRoutes;
