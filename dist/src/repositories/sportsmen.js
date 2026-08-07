"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sportsmenRepository = exports.SportsmenRepository = void 0;
const prisma_1 = require("../lib/prisma");
class SportsmenRepository {
    async upsertSportsmen(userId, sportsmenData) {
        await prisma_1.prisma.sportsmen.upsert({
            where: {
                user_id: userId,
            },
            update: sportsmenData,
            create: {
                user_id: userId,
                ...sportsmenData,
            },
        });
    }
    async buildSportsmenProfile(user) {
        if (!user || user.role !== "SPORTSMAN") {
            return null;
        }
        const coach = user.sportsmen?.coach_sportsman?.[0]?.coaches?.users ?? null;
        return {
            id: user.id,
            name: user.name,
            surname: user.surname,
            role: user.role,
            email: user.email,
            gender: user.gender,
            phone_number: user.phone_number,
            birth_date: user.birth_date,
            karate_level: user.sportsmen?.karate_level ?? null,
            city: user.sportsmen?.cities ?? null,
            club: user.sportsmen?.clubs ?? null,
            status: user.sportsmen?.status ?? null,
            coach,
        };
    }
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
exports.sportsmenRepository = new SportsmenRepository();
