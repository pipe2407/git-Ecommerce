export interface iCrearOrden {
  producto_id: string | number;
  cantidad: number;
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
}

export interface iOrdenPublica {
  id: string;
  producto: {
    id: string;
    nombre: string;
    precio: number;
    imagen: string | null;
  };
  comprador: {
    id: string;
    nombre: string;
    email: string;
  };
  cantidad: number;
  precioTotal: number;
  estado: string;
  fechaCreacion: string;
  fechaModificacion: string;
}
