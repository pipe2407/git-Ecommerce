export interface iTokensAcceso{
    accessToken:string,
    refreshToken:string
}

export interface iRolesPermisos {
    [roleCodigo: string]: string[];
}

export interface iPermisosMap {
    [permisoCodigo: string]: { rol: number }[];
}

export interface payloadTokenUser {
    nombre_usuario:string,
    identificacion:string,
    permisos:iRolesPermisos | null
}