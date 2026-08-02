import { prisma } from "../lib/prisma";

export class LocationRepository {
  async getAllCities() {
    return prisma.cities.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }

  async getAllClubs() {
    return prisma.clubs.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }
}