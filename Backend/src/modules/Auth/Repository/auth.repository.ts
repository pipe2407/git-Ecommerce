import { prismaClient } from "../../../prisma/prisma.client";
import { iUsuario } from "../../usuarios/Models/usuarios.model";
import { iRolesPermisos } from "../Models/auth.model";

export class AuthRepository {
    prismaClient = prismaClient;
    
    constructor() {}
    
    async guardarTokenUsuario (user:iUsuario, token:string, tipoToken:('REFRESH' | 'ACCESS'), ip:string, user_agent:string, fecha_expiracion_token:Date) {
        try{
            const resultCreacion = await this.prismaClient.usuarios_token.create({
                data: {
                    usuario_crea_fk: user.id,
                    usuario_modifica_fk:  user.id,
                    fecha_crea: new Date(),
                    fecha_modifica:  new Date(),
                    usuario_fk:  user.id,
                    token: token,
                    tipo: tipoToken,
                    ip_origen: ip,
                    user_agent: user_agent,
                    fecha_expiracion: fecha_expiracion_token,
                }
            });
            return resultCreacion;
        }catch(error){
            console.log("error creando usuario:" + error);
            throw new Error('Error guardando el usuario.');
        }
    }

    async consultarRolesUsuario(user:iUsuario): Promise<iRolesPermisos>{
        // Paso 1: Consultar los roles del usuario con inner join
        const usuarioRoles = await prismaClient.usuarios_roles.findMany({
            where: {
                usuario_fk: user.id
            },
            include: {
                roles: {
                    select: {
                        codigo: true,
                        id: true
                    }
                }
            }
        });

        // Paso 2: Crear el array de retorno (objeto asociativo por código de rol)
        const rolesPermisosMap: iRolesPermisos = {};

        // Paso 3: Foreach para consultar permisos de cada rol
        for (const ur of usuarioRoles) {
            const rolCodigo = ur.roles.codigo;
            
            // Consultar permisos del rol desde roles_permiso
            const rolesPermisos = await prismaClient.roles_permiso.findMany({
                where: {
                    rol_fk: ur.roles.id
                },
                include: {
                    permisos: {
                        select: {
                            codigo: true
                        }
                    }
                }
            });

            // Extraer los códigos de permisos y agregarlos al array
            rolesPermisosMap[rolCodigo] = rolesPermisos.map(rp => rp.permisos.codigo);
        }
        
        return rolesPermisosMap;
    }

}