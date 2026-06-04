// DTOs de salida del modulo de reportes

export interface iResumenReporte {
    totalUsuarios: number;
    totalNotificaciones: number;
    totalRespuestas: number;
}

export interface iEstadisticaItem {
    id: string;
    nombre: string;
    total: number;
}
