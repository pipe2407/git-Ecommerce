import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { env } from "../config/env";

export class PrismaClientSingleton {
    private static instance: PrismaClient;

    private constructor() {}

    public static getInstance(): PrismaClient {
        if (!PrismaClientSingleton.instance) {
            const pool = new Pool({
                connectionString: env.DB_URL
            });
            const adapter = new PrismaPg(pool);
            PrismaClientSingleton.instance = new PrismaClient({ adapter });
        }
        return PrismaClientSingleton.instance;
    }
}

// Exportar la instancia directamente para mayor comodidad
export const prismaClient = PrismaClientSingleton.getInstance();
