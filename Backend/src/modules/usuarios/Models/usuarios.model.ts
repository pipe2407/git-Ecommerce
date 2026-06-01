export interface iCrearUsuario {
    usuario_crea_fk:number,
    usuario_modifica_fk:number,
    primer_nombre:string,
    segundo_nombre:string | null,
    primer_apellido:string, 
    segundo_apellido:string | null,
    numero_identificacion:string, 
    email:string,
    contrasena:string,
}

export interface iLogin{
    email:string,
    contrasena:string
}

export interface iUsuario {
    fecha_crea: Date;
    fecha_modifica: Date;
    primer_nombre: string;
    segundo_nombre: string | null;
    primer_apellido: string;
    segundo_apellido: string | null;
    numero_identificacion: string;
    email: string;
    contrasena: string;
    activo: boolean;
    id: number;
    usuario_crea_fk: number;
    usuario_modifica_fk: number;
}