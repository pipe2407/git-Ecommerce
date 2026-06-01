import 'dotenv/config';

export const env = {
    PORT : process.env.PORT ?? 3000,
    DB_URL : process.env.DB_URL ?? '',
    ENVIRONMENT: process.env.ENVIRONMENT ?? 'development',
    saltos_encriptacion: process.env.SALTG_PSWD ?? 10,
    FIRMA_ACCESS_TOKEN: process.env.FIRMA_ACCESS_TOKEN ?? '',
    FIRMA_REFRESH_TOKEN: process.env.FIRMA_REFRESH_TOKEN ?? '',
    ACCESS_TOKEN_DURATION: process.env.ACCESS_TOKEN_DURATION ?? '30min',
    REFRESH_TOKEN_DURATION: process.env.REFRESH_TOKEN_DURATION ?? '8d',
}