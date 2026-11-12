import { FastifyReply, FastifyRequest } from "fastify";
import { ProfileService } from "./profile.service";
import { ProfileQuery, UpdateProfileBody } from "./profile.schemas";

export class ProfileController {
  constructor(private readonly service: ProfileService) {}

  getProfile = async (
    request: FastifyRequest<{ Querystring: ProfileQuery }>,
    reply: FastifyReply,
  ) => {
    return reply.send(await this.service.getProfile(request.query));
  };

  updateProfile = async (
    request: FastifyRequest<{ Body: UpdateProfileBody }>,
    reply: FastifyReply,
  ) => {
    return reply.send(
      await this.service.updateProfile(request.user, request.body),
    );
  };
}
