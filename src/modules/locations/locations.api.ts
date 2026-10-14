import { LocationsRepository } from "./locations.repository";

export type Place = {
  id: string;
  name: string;
};

// Public contract of the locations module. Other modules depend on this
// interface only, never on the repository or the cities/clubs tables.
export interface LocationsApi {
  findCityById(id: string): Promise<Place | null>;
  findClubById(id: string): Promise<Place | null>;
  findOrCreateCity(name: string): Promise<string>;
  findOrCreateClub(name: string, cityId: string | null): Promise<string>;
}

export function createLocationsApi(repository: LocationsRepository): LocationsApi {
  return {
    findCityById: (id) => repository.findCityById(id),
    findClubById: (id) => repository.findClubById(id),
    findOrCreateCity: (name) => repository.findOrCreateCity(name),
    findOrCreateClub: (name, cityId) => repository.findOrCreateClub(name, cityId),
  };
}
