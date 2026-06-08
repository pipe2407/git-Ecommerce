import { Request, Response, NextFunction } from "express";

/**
 * Error de aplicacion con codigo de estado HTTP asociado.
 * Permite lanzar errores controlados desde los servicios y que el
 * middleware global de errores responda con el status correcto.
 */
export class AppError extends Error {
    public readonly status: number;
    public readonly esOperacional: boolean;

    constructor(mensaje: string, status: number = 500) {
        super(mensaje);
        this.name = "AppError";
        this.status = status;
        this.esOperacional = true;
        // Mantener la cadena de prototipos correcta al extender Error
        Object.setPrototypeOf(this, AppError.prototype);
    }
}

// Atajos para los errores mas comunes
export const errorBadRequest = (mensaje: string) => new AppError(mensaje, 400);
export const errorNoAutorizado = (mensaje = "No autorizado") => new AppError(mensaje, 401);
export const errorProhibido = (mensaje = "No tiene permisos para esta accion") => new AppError(mensaje, 403);
export const errorNoEncontrado = (mensaje = "Recurso no encontrado") => new AppError(mensaje, 404);

/**
 * Middleware global de manejo de errores.
 * Debe registrarse al final de la cadena de middlewares en app.ts.
 */
export const manejadorErrores = (
    error: unknown,
    _request: Request,
    response: Response,
    _next: NextFunction
): void => {
    if (error instanceof AppError) {
        response.status(error.status).json({
            status: "error",
            mensaje: error.message,
        });
        return;
    }

    const mensaje = error instanceof Error ? error.message : "Error interno del servidor";
    console.error("Error no controlado:", error);
    response.status(500).json({
        status: "error",
        mensaje: mensaje || "Error interno del servidor",
    });
};
