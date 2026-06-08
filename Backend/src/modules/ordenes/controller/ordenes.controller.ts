import { Request, Response, NextFunction } from "express";
import { OrdenesService } from "../service/ordenes.service";
import { errorNoAutorizado } from "../../../utils/errores";
import { RequestAutenticado } from "../../../types/express";

const ordenesService = new OrdenesService();

export const listarTodasOrdenes = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try {
    const ordenes = await ordenesService.listarTodas();
    response.status(200).json(ordenes);
  } catch (error) {
    next(error);
  }
};

export const listarMisOrdenes = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try {
    const req = request as RequestAutenticado;
    if (!req.usuario) throw errorNoAutorizado();
    const ordenes = await ordenesService.listarMisOrdenes(req.usuario.usuario_id);
    response.status(200).json(ordenes);
  } catch (error) {
    next(error);
  }
};

export const obtenerOrden = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try {
    const orden = await ordenesService.obtener(request.params.id);
    response.status(200).json(orden);
  } catch (error) {
    next(error);
  }
};

export const crearOrden = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  try {
    const req = request as RequestAutenticado;
    if (!req.usuario) throw errorNoAutorizado();
    const orden = await ordenesService.crear(request.body, req.usuario.usuario_id);
    response.status(201).json(orden);
  } catch (error) {
    next(error);
  }
};
