import { FastifyRequest, FastifyReply } from "fastify";
import { LocationService } from "../services/locations";

const service = new LocationService();

export class LocationController {
  async getCities(request: FastifyRequest, reply: FastifyReply) {
    try {
      const registeredCities = await service.getCities();
      return reply.status(200).send(registeredCities);
    } catch (error: any) {
      return reply.status(404).send({
        message: "Cities not found",
        error: error.message,
      });
    }
  }

  async getClubs(request: FastifyRequest, reply: FastifyReply) {
    try {
      const registerdClubs = await service.getClubs();
      return reply.status(200).send(registerdClubs);
    } catch (error: any) {
      return reply.status(404).send({
        message: "Clubs not found",
        error: error.message,
      });
    }
  }
}
