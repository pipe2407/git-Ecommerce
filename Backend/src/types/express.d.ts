import { Request } from "express";
import { PayloadToken } from "../utils/jwt";

export interface RequestAutenticado extends Request {
    usuario: PayloadToken;
}
