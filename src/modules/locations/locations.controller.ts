import { FastifyReply, FastifyRequest } from "fastify";
import { LocationsRepository } from "./locations.repository";

export class LocationsController {
  constructor(private readonly repository: LocationsRepository) {}

  getCities = async (_request: FastifyRequest, reply: FastifyReply) => {
    return reply.send(await this.repository.findAllCities());
  };

  getClubs = async (_request: FastifyRequest, reply: FastifyReply) => {
    return reply.send(await this.repository.findAllClubs());
  };
}
