// DTOs del modulo de categorias

export interface iCrearCategoria {
    nombre: string;
    descripcion?: string;
    estado?: boolean;
}

export interface iCategoriaPublica {
    id: string;
    nombre: string;
    descripcion: string | null;
    estado: boolean;
}
