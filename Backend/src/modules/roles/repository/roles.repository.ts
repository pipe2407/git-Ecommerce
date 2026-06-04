import { prismaClient } from "../../../prisma/prisma.client";

export class RolesRepository {
    prismaClient = prismaClient;

    constructor() {}

    // Lista todos los roles
    async listar() {
        return this.prismaClient.roles.findMany({ orderBy: { id: "asc" } });
    }
}
