import { FastifyInstance } from "fastify";
import type { AppModule, Db } from "../../shared";
import { LocationsRepository } from "./locations.repository";
import { LocationsController } from "./locations.controller";
import { createLocationsApi, LocationsApi } from "./locations.api";

type Deps = {
  db: Db;
};

export function createLocationsModule({ db }: Deps): AppModule & { api: LocationsApi } {
  const repository = new LocationsRepository(db);
  const controller = new LocationsController(repository);

  return {
    name: "locations",
    prefix: "/api/location",
    api: createLocationsApi(repository),
    routes: async (fastify: FastifyInstance) => {
      fastify.get("/cities", { handler: controller.getCities });
      fastify.get("/clubs", { handler: controller.getClubs });
    },
  };
}
