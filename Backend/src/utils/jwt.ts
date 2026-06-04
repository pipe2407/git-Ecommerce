import { sign, verify, SignOptions, JwtPayload } from "jsonwebtoken";
import { env } from "../config/env";

// Datos que viajan dentro del JWT de acceso
export interface PayloadToken {
    usuario_id: string; // BigInt serializado como string
    email: string;
    rol: string;        // nombre del rol (admin, operario, ciudadano)
}

/**
 * Genera un token de acceso firmado con la firma de access.
 */
export const generarAccessToken = (payload: PayloadToken): string => {
    return sign(payload, env.FIRMA_ACCESS_TOKEN, {
        expiresIn: env.ACCESS_TOKEN_DURATION as SignOptions["expiresIn"],
    });
};

/**
 * Genera un refresh token firmado con la firma de refresh.
 */
export const generarRefreshToken = (payload: PayloadToken): string => {
    return sign(payload, env.FIRMA_REFRESH_TOKEN, {
        expiresIn: env.REFRESH_TOKEN_DURATION as SignOptions["expiresIn"],
    });
};

/**
 * Verifica un token de acceso y retorna el payload tipado.
 */
export const verificarAccessToken = (token: string): PayloadToken => {
    const decoded = verify(token, env.FIRMA_ACCESS_TOKEN) as JwtPayload & PayloadToken;
    return {
        usuario_id: decoded.usuario_id,
        email: decoded.email,
        rol: decoded.rol,
    };
};

/**
 * Verifica un refresh token y retorna el payload tipado.
 */
export const verificarRefreshToken = (token: string): PayloadToken => {
    const decoded = verify(token, env.FIRMA_REFRESH_TOKEN) as JwtPayload & PayloadToken;
    return {
        usuario_id: decoded.usuario_id,
        email: decoded.email,
        rol: decoded.rol,
    };
};
