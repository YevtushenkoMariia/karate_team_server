"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AthleteRepository = void 0;
const prisma_1 = require("../lib/prisma");
class AthleteRepository {
    async findAll() {
        return prisma_1.prisma.sportsmen.findMany({});
    }
    async findById(id) {
        return prisma_1.prisma.sportsmen.findUnique({
            where: { user_id: id },
        });
    }
}
exports.AthleteRepository = AthleteRepository;
