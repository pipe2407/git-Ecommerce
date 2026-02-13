import { Request, Response, Router } from "express";

const router = Router();

router.post('/prueba', (request: Request, response: Response) => {
    response.status(200).json({"mensaje" : "Hola mundo :D"});
})

export default router;