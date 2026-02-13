import cors from 'cors';
import router from './router/router';
import express, { Response } from 'express';
import rateLimit from 'express-rate-limit';

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
//Middleware de seguridad
app.use(cors());
//Middleware para uso de json
app.use(express.json());
//Middleware para limitar la cantidad de peticiones por ip
app.use(limiter);
//Enrutador
app.use('/api', router);
//Redirigir las rutas no mapeadas
app.use((res:Response) => {
    res.status(404).json({status: 'error', msg: 'Ruta no encontrada'});
});


export default app;