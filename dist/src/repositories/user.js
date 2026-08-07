"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const prisma_1 = require("../lib/prisma");
const admin_1 = require("./admin");
const coach_1 = require("./coach");
const sportsmen_1 = require("./sportsmen");
class UserRepository {
    async createUser(data) {
        return prisma_1.prisma.$transaction(async (tx) => {
            // creating default user
            const user = await tx.users.create({
                data: {
                    name: data.name,
                    surname: data.surname,
                    email: data.email,
                    password: data.password,
                    role: data.role,
                },
            });
            // create in db additional field in table according to the role
            if (data.role === "COACH") {
                await tx.coaches.create({
                    data: {
                        user_id: user.id,
                    },
                });
            }
            if (data.role === "SPORTSMAN") {
                await tx.sportsmen.create({
                    data: {
                        user_id: user.id,
                    },
                });
            }
            return user;
        });
    }
    async updateUserProfile(data) {
        const { userId, ...updateData } = data;
        if (Object.keys(updateData).length > 0) {
            await prisma_1.prisma.users.update({
                where: { id: userId },
                data: updateData,
            });
        }
    }
    async IsUserExistsEmail(email) {
        return prisma_1.prisma.users.findUnique({
            where: { email: email },
        });
    }
    async IsUserExistsId(id) {
        return prisma_1.prisma.users.findUnique({
            where: { id: id },
        });
    }
    async getUserRoleById(id) {
        const user = await prisma_1.prisma.users.findUnique({
            where: { id: id },
            select: { role: true },
        });
        return user?.role;
    }
    async getUserWithProfileRelations(id) {
        return prisma_1.prisma.users.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                surname: true,
                email: true,
                role: true,
                gender: true,
                phone_number: true,
                birth_date: true,
                sportsmen: {
                    select: {
                        karate_level: true,
                        status: true,
                        cities: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                        clubs: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                        coach_sportsman: {
                            select: {
                                coaches: {
                                    select: {
                                        users: {
                                            select: {
                                                id: true,
                                                name: true,
                                                surname: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                coaches: {
                    select: {
                        karate_level: true,
                        position: true,
                        specialization: true,
                        cities: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                        clubs: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
            },
        });
    }
    async getUserProfileById(id) {
        const user = await this.getUserWithProfileRelations(id);
        if (!user) {
            return null;
        }
        if (user.role === "COACH") {
            return coach_1.coachRepository.buildCoachProfile(user);
        }
        if (user.role === "SPORTSMAN") {
            return sportsmen_1.sportsmenRepository.buildSportsmenProfile(user);
        }
        return admin_1.adminRepository.buildAdminProfile(user);
    }
}
exports.UserRepository = UserRepository;
