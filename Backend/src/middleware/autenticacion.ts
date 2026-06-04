import { Request, Response, NextFunction } from "express";
import { verificarAccessToken } from "../utils/jwt";
import { RequestAutenticado } from "../types/express";

export const autenticar = (request: Request, response: Response, next: NextFunction): void => {
    const cabecera = request.headers["authorization"];

    if (!cabecera || !cabecera.startsWith("Bearer ")) {
        response.status(401).json({ status: "error", mensaje: "Token de autenticacion no proporcionado" });
        return;
    }

    const token = cabecera.substring("Bearer ".length).trim();

    if (!token) {
        response.status(401).json({ status: "error", mensaje: "Token de autenticacion vacio" });
        return;
    }

    try {
        const payload = verificarAccessToken(token);
        (request as RequestAutenticado).usuario = payload;
        next();
    } catch (_error) {
        response.status(401).json({ status: "error", mensaje: "Token invalido o expirado" });
    }
};
