// src/routes/athlete.routes.ts
import { FastifyInstance } from 'fastify';
import { SportsmenController } from '../controllers/sportsmen';
import { CreateSportsmenSchema,  SportsmenParamsSchema } from '../schemas/sportsmen';
import { CreateUserSchema } from '../schemas/user';


const controller = new SportsmenController();

export async function athleteRoutes(fastify: FastifyInstance) {

  fastify.get('/',
    controller.getAllSportsmens
  );

  fastify.get('/:id', {
    schema: {
      params: SportsmenParamsSchema
    },
    handler: controller.getSportsmenById,
  });

  fastify.post('/', {
    schema: {
      body: {
        CreateSportsmenSchema,
        CreateUserSchema
      }
    },
    handler: controller.createSportsmen,
  });
}