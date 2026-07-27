"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const adapter_pg_1 = require("@prisma/adapter-pg");
const client_1 = require("../../generated/prisma/client"); // ✅ новий шлях
const adapter = new adapter_pg_1.PrismaPg({
    connectionString: process.env.DATABASE_URL,
});
exports.prisma = new client_1.PrismaClient({ adapter });
// import this every where you need to use Prisma, for example in your API routes or services.
// import { prisma } from '../lib/prisma';
