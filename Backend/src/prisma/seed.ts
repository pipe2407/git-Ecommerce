import { hash } from "bcrypt";
import { prismaClient } from "./prisma.client";
import { env } from "../config/env";

/**
 * Seed de datos iniciales del sistema de notificaciones.
 * Crea: roles, usuarios de prueba, categorias, tipos, estados y notificaciones.
 * Es idempotente: usa upsert para no duplicar datos maestros.
 */
async function main() {
    console.log("Iniciando seed...");

    // ---------------------------------------------------------------
    // 1. ROLES (admin, seller, buyer)
    // ---------------------------------------------------------------
    const rolesData = [
        { nombre: "admin", descripcion: "Administrador del sistema" },
        { nombre: "seller", descripcion: "Vendedor que publica productos" },
        { nombre: "buyer", descripcion: "Comprador que realiza pedidos" },
    ];

    const roles: Record<string, bigint> = {};
    for (const rol of rolesData) {
        const creado = await prismaClient.roles.upsert({
            where: { nombre: rol.nombre },
            update: { descripcion: rol.descripcion },
            create: { nombre: rol.nombre, descripcion: rol.descripcion },
        });
        roles[rol.nombre] = creado.id;
    }
    console.log("Roles creados.");

    // ---------------------------------------------------------------
    // 2. USUARIOS de prueba (password: 123456)
    // ---------------------------------------------------------------
    const passwordHasheada = await hash("123456", env.saltos_encriptacion);
    const usuariosData = [
        { nombre: "Administrador", email: "admin@test.com", rol: "admin" },
        { nombre: "Vendedor", email: "seller@test.com", rol: "seller" },
        { nombre: "Comprador", email: "buyer@test.com", rol: "buyer" },
    ];

    const usuarios: Record<string, bigint> = {};
    for (const u of usuariosData) {
        const creado = await prismaClient.usuarios.upsert({
            where: { email: u.email },
            update: { nombre: u.nombre, rol_id: roles[u.rol] },
            create: {
                nombre: u.nombre,
                email: u.email,
                password: passwordHasheada,
                rol_id: roles[u.rol],
            },
        });
        usuarios[u.email] = creado.id;
    }
    console.log("Usuarios creados (password de todos: 123456).");

    // ---------------------------------------------------------------
    // 3. CATEGORIAS (Notificaciones y Productos)
    // ---------------------------------------------------------------
    const categoriasData = [
        // Categorías de Notificaciones
        { nombre: "Peticiones", descripcion: "Peticiones, quejas, sugerencias" },
        { nombre: "Quejas", descripcion: "Categoría de quejas" },
        { nombre: "Sugerencias", descripcion: "Categoría de sugerencias" },
        { nombre: "Reclamos", descripcion: "Categoría de reclamos" },
        { nombre: "Informacion", descripcion: "Información general" },
        // Categorías de Productos
        { nombre: "Electrónica", descripcion: "Productos electrónicos" },
        { nombre: "Smartphones", descripcion: "Teléfonos móviles" },
        { nombre: "Computadoras", descripcion: "Laptops y computadoras" },
        { nombre: "Accesorios", descripcion: "Accesorios electrónicos" },
    ];
    const categorias: Record<string, bigint> = {};
    for (const cat of categoriasData) {
        const creada = await prismaClient.categoria.upsert({
            where: { nombre: cat.nombre },
            update: { descripcion: cat.descripcion },
            create: { nombre: cat.nombre, descripcion: cat.descripcion },
        });
        categorias[cat.nombre] = creada.id;
    }
    console.log("Categorias creadas.");

    // ---------------------------------------------------------------
    // 4. TIPOS DE NOTIFICACION
    // ---------------------------------------------------------------
    const tiposData = ["Email", "Carta", "Presencial", "Telefonico", "Digital"];
    const tipos: bigint[] = [];
    for (const nombre of tiposData) {
        const creado = await prismaClient.tiponotificaciones.upsert({
            where: { nombre },
            update: {},
            create: { nombre },
        });
        tipos.push(creado.id);
    }
    console.log("Tipos de notificacion creados.");

    // ---------------------------------------------------------------
    // 5. ESTADOS DE NOTIFICACION
    // ---------------------------------------------------------------
    const estadosData = ["Pendiente", "En Proceso", "Respondida", "Cerrada", "Rechazada"];
    const estados: bigint[] = [];
    for (const nombre of estadosData) {
        const creado = await prismaClient.estadonotificacion.upsert({
            where: { nombre },
            update: {},
            create: { nombre },
        });
        estados.push(creado.id);
    }
    console.log("Estados de notificacion creados.");

    // ---------------------------------------------------------------
    // 6. NOTIFICACIONES de ejemplo (10)
    // ---------------------------------------------------------------
    const totalExistentes = await prismaClient.modulonotificaciones.count();
    if (totalExistentes === 0) {
        const remitentes = [usuarios["seller@test.com"], usuarios["admin@test.com"]];
        const categoriasNotificaciones = ["Peticiones", "Quejas", "Sugerencias", "Reclamos", "Informacion"];
        const notificaciones = [];
        for (let i = 1; i <= 10; i++) {
            notificaciones.push({
                asunto: `Notificacion de ejemplo #${i}`,
                descripcion: `Descripcion detallada de la notificacion numero ${i} generada por el seed.`,
                tipo_id: tipos[i % tipos.length],
                estado_id: estados[i % estados.length],
                categoria_id: categorias[categoriasNotificaciones[i % categoriasNotificaciones.length]],
                usuario_id: remitentes[i % remitentes.length],
                trimestre: ((i - 1) % 4) + 1,
                anioReporte: 2026,
                entidad: `Entidad ${i}`,
                sector: `Sector ${(i % 3) + 1}`,
                textoNotificacion: `Texto de la notificacion ${i}.`,
            });
        }
        await prismaClient.modulonotificaciones.createMany({ data: notificaciones });
        console.log("10 notificaciones de ejemplo creadas.");
    } else {
        console.log(`Ya existen ${totalExistentes} notificaciones, se omite la insercion de ejemplos.`);
    }

    console.log("Seed completado correctamente.");
}

main()
    .catch((error) => {
        console.error("Error ejecutando el seed:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prismaClient.$disconnect();
    });
