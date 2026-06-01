import { hash } from "bcrypt";
import { iCrearUsuario } from "../Models/usuarios.model";
import { env } from "../../../config/env";
import { prismaClient } from "../../../prisma/prisma.client";

export class UsuariosRepository {
    prismaClient = prismaClient;
    
    constructor() {}

    // Repositorio para crear usuario
    async crearUsuario(data: iCrearUsuario) {
        try{
            const passwordPlano = data.contrasena;
            const saltRounds = env.saltos_encriptacion;
            const passwordHasheada = await hash(passwordPlano, saltRounds); 

            const resultCreacion = await this.prismaClient.usuarios.create({
                data: {
                    usuario_crea_fk: data.usuario_crea_fk,
                    usuario_modifica_fk: data.usuario_modifica_fk,
                    fecha_crea: new Date(),
                    fecha_modifica: new Date(),
                    primer_nombre: data.primer_nombre,
                    segundo_nombre: data.segundo_nombre,
                    primer_apellido: data.primer_apellido, 
                    segundo_apellido: data.segundo_apellido,
                    numero_identificacion: data.numero_identificacion, 
                    email: data.email,
                    contrasena: passwordHasheada,
                }
            });
            return resultCreacion;
        }catch(error){
            console.log("error creando usuario:" + error);
            throw new Error('Error guardando el usuario.');
        }
    }

    // Repositorio para consultar usuario
    async consultarUsuario(email: string){
        try {
            const resultConsulta = await this.prismaClient.usuarios.findUnique({
                where: {email}
            });
            return resultConsulta;
        } catch (error: any) {
            console.log("error consultando usuario:" + error);
            throw new Error('Error consultando el usuario.');
        }
    }

    // Repositorio para login de usuario
    async loginUsuario(credentials: any) {
        try {
            return { mensaje: "Login procesado", credentials };
        } catch (error: any) {
            console.log("error en login de usuario:" + error);
            throw new Error('Error procesando el login.');
        }
    }
}
