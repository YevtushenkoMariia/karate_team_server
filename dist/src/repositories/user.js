"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const client_1 = require("../../generated/prisma/client");
const prisma_1 = require("../lib/prisma");
class UserRepository {
    async createUser(data) {
        return prisma_1.prisma.$transaction(async (tx) => {
            const user = await tx.users.create({
                data: {
                    name: data.name,
                    surname: data.surname,
                    email: data.email,
                    password: data.password,
                    role: data.role,
                },
            });
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
    async findOrCreateCity(tx, cityName) {
        const existingCity = await tx.cities.findFirst({
            where: { name: { equals: cityName, mode: "insensitive" } },
            select: { id: true },
        });
        if (existingCity) {
            return existingCity.id;
        }
        const createdCity = await tx.cities.create({
            data: { name: cityName },
            select: { id: true },
        });
        return createdCity.id;
    }
    async findOrCreateClub(tx, clubName, cityId) {
        const existingClub = await tx.clubs.findFirst({
            where: { name: { equals: clubName, mode: "insensitive" } },
            select: { id: true, city_id: true },
        });
        if (existingClub) {
            if (cityId !== null && existingClub.city_id == null) {
                await tx.clubs.update({
                    where: { id: existingClub.id },
                    data: { city_id: cityId },
                });
            }
            return existingClub.id;
        }
        const createdClub = await tx.clubs.create({
            data: {
                name: clubName,
                city_id: cityId ?? undefined,
            },
            select: { id: true },
        });
        return createdClub.id;
    }
    async updateUserProfile(data) {
        await prisma_1.prisma.$transaction(async (tx) => {
            let cityId = null;
            if (data.cityName?.trim()) {
                cityId = await this.findOrCreateCity(tx, data.cityName.trim());
            }
            let clubId = null;
            if (data.clubName?.trim()) {
                clubId = await this.findOrCreateClub(tx, data.clubName.trim(), cityId);
            }
            const updateData = {};
            if (data.name !== undefined)
                updateData.name = data.name;
            if (data.surname !== undefined)
                updateData.surname = data.surname;
            if (data.email !== undefined)
                updateData.email = data.email;
            if (data.gender !== undefined)
                updateData.gender = data.gender;
            if (data.phone_number !== undefined)
                updateData.phone_number = data.phone_number;
            if (data.birth_date !== undefined)
                updateData.birth_date = data.birth_date;
            if (Object.keys(updateData).length > 0) {
                await tx.users.update({
                    where: { id: data.userId },
                    data: updateData,
                });
            }
            if (data.role === client_1.role_type.COACH) {
                await tx.coaches.upsert({
                    where: { user_id: data.userId },
                    update: {
                        ...(data.karate_level !== undefined ? { karate_level: data.karate_level } : {}),
                        ...(data.position !== undefined ? { position: data.position } : {}),
                        ...(data.specialization !== undefined ? { specialization: data.specialization } : {}),
                        ...(cityId !== null ? { city_id: cityId } : {}),
                        ...(clubId !== null ? { club_id: clubId } : {}),
                    },
                    create: {
                        user_id: data.userId,
                        ...(data.karate_level !== undefined ? { karate_level: data.karate_level } : {}),
                        ...(data.position !== undefined ? { position: data.position } : {}),
                        ...(data.specialization !== undefined ? { specialization: data.specialization } : {}),
                        ...(cityId !== null ? { city_id: cityId } : {}),
                        ...(clubId !== null ? { club_id: clubId } : {}),
                    },
                });
            }
            if (data.role === client_1.role_type.SPORTSMAN) {
                await tx.sportsmen.upsert({
                    where: { user_id: data.userId },
                    update: {
                        ...(data.karate_level !== undefined ? { karate_level: data.karate_level } : {}),
                        ...(data.status !== undefined ? { status: data.status } : {}),
                        ...(cityId !== null ? { city_id: cityId } : {}),
                        ...(clubId !== null ? { club_id: clubId } : {}),
                    },
                    create: {
                        user_id: data.userId,
                        ...(data.karate_level !== undefined ? { karate_level: data.karate_level } : {}),
                        ...(data.status !== undefined ? { status: data.status } : {}),
                        ...(cityId !== null ? { city_id: cityId } : {}),
                        ...(clubId !== null ? { club_id: clubId } : {}),
                    },
                });
            }
        });
        return this.getUserProfileById(data.userId);
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
    async buildSportsmenProfile(id) {
        const user = await this.getUserWithProfileRelations(id);
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
    async buildCoachProfile(id) {
        const user = await this.getUserWithProfileRelations(id);
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
    async buildAdminProfile(id) {
        const user = await this.getUserWithProfileRelations(id);
        if (!user || user.role !== "ADMIN") {
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
        };
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
            return this.buildCoachProfile(id);
        }
        if (user.role === "SPORTSMAN") {
            return this.buildSportsmenProfile(id);
        }
        return this.buildAdminProfile(id);
    }
}
exports.UserRepository = UserRepository;
