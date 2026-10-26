import "dotenv/config";
import pg from "pg";
import {PrismaPg} from "@prisma/adapter-pg";
import {PrismaClient} from "../generated/prisma/client"

const globalPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

const urlSinValidar = import.meta.env?.DATABASE_URL ?? process.env.DATABASE_URL;
const URL = (urlSinValidar ?? "").trim();

if(!URL){
    throw new Error("Error en la URL, verificar .env");
};

let instanciaPrisma: PrismaClient;

if (globalPrisma.prisma) {
    instanciaPrisma = globalPrisma.prisma
}else {
    const pool = new pg.Pool({connectionString: URL})

    const adapter = new PrismaPg(pool);

    instanciaPrisma = new PrismaClient({adapter})

    if(process.env.NODE_ENV !== "production"){
        globalPrisma.prisma = instanciaPrisma
    }
}

export const prisma = instanciaPrisma
export default prisma