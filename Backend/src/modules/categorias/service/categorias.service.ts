import { CategoriasRepository } from "../repository/categorias.repository";
import { iCrearCategoria, iCategoriaPublica } from "../models/categorias.model";
import { validarRequerido } from "../../../utils/validaciones";
import { errorBadRequest } from "../../../utils/errores";

export class CategoriasService {
    private repo: CategoriasRepository;

    constructor() {
        this.repo = new CategoriasRepository();
    }

    // Lista todas las categorias
    async listar(): Promise<iCategoriaPublica[]> {
        const categorias = await this.repo.listar();
        return categorias.map((c) => this.mapear(c));
    }

    // Crea una categoria validando nombre unico
    async crear(data: iCrearCategoria): Promise<iCategoriaPublica> {
        validarRequerido(data.nombre, "nombre");

        const existente = await this.repo.buscarPorNombre(data.nombre);
        if (existente) {
            throw errorBadRequest("Ya existe una categoria con ese nombre");
        }

        const creada = await this.repo.crear({
            nombre: data.nombre,
            descripcion: data.descripcion ?? null,
            estado: data.estado ?? true,
        });

        return this.mapear(creada);
    }

    private mapear(c: { id: bigint; nombre: string; descripcion: string | null; estado: boolean }): iCategoriaPublica {
        return {
            id: c.id.toString(),
            nombre: c.nombre,
            descripcion: c.descripcion,
            estado: c.estado,
        };
    }
}
