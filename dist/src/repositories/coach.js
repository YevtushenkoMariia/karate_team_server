"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.coachRepository = exports.CoachRepository = void 0;
const prisma_1 = require("../lib/prisma");
class CoachRepository {
    async upsertCoach(userId, coachData) {
        await prisma_1.prisma.coaches.upsert({
            where: {
                user_id: userId,
            },
            update: coachData,
            create: {
                user_id: userId,
                ...coachData,
            },
        });
    }
    async buildCoachProfile(user) {
        if (!user || user.role !== "COACH") {
            return null;
        }
        return {
            id: user.id,
            name: user.name,
            surname: user.surname,
            role: user.role,
            email: user.email,
            gender: user.gender,
            phone_number: user.phone_number,
            birth_date: user.birth_date,
            karate_level: user.coaches?.karate_level ?? null,
            city: user.coaches?.cities ?? null,
            club: user.coaches?.clubs ?? null,
            position: user.coaches?.position ?? null,
            specialization: user.coaches?.specialization ?? null,
        };
    }
}
exports.CoachRepository = CoachRepository;
exports.coachRepository = new CoachRepository();
