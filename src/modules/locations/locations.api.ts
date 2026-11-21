import { LocationsRepository } from "./locations.repository";
import type { DbClient } from "../../shared";

import type { Place } from "./locations.types";

export type { Place } from "./locations.types";

// Public contract of the locations module. Other modules depend on this
// interface only, never on the repository or the cities/clubs tables.
export interface LocationsApi {
  withTransaction(tx: DbClient): LocationsApi;
  findCityById(id: string): Promise<Place | null>;
  findClubById(id: string): Promise<Place | null>;
  findOrCreateCity(name: string): Promise<string>;
  findOrCreateClub(name: string, cityId: string | null): Promise<string>;
}

export function createLocationsApi(repository: LocationsRepository): LocationsApi {
  return {
    withTransaction: (tx) =>
      createLocationsApi(new LocationsRepository(tx)),
    findCityById: (id) => repository.findCityById(id),
    findClubById: (id) => repository.findClubById(id),
    findOrCreateCity: (name) => repository.findOrCreateCity(name),
    findOrCreateClub: (name, cityId) => repository.findOrCreateClub(name, cityId),
  };
}
