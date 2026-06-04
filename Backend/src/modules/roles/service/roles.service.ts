import { RolesRepository } from "../repository/roles.repository";
import { iRolPublico } from "../models/roles.model";

export class RolesService {
    private repo: RolesRepository;

    constructor() {
        this.repo = new RolesRepository();
    }

    // Lista los roles disponibles
    async listar(): Promise<iRolPublico[]> {
        const roles = await this.repo.listar();
        return roles.map((r) => ({
            id: r.id.toString(),
            nombre: r.nombre,
            descripcion: r.descripcion,
            estado: r.estado,
        }));
    }
}
