// src/routes/athlete.routes.ts
import { FastifyInstance } from 'fastify';
import { role_type } from '../../generated/prisma/client';
import { SportsmenController } from '../controllers/sportsmen';
import { SportsmenParamsSchema } from '../schemas/sportsmen';
import { authorize } from '../plugins/auth';

const controller = new SportsmenController();

export async function athleteRoutes(fastify: FastifyInstance) {
  fastify.get('/', {
    preHandler: [
      fastify.authenticate,
      authorize(role_type.ADMIN, role_type.COACH),
    ],
    handler: controller.getAllSportsmens,
  });

  fastify.get('/:id', {
    schema: {
      params: SportsmenParamsSchema,
    },
    preHandler: [
      fastify.authenticate,
      authorize(role_type.ADMIN, role_type.COACH),
    ],
    handler: controller.getSportsmenById,
  });
}
