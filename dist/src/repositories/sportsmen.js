"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SportsmenRepository = void 0;
const prisma_1 = require("../lib/prisma");
class SportsmenRepository {
    async findAll() {
        return prisma_1.prisma.sportsmen.findMany({});
    }
    async findById(id) {
        return prisma_1.prisma.sportsmen.findUnique({
            where: { user_id: id },
        });
    }
}
exports.SportsmenRepository = SportsmenRepository;
