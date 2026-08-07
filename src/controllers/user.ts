import { FastifyRequest, FastifyReply } from "fastify";
import { CreateUserBody, ProileBody, UpdateUserBody } from "../schemas/user";
import { UsersService } from "../services/users";

const service = new UsersService();

export class UserController {
  async getUserProfile(
    request: FastifyRequest<{ Querystring: ProileBody }>,
    reply: FastifyReply,
  ) {
    try {
      const userProfileData = await service.getUserProfile(request.query);
      return reply.status(200).send(userProfileData);
    } catch (error: any) {
      return reply.status(404).send({
        message: "User not found",
        error: error.message,
      });
    }
  }

  async updateUserProfile(
    request: FastifyRequest<{ Body: UpdateUserBody }>,
    reply: FastifyReply,
  ) {
    try {
      const result = await service.updateUserProfile(
        request.user,
        request.body,
      );
      return reply.status(200).send(result);
    } catch (error: any) {
      return reply.status(404).send({
        message: "User not found",
        error: error.message,
      });
    }
  }
}
