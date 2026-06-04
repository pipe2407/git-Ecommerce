import { Router } from "express";
import { listarCategorias, crearCategoria } from "../controller/categorias.controller";
import { autenticar } from "../../../middleware/autenticacion";
import { autorizar } from "../../../middleware/autorizacion";

const categoriasRoutes = Router();

// GET /categorias -> listar (público)
categoriasRoutes.get("/", listarCategorias);
// POST /categorias -> crear (solo admin u operario)
categoriasRoutes.post("/", autenticar, autorizar(["admin", "operario"]), crearCategoria);

export default categoriasRoutes;
