import { hash } from "bcrypt";
import { env } from "../../../config/env";
import { UsuariosRepository } from "../Repository/usuarios.repository";
import { iCrearUsuario, iActualizarUsuario, iUsuarioPublico } from "../Models/usuarios.model";
import { validarEmail, validarPassword, validarRequerido, aBigInt } from "../../../utils/validaciones";
import { errorBadRequest, errorNoEncontrado } from "../../../utils/errores";

type UsuarioConRol = {
    id: bigint;
    nombre: string;
    email: string;
    rol_id: bigint;
    estado: boolean;
    fechaCreacion: Date;
    fechaModificacion: Date;
    rol?: { nombre: string } | null;
};

export class UsuariosService {
    private usuariosRepository: UsuariosRepository;

    constructor() {
        this.usuariosRepository = new UsuariosRepository();
    }

    // Lista todos los usuarios
    async listar(): Promise<iUsuarioPublico[]> {
        const usuarios = await this.usuariosRepository.listar();
        return usuarios.map((u: UsuarioConRol) => this.mapear(u));
    }

    // Obtiene un usuario por id
    async obtener(idParam: string): Promise<iUsuarioPublico> {
        const id = aBigInt(idParam, "id");
        const usuario = await this.usuariosRepository.obtenerPorId(id);
        if (!usuario) {
            throw errorNoEncontrado("Usuario no encontrado");
        }
        return this.mapear(usuario);
    }

    // Crea un usuario con validaciones
    async crear(data: iCrearUsuario): Promise<iUsuarioPublico> {
        validarRequerido(data.nombre, "nombre");
        validarEmail(data.email);
        validarPassword(data.password);
        const rolId = aBigInt(data.rol_id, "rol_id");

        const rol = await this.usuariosRepository.existeRol(rolId);
        if (!rol) {
            throw errorBadRequest("El rol indicado no existe");
        }

        const existente = await this.usuariosRepository.obtenerPorEmail(data.email);
        if (existente) {
            throw errorBadRequest("El email ya esta registrado");
        }

        const passwordHasheada = await hash(data.password, env.saltos_encriptacion);

        const creado = await this.usuariosRepository.crear({
            nombre: data.nombre,
            email: data.email,
            password: passwordHasheada,
            rol_id: rolId,
            estado: data.estado ?? true,
        });

        return this.mapear(creado);
    }

    // Actualiza un usuario con validaciones
    async actualizar(idParam: string, data: iActualizarUsuario): Promise<iUsuarioPublico> {
        const id = aBigInt(idParam, "id");

        const usuario = await this.usuariosRepository.obtenerPorId(id);
        if (!usuario) {
            throw errorNoEncontrado("Usuario no encontrado");
        }

        const cambios: { nombre?: string; email?: string; password?: string; rol_id?: bigint; estado?: boolean } = {};

        if (data.nombre !== undefined) {
            validarRequerido(data.nombre, "nombre");
            cambios.nombre = data.nombre;
        }

        if (data.email !== undefined) {
            validarEmail(data.email);
            const otro = await this.usuariosRepository.obtenerPorEmail(data.email);
            if (otro && otro.id !== id) {
                throw errorBadRequest("El email ya esta registrado por otro usuario");
            }
            cambios.email = data.email;
        }

        if (data.password !== undefined) {
            validarPassword(data.password);
            cambios.password = await hash(data.password, env.saltos_encriptacion);
        }

        if (data.rol_id !== undefined) {
            const rolId = aBigInt(data.rol_id, "rol_id");
            const rol = await this.usuariosRepository.existeRol(rolId);
            if (!rol) {
                throw errorBadRequest("El rol indicado no existe");
            }
            cambios.rol_id = rolId;
        }

        if (data.estado !== undefined) {
            cambios.estado = data.estado;
        }

        const actualizado = await this.usuariosRepository.actualizar(id, cambios);
        return this.mapear(actualizado);
    }

    // Elimina un usuario
    async eliminar(idParam: string): Promise<void> {
        const id = aBigInt(idParam, "id");
        const usuario = await this.usuariosRepository.obtenerPorId(id);
        if (!usuario) {
            throw errorNoEncontrado("Usuario no encontrado");
        }
        await this.usuariosRepository.eliminar(id);
    }

    // Mapea entidad a representacion publica (sin password)
    private mapear(usuario: UsuarioConRol): iUsuarioPublico {
        return {
            id: usuario.id.toString(),
            nombre: usuario.nombre,
            email: usuario.email,
            rol_id: usuario.rol_id.toString(),
            rol: usuario.rol?.nombre,
            estado: usuario.estado,
            fechaCreacion: usuario.fechaCreacion,
            fechaModificacion: usuario.fechaModificacion,
        };
    }
}
