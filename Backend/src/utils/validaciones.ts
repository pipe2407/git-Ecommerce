import { errorBadRequest } from "./errores";

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Valida que un email tenga formato correcto. Lanza AppError 400 si no. */
export const validarEmail = (email: string): void => {
    if (!email || !REGEX_EMAIL.test(email)) {
        throw errorBadRequest("El email no tiene un formato valido");
    }
};

/** Valida longitud minima de password (> 6 caracteres). */
export const validarPassword = (password: string): void => {
    if (!password || password.length < 6) {
        throw errorBadRequest("La contrasena debe tener al menos 6 caracteres");
    }
};

/** Valida que un valor de texto este presente y no vacio. */
export const validarRequerido = (valor: unknown, nombreCampo: string): void => {
    if (valor === undefined || valor === null || (typeof valor === "string" && valor.trim() === "")) {
        throw errorBadRequest(`El campo '${nombreCampo}' es obligatorio`);
    }
};

/**
 * Convierte un valor a BigInt de forma segura.
 * Lanza AppError 400 si el valor no es un id valido.
 */
export const aBigInt = (valor: unknown, nombreCampo = "id"): bigint => {
    if (valor === undefined || valor === null || valor === "") {
        throw errorBadRequest(`El campo '${nombreCampo}' es obligatorio`);
    }
    try {
        const numero = BigInt(valor as string);
        if (numero <= 0n) {
            throw new Error("no positivo");
        }
        return numero;
    } catch (_error) {
        throw errorBadRequest(`El campo '${nombreCampo}' debe ser un identificador valido`);
    }
};
