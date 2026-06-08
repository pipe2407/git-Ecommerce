import { Router } from "express";
import { listarTodasOrdenes, listarMisOrdenes, obtenerOrden, crearOrden } from "../controller/ordenes.controller";
import { autenticar } from "../../../middleware/autenticacion";
import { autorizar } from "../../../middleware/autorizacion";

const ordenesRoutes = Router();

// GET /ordenes/admin/todas -> listar TODAS las órdenes (solo admin)
ordenesRoutes.get("/admin/todas", autenticar, autorizar(["admin"]), listarTodasOrdenes);

// GET /ordenes -> listar mis órdenes (requiere auth)
ordenesRoutes.get("/", autenticar, listarMisOrdenes);

// GET /ordenes/:id -> detalle de orden (requiere auth)
ordenesRoutes.get("/:id", autenticar, obtenerOrden);

// POST /ordenes -> crear orden (requiere auth)
ordenesRoutes.post("/", autenticar, crearOrden);

export default ordenesRoutes;
