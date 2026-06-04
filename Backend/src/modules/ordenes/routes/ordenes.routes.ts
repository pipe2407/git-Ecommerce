import { Router } from "express";
import { listarMisOrdenes, obtenerOrden, crearOrden } from "../controller/ordenes.controller";
import { autenticar } from "../../../middleware/autenticacion";

const ordenesRoutes = Router();

// GET /ordenes -> listar mis órdenes (requiere auth)
ordenesRoutes.get("/", autenticar, listarMisOrdenes);

// GET /ordenes/:id -> detalle de orden (requiere auth)
ordenesRoutes.get("/:id", autenticar, obtenerOrden);

// POST /ordenes -> crear orden (requiere auth)
ordenesRoutes.post("/", autenticar, crearOrden);

export default ordenesRoutes;
