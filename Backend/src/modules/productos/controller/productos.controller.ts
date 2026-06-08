import { Request, Response, NextFunction } from "express";
import { ProductosService } from "../service/productos.service";
import { errorNoAutorizado } from "../../../utils/errores";
import { RequestAutenticado } from "../../../types/express";

const productosService = new ProductosService();

export const listarProductos = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try {
    const resultado = await productosService.listar({
      categoria: request.query.categoria as string | undefined,
      pagina: request.query.pagina as string | undefined,
      limite: request.query.limite as string | undefined,
    });
    response.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

export const obtenerProducto = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try {
    const producto = await productosService.obtener(request.params.id);
    response.status(200).json(producto);
  } catch (error) {
    next(error);
  }
};

export const crearProducto = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try {
    const req = request as RequestAutenticado;
    if (!req.usuario) throw errorNoAutorizado();
    const producto = await productosService.crear(request.body, req.usuario.usuario_id);
    response.status(201).json(producto);
  } catch (error) {
    next(error);
  }
};

export const actualizarProducto = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try {
    const req = request as RequestAutenticado;
    const usuarioId = req.usuario?.usuario_id;
    const producto = await productosService.actualizar(request.params.id, request.body, usuarioId);
    response.status(200).json(producto);
  } catch (error) {
    next(error);
  }
};

export const eliminarProducto = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try {
    const req = request as RequestAutenticado;
    const usuarioId = req.usuario?.usuario_id;
    await productosService.eliminar(request.params.id, usuarioId);
    response.status(200).json({ ok: true });
  } catch (error) {
    next(error);
  }
};
