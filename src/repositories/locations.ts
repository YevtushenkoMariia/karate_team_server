import { prisma } from "../lib/prisma";
import { Prisma } from "../../generated/prisma/client";

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

   async findOrCreateCity(
    cityName: string,
  ) {
    const existingCity = await prisma.cities.findFirst({
      where: { name: { equals: cityName, mode: "insensitive" } },
      select: { id: true },
    });

    if (existingCity) {
      return existingCity.id;
    }

    const createdCity = await prisma.cities.create({
      data: { name: cityName },
      select: { id: true },
    });

    return createdCity.id;
  }

   async findOrCreateClub(
      clubName: string,
      cityId: number | null,
    ) {
      const existingClub = await prisma.clubs.findFirst({
        where: { name: { equals: clubName, mode: "insensitive" } },
        select: { id: true, city_id: true },
      });
  
      if (existingClub) {
        if (cityId !== null && existingClub.city_id == null) {
          await prisma.clubs.update({
            where: { id: existingClub.id },
            data: { city_id: cityId },
          });
        }
        return existingClub.id;
      }
  
      const createdClub = await prisma.clubs.create({
        data: {
          name: clubName,
          city_id: cityId ?? undefined,
        },
        select: { id: true },
      });
  
      return createdClub.id;
    }
}

export const locationRepository = new LocationRepository()
