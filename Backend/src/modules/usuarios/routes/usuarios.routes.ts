import { Router } from "express";
import { 
    crearUsuario, 
    consultarUsuario, 
    loginUsuario 
} from "../Controller/usuarios.controller";

const usuariosRoutes = Router();

// Endpoint para crear usuario
usuariosRoutes.post('/crear', crearUsuario);

// Endpoint para consultar usuario
usuariosRoutes.get('/consultar', consultarUsuario);

// Endpoint para login
usuariosRoutes.post('/login', loginUsuario);

export default usuariosRoutes;
