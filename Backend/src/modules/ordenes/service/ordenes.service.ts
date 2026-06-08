import { OrdenesRepository } from "../repository/ordenes.repository";
import { ProductosRepository } from "../../productos/repository/productos.repository";
import { iCrearOrden, iOrdenPublica } from "../models/ordenes.model";
import { validarRequerido, aBigInt } from "../../../utils/validaciones";
import { errorBadRequest, errorNoEncontrado } from "../../../utils/errores";

export class OrdenesService {
  private repo: OrdenesRepository;
  private productosRepo: ProductosRepository;

  constructor() {
    this.repo = new OrdenesRepository();
    this.productosRepo = new ProductosRepository();
  }

  async listarMisOrdenes(compradorIdToken: string): Promise<iOrdenPublica[]> {
    const compradorId = aBigInt(compradorIdToken, "comprador_id");
    const ordenes = await this.repo.listarPorComprador(compradorId);
    return ordenes.map((o) => this.mapear(o));
  }

  async listarTodas(): Promise<iOrdenPublica[]> {
    const ordenes = await this.repo.listar();
    return ordenes.map((o) => this.mapear(o));
  }

  async obtener(idParam: string): Promise<iOrdenPublica> {
    const id = aBigInt(idParam, "id");
    const orden = await this.repo.obtenerPorId(id);
    if (!orden) {
      throw errorNoEncontrado("Orden no encontrada");
    }
    return this.mapear(orden);
  }

  async crear(data: iCrearOrden, compradorIdToken: string): Promise<iOrdenPublica> {
    validarRequerido(String(data.producto_id), "producto_id");
    validarRequerido(String(data.cantidad), "cantidad");

    const productoId = aBigInt(data.producto_id, "producto_id");
    const compradorId = aBigInt(compradorIdToken, "comprador_id");
    const cantidad = Number(data.cantidad);

    if (cantidad <= 0) {
      throw errorBadRequest("La cantidad debe ser mayor a 0");
    }

    const producto = await this.productosRepo.obtenerPorId(productoId);
    if (!producto) {
      throw errorNoEncontrado("Producto no encontrado");
    }

    if (producto.stock < cantidad) {
      throw errorBadRequest(`No hay suficiente stock. Disponible: ${producto.stock}`);
    }

    const precioTotal = Number(producto.precio) * cantidad;

    const orden = await this.repo.crear({
      producto_id: productoId,
      comprador_id: compradorId,
      cantidad,
      precioTotal,
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
    });

    await this.productosRepo.decrementarStock(productoId, cantidad);

    return this.mapear(orden);
  }

  private mapear(o: any): iOrdenPublica {
    return {
      id: o.id.toString(),
      producto: {
        id: o.producto.id.toString(),
        nombre: o.producto.nombre,
        precio: Number(o.producto.precio),
        imagen: o.producto.imagen,
      },
      comprador: {
        id: o.comprador.id.toString(),
        nombre: o.comprador.nombre,
        email: o.comprador.email,
      },
      cantidad: o.cantidad,
      precioTotal: Number(o.precioTotal),
      estado: o.estado,
      fechaCreacion: o.fechaCreacion.toISOString(),
      fechaModificacion: o.fechaModificacion.toISOString(),
    };
  }
}
