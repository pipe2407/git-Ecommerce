import { Request, Response, NextFunction } from "express";
import { ReportesService } from "../service/reportes.service";

const reportesService = new ReportesService();

// GET /reportes/resumen -> totales generales
export const obtenerResumen = async (_request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const resumen = await reportesService.resumen();
        response.status(200).json(resumen);
    } catch (error) {
        next(error);
    }
};

// GET /reportes/por-tipo -> estadisticas por tipo
export const obtenerPorTipo = async (_request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const datos = await reportesService.porTipo();
        response.status(200).json(datos);
    } catch (error) {
        next(error);
    }
};

// GET /reportes/por-estado -> estadisticas por estado
export const obtenerPorEstado = async (_request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const datos = await reportesService.porEstado();
        response.status(200).json(datos);
    } catch (error) {
        next(error);
    }
};
