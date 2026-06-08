import { hash, compare } from "bcrypt";
import { env } from "../../../config/env";
import { AuthRepository } from "../Repository/auth.repository";
import { iLogin, iRegistro, iRespuestaLogin, iUsuarioPublico } from "../Models/auth.model";
import { generarAccessToken, generarRefreshToken, verificarRefreshToken, PayloadToken } from "../../../utils/jwt";
import { validarEmail, validarPassword, validarRequerido, aBigInt } from "../../../utils/validaciones";
import { AppError, errorBadRequest, errorNoAutorizado } from "../../../utils/errores";

// Rol por defecto cuando un usuario se registra publicamente
const ROL_POR_DEFECTO = "buyer";

export class AuthService {
    private authRepository: AuthRepository;

    constructor() {
        this.authRepository = new AuthRepository();
    }

    /**
     * Login: valida credenciales y retorna tokens + datos publicos del usuario.
     */
    async login(credenciales: iLogin): Promise<iRespuestaLogin> {
        validarRequerido(credenciales.email, "email");
        validarRequerido(credenciales.password, "password");

        const usuario = await this.authRepository.buscarPorEmail(credenciales.email);
        if (!usuario || !usuario.estado) {
            throw errorNoAutorizado("Credenciales invalidas");
        }

        const passwordValida = await compare(credenciales.password, usuario.password);
        if (!passwordValida) {
            throw errorNoAutorizado("Credenciales invalidas");
        }

        const payload: PayloadToken = {
            usuario_id: usuario.id.toString(),
            email: usuario.email,
            rol: usuario.rol.nombre,
        };

        return {
            token: generarAccessToken(payload),
            refreshToken: generarRefreshToken(payload),
            usuario: this.mapearUsuarioPublico(usuario),
        };
    }

    /**
     * Registro: crea un usuario nuevo validando email unico y password.
     */
    async registrar(data: iRegistro): Promise<iUsuarioPublico> {
        validarRequerido(data.nombre, "nombre");
        validarEmail(data.email);
        validarPassword(data.password);

        const existente = await this.authRepository.buscarPorEmail(data.email);
        if (existente) {
            throw errorBadRequest("El email ya esta registrado");
        }

        // Resolver el rol: por id si llega, o el rol por defecto
        let rolId: bigint;
        if (data.rol_id !== undefined && data.rol_id !== null && `${data.rol_id}` !== "") {
            rolId = aBigInt(data.rol_id, "rol_id");
            const rol = await this.authRepository.buscarRolPorId(rolId);
            if (!rol) {
                throw errorBadRequest("El rol indicado no existe");
            }
        } else {
            const rolDefecto = await this.authRepository.buscarRolPorNombre(ROL_POR_DEFECTO);
            if (!rolDefecto) {
                throw new AppError("No existe el rol por defecto. Ejecute el seed.", 500);
            }
            rolId = rolDefecto.id;
        }

        const passwordHasheada = await hash(data.password, env.saltos_encriptacion);

        const creado = await this.authRepository.crearUsuario({
            nombre: data.nombre,
            email: data.email,
            password: passwordHasheada,
            rol_id: rolId,
        });

        return this.mapearUsuarioPublico(creado);
    }

    /**
     * Refresh: genera un nuevo access token a partir de un refresh token valido.
     */
    async refrescarToken(refreshToken: string): Promise<{ token: string }> {
        if (!refreshToken) {
            throw errorNoAutorizado("No se proporciono refresh token");
        }

        let payload: PayloadToken;
        try {
            payload = verificarRefreshToken(refreshToken);
        } catch (_error) {
            throw errorNoAutorizado("Refresh token invalido o expirado");
        }

        const usuario = await this.authRepository.buscarPorId(aBigInt(payload.usuario_id, "usuario_id"));
        if (!usuario || !usuario.estado) {
            throw errorNoAutorizado("Usuario no valido");
        }

        const nuevoPayload: PayloadToken = {
            usuario_id: usuario.id.toString(),
            email: usuario.email,
            rol: usuario.rol.nombre,
        };

        return { token: generarAccessToken(nuevoPayload) };
    }

    /**
     * Cambiar contraseña: permite resetear la contraseña usando email y nueva contraseña.
     * Valida que el usuario exista, esté activo, y que la contraseña cumpla requerimientos.
     *
     * ADVERTENCIA DE SEGURIDAD: Este endpoint es vulnerable a account takeover.
     * Cualquiera que conozca el email de un usuario puede cambiar su contraseña sin verificación.
     * En producción, implementar: OTP, token temporal enviado por email, o autenticación.
     */
    async cambiarContrasena(email: string, nuevaContrasena: string): Promise<{ mensaje: string }> {
        validarEmail(email);
        validarPassword(nuevaContrasena);

        const usuario = await this.authRepository.buscarPorEmail(email);
        if (!usuario || !usuario.estado) {
            throw errorBadRequest("El email no existe o la cuenta esta desactivada");
        }

        const passwordHasheada = await hash(nuevaContrasena, env.saltos_encriptacion);

        await this.authRepository.actualizarPassword(usuario.id, passwordHasheada);

        return { mensaje: "Contraseña actualizada correctamente" };
    }

    // Mapea la entidad de BD a su representacion publica (sin password)
    private mapearUsuarioPublico(usuario: { id: bigint; nombre: string; email: string; rol: { nombre: string } }): iUsuarioPublico {
        return {
            id: usuario.id.toString(),
            nombre: usuario.nombre,
            email: usuario.email,
            rol: usuario.rol.nombre,
        };
    }
}
