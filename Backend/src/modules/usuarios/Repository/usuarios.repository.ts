import { prismaClient } from "../../../prisma/prisma.client";

export class UsuariosRepository {
    prismaClient = prismaClient;

    constructor() {}

    async listar() {
        return this.prismaClient.usuarios.findMany({
            include: { rol: true },
            orderBy: { id: "asc" },
        });
    }

    async obtenerPorId(id: bigint) {
        return this.prismaClient.usuarios.findUnique({
            where: { id },
            include: { rol: true },
        });
    }

    async obtenerPorEmail(email: string) {
        return this.prismaClient.usuarios.findUnique({
            where: { email },
            include: { rol: true },
        });
    }

    async existeRol(id: bigint) {
        return this.prismaClient.roles.findUnique({ where: { id } });
    }

    async crear(data: { nombre: string; email: string; password: string; rol_id: bigint; estado: boolean }) {
        return this.prismaClient.usuarios.create({
            data,
            include: { rol: true },
        });
    }

    async actualizar(
        id: bigint,
        data: { nombre?: string; email?: string; password?: string; rol_id?: bigint; estado?: boolean }
    ) {
        return this.prismaClient.usuarios.update({
            where: { id },
            data,
            include: { rol: true },
        });
    }

    async eliminar(id: bigint) {
        return this.prismaClient.usuarios.delete({ where: { id } });
    }
}
