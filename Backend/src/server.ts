import cors from 'cors';
import router from './router/router';
import express, { Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { manejadorErrores } from './utils/errores';

// Serializacion segura de BigInt en respuestas JSON.
// Prisma usa BigInt para los ids; sin esto JSON.stringify lanza error.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

//Declaracion del servidor
const app = express();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,                 // Límite de requests por ventana
  message: { error: "Demasiadas peticiones, inténtalo más tarde" },
  standardHeaders: true,    // Devuelve información en headers RateLimit-*
  legacyHeaders: false,     // Desactiva X-RateLimit-* obsoletos
});

//Configuracion
app.set("trust proxy", false);
//Uso de middlewares
//Middleware de seguridad (permite envio de cookies desde el frontend)
app.use(cors({ origin: true, credentials: true }));
//Middleware para uso de json
app.use(express.json());
//Middleware para limitar la cantidad de peticiones por ip
app.use(limiter);
//Enrutador
app.use('/api', router);
//Redirigir las rutas no mapeadas
app.use((req: Request, res: Response) => {
    res.status(404).json({status: 'error', msg: 'Ruta no encontrada'});
});
//Middleware global de manejo de errores (debe ir al final)
app.use(manejadorErrores);


export default app;
