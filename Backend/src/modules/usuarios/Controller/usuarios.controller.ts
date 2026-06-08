import { Request, Response, NextFunction } from "express";
import { UsuariosService } from "../Services/usuarios.service";

const usuariosService = new UsuariosService();

// GET /usuarios -> listar usuarios
export const listarUsuarios = async (_request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const usuarios = await usuariosService.listar();
        response.status(200).json(usuarios);
    } catch (error) {
        next(error);
    }
};

// GET /usuarios/:id -> detalle
export const obtenerUsuario = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const usuario = await usuariosService.obtener(request.params.id);
        response.status(200).json(usuario);
    } catch (error) {
        next(error);
    }
};

// POST /usuarios -> crear usuario
export const crearUsuario = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const usuario = await usuariosService.crear(request.body);
        response.status(201).json(usuario);
    } catch (error) {
        next(error);
    }
};

// PUT /usuarios/:id -> actualizar
export const actualizarUsuario = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const usuario = await usuariosService.actualizar(request.params.id, request.body);
        response.status(200).json(usuario);
    } catch (error) {
        next(error);
    }
};

// DELETE /usuarios/:id -> eliminar
export const eliminarUsuario = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        await usuariosService.eliminar(request.params.id);
        response.status(200).json({ ok: true });
    } catch (error) {
        next(error);
    }
};
