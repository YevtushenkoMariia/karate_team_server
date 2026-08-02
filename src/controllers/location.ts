import { FastifyRequest, FastifyReply } from 'fastify';
import { LocationService } from '../services/locations';

const service = new LocationService();

export class LocationController {

    async getCities(
        request: FastifyRequest,
        reply: FastifyReply,
    ) {
       const result = await service.getCities();
       return reply.status(200).send(result);
    }

    async getClubs(
        request: FastifyRequest,
        reply: FastifyReply,
    ) {
       const result = await service.getClubs();
       return reply.status(200).send(result);
    }


}