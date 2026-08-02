import { FastifyRequest, FastifyReply } from 'fastify';
import { CreateUserBody, ProileBody, UpdateUserBody } from '../schemas/user';
import { UsersService } from '../services/users';

const service = new UsersService();

export class UserController {
  async createUser(
    request: FastifyRequest<{ Body: CreateUserBody }>,
    reply: FastifyReply,
  ) {
    return reply.status(201).send();
  }

  async getUserById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    return reply.send();
  }

  async getUserProfile(
    request: FastifyRequest<{ Querystring: ProileBody }>,
    reply: FastifyReply,
  ) {
    const result = await service.getUserProfile(request.query);
    return reply.status(200).send(result);
  }

  async updateUserProfile(
    request: FastifyRequest<{ Body: UpdateUserBody }>,
    reply: FastifyReply,
  ) {
    const result = await service.updateUserProfile(request.user, request.body);
    return reply.status(200).send(result);
  }
}
