import { prismaClient } from "../../../prisma/prisma.client";

/**
 * Repositorio de autenticacion.
 * Acceso a datos para login/registro de usuarios.
 */
export class AuthRepository {
    prismaClient = prismaClient;

    constructor() {}

    // Busca un usuario por email (incluye su rol)
    async buscarPorEmail(email: string) {
        return this.prismaClient.usuarios.findUnique({
            where: { email },
            include: { rol: true },
        });
    }

    // Busca un usuario por id (incluye su rol)
    async buscarPorId(id: bigint) {
        return this.prismaClient.usuarios.findUnique({
            where: { id },
            include: { rol: true },
        });
    }

    // Busca un rol por id
    async buscarRolPorId(id: bigint) {
        return this.prismaClient.roles.findUnique({ where: { id } });
    }

    // Busca un rol por nombre
    async buscarRolPorNombre(nombre: string) {
        return this.prismaClient.roles.findUnique({ where: { nombre } });
    }

    // Crea un nuevo usuario (recibe la password ya hasheada)
    async crearUsuario(data: { nombre: string; email: string; password: string; rol_id: bigint }) {
        return this.prismaClient.usuarios.create({
            data: {
                nombre: data.nombre,
                email: data.email,
                password: data.password,
                rol_id: data.rol_id,
            },
            include: { rol: true },
        });
    }
}
