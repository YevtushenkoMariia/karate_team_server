"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.locationRepository = exports.LocationRepository = void 0;
const prisma_1 = require("../lib/prisma");
class LocationRepository {
    async getAllCities() {
        return prisma_1.prisma.cities.findMany({
            select: {
                id: true,
                name: true,
            },
        });
    }
    async getAllClubs() {
        return prisma_1.prisma.clubs.findMany({
            select: {
                id: true,
                name: true,
            },
        });
    }
    async findOrCreateCity(cityName) {
        const existingCity = await prisma_1.prisma.cities.findFirst({
            where: { name: { equals: cityName, mode: "insensitive" } },
            select: { id: true },
        });
        if (existingCity) {
            return existingCity.id;
        }
        const createdCity = await prisma_1.prisma.cities.create({
            data: { name: cityName },
            select: { id: true },
        });
        return createdCity.id;
    }
    async findOrCreateClub(clubName, cityId) {
        const existingClub = await prisma_1.prisma.clubs.findFirst({
            where: { name: { equals: clubName, mode: "insensitive" } },
            select: { id: true, city_id: true },
        });
        if (existingClub) {
            if (cityId !== null && existingClub.city_id == null) {
                await prisma_1.prisma.clubs.update({
                    where: { id: existingClub.id },
                    data: { city_id: cityId },
                });
            }
            return existingClub.id;
        }
        const createdClub = await prisma_1.prisma.clubs.create({
            data: {
                name: clubName,
                city_id: cityId ?? undefined,
            },
            select: { id: true },
        });
        return createdClub.id;
    }
}
exports.LocationRepository = LocationRepository;
exports.locationRepository = new LocationRepository();
