import { UsuariosRepository } from "../Repository/usuarios.repository";
import { iCrearUsuario, iUsuario } from "../Models/usuarios.model";
import { iLogin } from "../Models/usuarios.model";
import { autenticarUsuario, guardarTokenUsuario } from "../../Auth/Services/auth.service";
import { iTokensAcceso } from "../../Auth/Models/auth.model";

export class UsuariosService {
    private usuariosRepository: UsuariosRepository;

    constructor() {
        this.usuariosRepository = new UsuariosRepository();
    }
    
    // Servicio para crear usuario
    async crearUsuario(data: iCrearUsuario) {
        try {
            const resultado = await this.usuariosRepository.crearUsuario(data);
            return resultado;
        } catch (error: any) {
            throw new Error(error.message || "Error al crear usuario en el servicio");
        }
    }

    // Servicio para consultar usuario
    async consultarUsuario(params: any) {
        try {
            const resultado = await this.usuariosRepository.consultarUsuario(params);
            return resultado;
        } catch (error: any) {
            throw new Error(error.message || "Error al consultar usuario en el servicio");
        }
    }

    // Servicio para login de usuario
    async loginUsuario(credentials: iLogin, ip:string, user_agent:string):Promise<iTokensAcceso> {
        try {
            //Consulta si el usuario existe en base de datos
            const usuario:iUsuario | null = await this.usuariosRepository.consultarUsuario(credentials.email);
            if(usuario == null){
                throw new Error('Credenciales invalidas');
            }else{
                const resultAutenticacion:iTokensAcceso = await autenticarUsuario(usuario, credentials.contrasena);
                let fechaExpiracionToken:Date = new Date();
                //Guardado del token de refresh en base de datos
                await guardarTokenUsuario(usuario, resultAutenticacion.refreshToken, 'REFRESH', ip, user_agent, fechaExpiracionToken);

                return resultAutenticacion;
            }
        } catch (error: any) {
            throw new Error(error.message || "Error al autenticar usuario en el servicio");
        }
    }
}
