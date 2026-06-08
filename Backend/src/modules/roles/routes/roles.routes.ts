import { Router } from "express";
import { listarRoles } from "../controller/roles.controller";
import { autenticar } from "../../../middleware/autenticacion";

const rolesRoutes = Router();

// GET /roles -> listar (requiere autenticacion)
rolesRoutes.get("/", autenticar, listarRoles);

export default rolesRoutes;
