import { Request, Response } from "express";
import { UsuariosService } from "../Services/usuarios.service";
import { iTokensAcceso } from "../../Auth/Models/auth.model";
import { env } from "../../../config/env";
import strict from "node:assert/strict";

const usuariosService = new UsuariosService();

// Función para crear usuario
export const crearUsuario = async (request: Request, response: Response) => {
    try {
        // Llamar al servicio
        const resultado = await usuariosService.crearUsuario(request.body);
        response.status(201).json(resultado);
    } catch (error: any) {
        response.status(500).json({ 
            error: "Error al crear usuario", 
            mensaje: error.message || "Error interno del servidor" 
        });
    }
};

// Función para consultar usuario
export const consultarUsuario = async (request: Request, response: Response) => {
    try {
        // Llamar al servicio
        const resultado = await usuariosService.consultarUsuario(request.query);
        response.status(200).json({"message" : "Usuario Creado"});
    } catch (error: any) {
        response.status(500).json({ 
            error: "Error al consultar usuario", 
            mensaje: error.message || "Error interno del servidor" 
        });
    }
};

// Función para login de usuario
export const loginUsuario = async (request: Request, response: Response) => {
    try {
        // Llamar al servicio
        const ip =
        request.headers["x-forwarded-for"]?.toString().split(",")[0] ||
        request.socket.remoteAddress ||
        "unknown";

        const user_agent: string = request.headers['user-agent']?.toString() || 'unknown';

        const resultado:iTokensAcceso = await usuariosService.loginUsuario(request.body, ip , user_agent);
        response.status(200)
        .cookie("refresh_token", resultado.refreshToken, {
            httpOnly: true,
            secure: env.ENVIRONMENT == 'production',
            sameSite: "strict"
        })
        .json({ "access_token" : resultado.accessToken});
    } catch (error: any) {
        response.status(401).json({ 
            error: "Error al autenticar usuario", 
            mensaje: error.message || "Credenciales inválidas" 
        });
    }
};
