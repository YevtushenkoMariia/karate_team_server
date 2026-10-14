import type { Db } from "../../shared";

const placeSelect = { id: true, name: true } as const;

export class LocationsRepository {
  constructor(private readonly db: Db) {}

  findAllCities() {
    return this.db.cities.findMany({ select: placeSelect });
  }

  findAllClubs() {
    return this.db.clubs.findMany({ select: placeSelect });
  }

  findCityById(id: string) {
    return this.db.cities.findUnique({ where: { id }, select: placeSelect });
  }

  findClubById(id: string) {
    return this.db.clubs.findUnique({ where: { id }, select: placeSelect });
  }

  async findOrCreateCity(cityName: string) {
    const existingCity = await this.db.cities.findFirst({
      where: { name: { equals: cityName, mode: "insensitive" } },
      select: { id: true },
    });

    if (existingCity) {
      return existingCity.id;
    }

    const createdCity = await this.db.cities.create({
      data: { name: cityName },
      select: { id: true },
    });

    return createdCity.id;
  }

  async findOrCreateClub(clubName: string, cityId: string | null) {
    const existingClub = await this.db.clubs.findFirst({
      where: { name: { equals: clubName, mode: "insensitive" } },
      select: { id: true, city_id: true },
    });

    if (existingClub) {
      if (cityId !== null && existingClub.city_id == null) {
        await this.db.clubs.update({
          where: { id: existingClub.id },
          data: { city_id: cityId },
        });
      }
      return existingClub.id;
    }

    const createdClub = await this.db.clubs.create({
      data: {
        name: clubName,
        city_id: cityId ?? undefined,
      },
      select: { id: true },
    });

    return createdClub.id;
  }
}
