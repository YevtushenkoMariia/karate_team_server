"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationRepository = void 0;
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
}
exports.LocationRepository = LocationRepository;
