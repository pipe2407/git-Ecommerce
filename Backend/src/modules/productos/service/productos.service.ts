import { ProductosRepository } from "../repository/productos.repository";
import { iCrearProducto, iActualizarProducto, iProductoPublico } from "../models/productos.model";
import { validarRequerido, aBigInt } from "../../../utils/validaciones";
import { errorBadRequest, errorNoEncontrado } from "../../../utils/errores";

export class ProductosService {
  private repo: ProductosRepository;

  constructor() {
    this.repo = new ProductosRepository();
  }

  async listar(filtros?: { categoria?: string; pagina?: string; limite?: string }) {
    const pagina = Math.max(1, Number(filtros?.pagina) || 1);
    const limite = Math.min(100, Math.max(1, Number(filtros?.limite) || 12));

    let categoria_id: bigint | undefined;
    if (filtros?.categoria) {
      const catId = aBigInt(filtros.categoria, "categoria");
      categoria_id = catId;
    }

    const { datos, total } = await this.repo.listar({
      categoria_id,
      pagina,
      limite,
    });

    return {
      datos: datos.map((p: any) => this.mapear(p)),
      total,
      pagina,
      limite,
      totalPaginas: Math.ceil(total / limite),
    };
  }

  async obtener(idParam: string): Promise<iProductoPublico> {
    const id = aBigInt(idParam, "id");
    const producto = await this.repo.obtenerPorId(id);
    if (!producto) {
      throw errorNoEncontrado("Producto no encontrado");
    }
    return this.mapear(producto);
  }

  async crear(data: iCrearProducto, usuarioIdToken: string): Promise<iProductoPublico> {
    validarRequerido(data.nombre, "nombre");
    validarRequerido(data.descripcion, "descripcion");
    validarRequerido(data.precio, "precio");
    validarRequerido(String(data.stock), "stock");

    validarRequerido(data.categoria_id, "categoria_id");
    aBigInt(data.categoria_id, "categoria_id");
    const usuarioId = aBigInt(usuarioIdToken, "usuario_id");
    const precio = typeof data.precio === 'string' ? parseFloat(data.precio) : data.precio;

    if (isNaN(precio) || precio <= 0) {
      throw errorBadRequest("El precio debe ser un número mayor a 0");
    }

    const creado = await this.repo.crear({
      nombre: data.nombre,
      descripcion: data.descripcion,
      precio,
      precioOriginal: data.precioOriginal,
      imagen: data.imagen,
      categoria_id: data.categoria_id,
      stock: Number(data.stock),
      sku: data.sku,
      marca: data.marca,
      usuario_id: Number(usuarioId),
    });

    return this.mapear(creado);
  }

  async actualizar(idParam: string, data: iActualizarProducto, usuarioIdToken?: string): Promise<iProductoPublico> {
    const id = aBigInt(idParam, "id");
    const existente = await this.repo.obtenerPorId(id);

    if (!existente) {
      throw errorNoEncontrado("Producto no encontrado");
    }

    if (usuarioIdToken) {
      const usuarioId = aBigInt(usuarioIdToken, "usuario_id");
      if (existente.usuario_id !== usuarioId) {
        throw errorBadRequest("Solo el publicador puede actualizar este producto");
      }
    }

    const actualizado = await this.repo.actualizar(id, data);
    return this.mapear(actualizado);
  }

  async eliminar(idParam: string, usuarioIdToken?: string) {
    const id = aBigInt(idParam, "id");
    const existente = await this.repo.obtenerPorId(id);

    if (!existente) {
      throw errorNoEncontrado("Producto no encontrado");
    }

    if (usuarioIdToken) {
      const usuarioId = aBigInt(usuarioIdToken, "usuario_id");
      if (existente.usuario_id !== usuarioId) {
        throw errorBadRequest("Solo el publicador puede eliminar este producto");
      }
    }

    await this.repo.eliminar(id);
  }

  private mapear(p: any): iProductoPublico {
    return {
      id: p.id.toString(),
      nombre: p.nombre,
      descripcion: p.descripcion,
      precio: Number(p.precio),
      precioOriginal: p.precioOriginal ? Number(p.precioOriginal) : null,
      imagen: p.imagen,
      categoria: {
        id: p.categoria.id.toString(),
        nombre: p.categoria.nombre,
      },
      publicador: {
        id: p.publicador.id.toString(),
        nombre: p.publicador.nombre,
        email: p.publicador.email,
      },
      stock: p.stock,
      estado: p.estado,
      sku: p.sku,
      marca: p.marca,
      fechaCreacion: p.fechaCreacion.toISOString(),
      fechaModificacion: p.fechaModificacion.toISOString(),
    };
  }
}
