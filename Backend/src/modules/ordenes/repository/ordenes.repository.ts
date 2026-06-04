import { prismaClient } from "../../../prisma/prisma.client";

export class OrdenesRepository {
  async listarPorComprador(comprador_id: bigint) {
    return prismaClient.ordenes.findMany({
      where: { comprador_id },
      include: {
        producto: { select: { id: true, nombre: true, precio: true, imagen: true } },
        comprador: { select: { id: true, nombre: true, email: true } },
      },
      orderBy: { fechaCreacion: 'desc' },
    });
  }

  async obtenerPorId(id: bigint) {
    return prismaClient.ordenes.findUnique({
      where: { id },
      include: {
        producto: { select: { id: true, nombre: true, precio: true, imagen: true } },
        comprador: { select: { id: true, nombre: true, email: true } },
      },
    });
  }

  async crear(data: {
    producto_id: bigint;
    comprador_id: bigint;
    cantidad: number;
    precioTotal: number;
    nombreComprador?: string;
    emailComprador?: string;
    direccion?: string;
    ciudad?: string;
    departamento?: string;
    codigoPostal?: string;
    telefonoComprador?: string;
    metodoPago?: string;
    numeroTarjeta?: string;
    nombreTitular?: string;
    fechaVencimiento?: string;
  }) {
    return prismaClient.ordenes.create({
      data: {
        producto_id: data.producto_id,
        comprador_id: data.comprador_id,
        cantidad: data.cantidad,
        precioTotal: data.precioTotal,
        estado: "pendiente",
        nombreComprador: data.nombreComprador,
        emailComprador: data.emailComprador,
        direccion: data.direccion,
        ciudad: data.ciudad,
        departamento: data.departamento,
        codigoPostal: data.codigoPostal,
        telefonoComprador: data.telefonoComprador,
        metodoPago: data.metodoPago,
        numeroTarjeta: data.numeroTarjeta,
        nombreTitular: data.nombreTitular,
        fechaVencimiento: data.fechaVencimiento,
      },
      include: {
        producto: { select: { id: true, nombre: true, precio: true, imagen: true } },
        comprador: { select: { id: true, nombre: true, email: true } },
      },
    });
  }

  async actualizar(id: bigint, estado: string) {
    return prismaClient.ordenes.update({
      where: { id },
      data: { estado },
      include: {
        producto: { select: { id: true, nombre: true, precio: true, imagen: true } },
        comprador: { select: { id: true, nombre: true, email: true } },
      },
    });
  }
}
