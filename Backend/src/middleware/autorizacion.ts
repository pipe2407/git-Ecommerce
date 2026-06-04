import { Request, Response, NextFunction } from "express";
import { RequestAutenticado } from "../types/express";

export const autorizar = (rolesPermitidos: string[]) => {
    return (request: Request, response: Response, next: NextFunction): void => {
        const usuario = (request as RequestAutenticado).usuario;

        if (!usuario) {
            response.status(401).json({ status: "error", mensaje: "Usuario no autenticado" });
            return;
        }

        if (!rolesPermitidos.includes(usuario.rol)) {
            response.status(403).json({ status: "error", mensaje: "No tiene permisos para realizar esta accion" });
            return;
        }

        next();
    };
};
