import { FastifyRequest, FastifyReply } from 'fastify';
import { SportsmenService } from '../services';
import { CreateSportsmenBody, SportsmenParams } from '../types';
import { logger } from '../../../shared/utils';

const service = new SportsmenService();

export class SportsmenController {
  async getAllSportsmens(
    reply: FastifyReply) {
    const athletes = await service.getAllSportsmens();
    return reply.send(athletes);
  }

  async getSportsmenById(
    request: FastifyRequest<{ Params: SportsmenParams }>,
    reply: FastifyReply
  ) {
    const athlete = await service.getSportsmenById(request.params.id);
    if (!athlete) {
      logger.warn(`Athlete with ID ${request.params.id} not found`);
      return reply.status(404).send({ message: 'Не знайдено' });
    }
    return reply.send(athlete);
  }

  async createSportsmen(
    request: FastifyRequest<{ Body: CreateSportsmenBody }>,
    reply: FastifyReply
  ) {
    
  }

}
