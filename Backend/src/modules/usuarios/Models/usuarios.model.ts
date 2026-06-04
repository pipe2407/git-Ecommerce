// DTOs del modulo de usuarios

export interface iCrearUsuario {
    nombre: string;
    email: string;
    password: string;
    rol_id: number | string;
    estado?: boolean;
}

export interface iActualizarUsuario {
    nombre?: string;
    email?: string;
    password?: string;
    rol_id?: number | string;
    estado?: boolean;
}

export interface iUsuarioPublico {
    id: string;
    nombre: string;
    email: string;
    rol_id: string;
    rol?: string;
    estado: boolean;
    fechaCreacion: Date;
    fechaModificacion: Date;
}
