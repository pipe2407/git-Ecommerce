import { prismaClient } from "../../../prisma/prisma.client";

export class CategoriasRepository {
    prismaClient = prismaClient;

    constructor() {}

    // Lista todas las categorias
    async listar() {
        return this.prismaClient.categoria.findMany({ orderBy: { id: "asc" } });
    }

    // Busca una categoria por nombre
    async buscarPorNombre(nombre: string) {
        return this.prismaClient.categoria.findUnique({ where: { nombre } });
    }

    // Crea una categoria
    async crear(data: { nombre: string; descripcion?: string | null; estado: boolean }) {
        return this.prismaClient.categoria.create({ data });
    }
}
