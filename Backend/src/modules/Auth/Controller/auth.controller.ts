import { Request, Response, NextFunction } from "express";
import { AuthService } from "../Services/auth.service";
import { env } from "../../../config/env";

const authService = new AuthService();

// POST /auth/login -> { email, password } -> { token, usuario }
export const login = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const resultado = await authService.login(request.body);
        response
            .status(200)
            .cookie("refresh_token", resultado.refreshToken, {
                httpOnly: true,
                secure: env.ENVIRONMENT === "production",
                sameSite: "strict",
            })
            .json({
                token: resultado.token,
                usuario: resultado.usuario,
            });
    } catch (error) {
        next(error);
    }
};

// POST /auth/register -> datos usuario -> { id, email, nombre }
export const register = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const usuario = await authService.registrar(request.body);
        response.status(201).json({
            id: usuario.id,
            email: usuario.email,
            nombre: usuario.nombre,
        });
    } catch (error) {
        next(error);
    }
};

// POST /auth/logout -> {} -> { ok: true }
export const logout = async (_request: Request, response: Response): Promise<void> => {
    response
        .clearCookie("refresh_token")
        .status(200)
        .json({ ok: true });
};

// Extrae una cookie por nombre desde la cabecera Cookie (sin cookie-parser)
const leerCookie = (request: Request, nombre: string): string | undefined => {
    const cabecera = request.headers.cookie;
    if (!cabecera) {
        return undefined;
    }
    const partes = cabecera.split(";");
    for (const parte of partes) {
        const [clave, ...valor] = parte.trim().split("=");
        if (clave === nombre) {
            return decodeURIComponent(valor.join("="));
        }
    }
    return undefined;
};

// POST /auth/refresh -> {} (cookie o body) -> { token }
export const refresh = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const tokenDesdeCookie = leerCookie(request, "refresh_token");
        const tokenDesdeBody = request.body?.refreshToken;
        const refreshToken = tokenDesdeCookie || tokenDesdeBody;

        const resultado = await authService.refrescarToken(refreshToken);
        response.status(200).json(resultado);
    } catch (error) {
        next(error);
    }
};

// POST /auth/reset-password -> { email, nuevaContrasena } -> { mensaje }
export const resetPassword = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const resultado = await authService.cambiarContrasena(request.body.email, request.body.nuevaContrasena);
        response.status(200).json(resultado);
    } catch (error) {
        next(error);
    }
};
