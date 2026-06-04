// DTOs del modulo de notificaciones

export interface iCrearNotificacion {
    asunto: string;
    descripcion: string;
    tipo_id: number | string;
    estado_id: number | string;
    categoria_id: number | string;
    plazo?: string;
    trimestre?: number;
    anioReporte?: number;
    entidad?: string;
    sector?: string;
    adjunto?: string;
    textoNotificacion?: string;
}

export interface iActualizarNotificacion {
    asunto?: string;
    descripcion?: string;
    tipo_id?: number | string;
    estado_id?: number | string;
    categoria_id?: number | string;
    plazo?: string;
    trimestre?: number;
    anioReporte?: number;
    entidad?: string;
    sector?: string;
    adjunto?: string;
    textoNotificacion?: string;
}

export interface iFiltrosNotificacion {
    tipo?: string;
    estado?: string;
    categoria?: string;
    pagina?: string;
    limite?: string;
}

export interface iCrearRespuesta {
    mensaje: string;
    adjunto?: string;
}
