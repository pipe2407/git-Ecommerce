// DTOs del modulo de autenticacion

export interface iLogin {
    email: string;
    password: string;
}

export interface iRegistro {
    nombre: string;
    email: string;
    password: string;
    rol_id?: number | string;
}

export interface iUsuarioPublico {
    id: string;
    nombre: string;
    email: string;
    rol: string;
}

export interface iRespuestaLogin {
    token: string;
    refreshToken: string;
    usuario: iUsuarioPublico;
}
