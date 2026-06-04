import { Request, Response, NextFunction } from "express";
import { CategoriasService } from "../service/categorias.service";

const categoriasService = new CategoriasService();

// GET /categorias -> listar
export const listarCategorias = async (_request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const categorias = await categoriasService.listar();
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
