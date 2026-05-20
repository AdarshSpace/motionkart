import "dotenv/config";
import { PrismaClient } from '../generated/prisma/client.js';
import { PrismaMariaDb } from "@prisma/adapter-mariadb";


const adapter = new PrismaMariaDb({
    host: "courses.c1wkkagk2kzu.ap-south-1.rds.amazonaws.com",
    port: 3306,
    user: "Adarsh",
    password: process.env.PASSWORD_SECRET!,
    database: "lms",
    allowPublicKeyRetrieval: true,
    ssl: false,
  });

export const prisma = new PrismaClient({ adapter });
