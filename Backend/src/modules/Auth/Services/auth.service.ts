import { compare } from "bcrypt";
import { SignOptions, sign } from "jsonwebtoken";
import { iUsuario } from "../../usuarios/Models/usuarios.model";
import { iRolesPermisos, iTokensAcceso, payloadTokenUser } from "../Models/auth.model";
import { env } from "../../../config/env";
import { AuthRepository } from "../Repository/auth.repository";

export const autenticarUsuario = async (user:iUsuario, contrasenaLogin:string) => {
    //Se valida la contrasena contra la hallada en base de datos
    const contrasenaBD = user.contrasena;
    const authRepository:AuthRepository = new AuthRepository();

    try{
        if(await compare(contrasenaLogin,contrasenaBD)){
            //Consulta de los permisos asociados al usuario
            let permisosUsuario:iRolesPermisos = await authRepository.consultarRolesUsuario(user);
            //Generacion de tokens de sesion    
            return generarTokens(user, permisosUsuario);
        }else{
            throw new Error('Credenciales invalidas');
        }
    }catch(error){
        throw new Error('Error validando el usuario. ' + error);
    }
}


export const generarTokens = (user:iUsuario, permisos:iRolesPermisos):iTokensAcceso => {
    const payloadToken: payloadTokenUser = {
        nombre_usuario : user.primer_nombre + " " + user.segundo_nombre + " " + user.primer_apellido + " " + user.segundo_apellido,
        identificacion : user.numero_identificacion,
        permisos: null
    }

    let payloadTokenAcess = payloadToken;
    payloadToken.permisos = permisos;

    const acessToken = sign(
        payloadTokenAcess,
        env.FIRMA_ACCESS_TOKEN,
        { expiresIn: env.ACCESS_TOKEN_DURATION as SignOptions["expiresIn"] }
    );

    const refreshToken = sign(
        payloadToken, 
        env.FIRMA_REFRESH_TOKEN,
        { expiresIn: env.REFRESH_TOKEN_DURATION as SignOptions["expiresIn"] }
    );

    return {
        accessToken : acessToken,
        refreshToken : refreshToken
    }
}

export const guardarTokenUsuario = async (user:iUsuario, token:string, tipo_token:('ACCESS' | 'REFRESH'), ip:string, user_agent:string, fecha_expiracion_token:Date) => {
    const authRepository:AuthRepository = new AuthRepository();
    try{
        authRepository.guardarTokenUsuario(user,token,tipo_token,ip,user_agent,fecha_expiracion_token);
    }catch(error){
        throw new Error('Error validando el usuario. ' + error);
    }
}