import { prismaClient } from "../../../prisma/prisma.client";
import { iCrearProducto, iActualizarProducto } from "../models/productos.model";

export class ProductosRepository {
  async listar(filtros?: { categoria_id?: bigint; pagina?: number; limite?: number }) {
    const pagina = filtros?.pagina ?? 1;
    const limite = filtros?.limite ?? 10;
    const skip = (pagina - 1) * limite;

    const where: any = { estado: true };
    if (filtros?.categoria_id) where.categoria_id = filtros.categoria_id;

    const [datos, total] = await Promise.all([
      prismaClient.productos.findMany({
        where,
        skip,
        take: limite,
        include: { categoria: true, publicador: { select: { id: true, nombre: true, email: true } } },
        orderBy: { fechaCreacion: 'desc' },
      }),
      prismaClient.productos.count({ where }),
    ]);

    return { datos, total };
  }

  async obtenerPorId(id: bigint) {
    return prismaClient.productos.findUnique({
      where: { id },
      include: { categoria: true, publicador: { select: { id: true, nombre: true, email: true } } },
    });
  }

  async crear(data: iCrearProducto & { usuario_id: string | number }) {
    return prismaClient.productos.create({
      data: {
        nombre: data.nombre,
        descripcion: data.descripcion,
        precio: typeof data.precio === 'string' ? parseFloat(data.precio) : data.precio,
        precioOriginal: data.precioOriginal ? (typeof data.precioOriginal === 'string' ? parseFloat(data.precioOriginal) : data.precioOriginal) : null,
        imagen: data.imagen ?? null,
        categoria_id: BigInt(data.categoria_id),
        usuario_id: BigInt(data.usuario_id),
        stock: data.stock,
        sku: data.sku ?? null,
        marca: data.marca ?? null,
      },
      include: { categoria: true, publicador: { select: { id: true, nombre: true, email: true } } },
    });
  }

  async actualizar(id: bigint, data: iActualizarProducto) {
    const updates: any = {};
    if (data.nombre) updates.nombre = data.nombre;
    if (data.descripcion) updates.descripcion = data.descripcion;
    if (data.precio) updates.precio = typeof data.precio === 'string' ? parseFloat(data.precio) : data.precio;
    if (data.precioOriginal) updates.precioOriginal = typeof data.precioOriginal === 'string' ? parseFloat(data.precioOriginal) : data.precioOriginal;
    if (data.imagen) updates.imagen = data.imagen;
    if (data.categoria_id) updates.categoria_id = BigInt(data.categoria_id);
    if (data.stock !== undefined) updates.stock = data.stock;
    if (data.sku) updates.sku = data.sku;
    if (data.marca) updates.marca = data.marca;
    if (data.estado !== undefined) updates.estado = data.estado;

    return prismaClient.productos.update({
      where: { id },
      data: updates,
      include: { categoria: true, publicador: { select: { id: true, nombre: true, email: true } } },
    });
  }

  async eliminar(id: bigint) {
    return prismaClient.productos.delete({ where: { id } });
  }

  async decrementarStock(id: bigint, cantidad: number) {
    return prismaClient.productos.update({
      where: { id },
      data: { stock: { decrement: cantidad } },
    });
  }
}
