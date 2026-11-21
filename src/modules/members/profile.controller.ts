import { FastifyReply, FastifyRequest } from "fastify";
import { ProfileService } from "./profile.service";
import { MemberProfileParams, UpdateProfileBody } from "./profile.schemas";

export class ProfileController {
  constructor(private readonly service: ProfileService) {}

  getProfile = async (request: FastifyRequest, reply: FastifyReply) => {
    return reply.send(await this.service.getProfile(request.user));
  };

  getMemberProfile = async (
    request: FastifyRequest<{ Params: MemberProfileParams }>,
    reply: FastifyReply,
  ) => {
    return reply.send(
      await this.service.getMemberProfile(request.user, request.params.userId),
    );
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
