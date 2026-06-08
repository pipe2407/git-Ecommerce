import { Request, Response, NextFunction } from "express";
import { RolesService } from "../service/roles.service";

const rolesService = new RolesService();

// GET /roles -> listar roles
export const listarRoles = async (_request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const roles = await rolesService.listar();
        response.status(200).json(roles);
    } catch (error) {
        next(error);
    }
};
