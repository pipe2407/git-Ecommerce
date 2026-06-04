import { Router } from "express";
import { listarProductos, obtenerProducto, crearProducto, actualizarProducto, eliminarProducto } from "../controller/productos.controller";
import { autenticar } from "../../../middleware/autenticacion";

const productosRoutes = Router();

// GET /productos -> listar (público)
productosRoutes.get("/", listarProductos);

// GET /productos/:id -> detalle (público)
productosRoutes.get("/:id", obtenerProducto);

// POST /productos -> crear (requiere auth)
productosRoutes.post("/", autenticar, crearProducto);

// PUT /productos/:id -> actualizar (requiere auth)
productosRoutes.put("/:id", autenticar, actualizarProducto);

// DELETE /productos/:id -> eliminar (requiere auth)
productosRoutes.delete("/:id", autenticar, eliminarProducto);

export default productosRoutes;
