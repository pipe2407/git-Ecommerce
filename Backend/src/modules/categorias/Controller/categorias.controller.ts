import { Request, Response, NextFunction } from "express";
import { CategoriasService } from "../service/categorias.service";

const categoriasService = new CategoriasService();

// GET /categorias?tipo=productos -> listar por tipo
export const listarCategorias = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const tipo = request.query.tipo as string | undefined;
        const categorias = await categoriasService.listar(tipo);
        response.status(200).json(categorias);
    } catch (error) {
        next(error);
    }
};

// POST /categorias -> crear
export const crearCategoria = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const categoria = await categoriasService.crear(request.body);
        response.status(201).json(categoria);
    } catch (error) {
        next(error);
    }
};
