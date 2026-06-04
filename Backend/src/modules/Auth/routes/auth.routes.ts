import { Router } from "express";
import { login, register, logout, refresh } from "../Controller/auth.controller";

const authRoutes = Router();

// POST /auth/login
authRoutes.post("/login", login);
// POST /auth/register
authRoutes.post("/register", register);
// POST /auth/logout
authRoutes.post("/logout", logout);
// POST /auth/refresh
authRoutes.post("/refresh", refresh);

export default authRoutes;
