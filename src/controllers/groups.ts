import { FastifyRequest, FastifyReply } from "fastify";
import {
  GetGroupQuery,
  GroupBody,
  GroupIdParams,
  JoinGroupBody,
  UserIdParams,
} from "../schemas/groups";
import { GroupsService } from "../services/groups";

const service = new GroupsService();

export class GroupsController {
  async getUserMemberGroups(
    request: FastifyRequest<{
      Params: UserIdParams;
      Querystring: GroupBody;
    }>,
    reply: FastifyReply,
  ) {
    try {
      const { userId } = request.params;
      const { role } = request.query;

      if (!userId || !role) {
        return reply.status(400).send({
          message: "User ID and role are required",
        });
      }

      const result = await service.getUserMemberGroups({
        userId: userId,
        role: role,
      });
      return reply.status(200).send(result);
    } catch (error: any) {
      return reply.status(404).send({
        message: "User not found",
        error: error.message,
      });
    }
  }

  async getGroup(
    request: FastifyRequest<{
      Params: GroupIdParams;
      Querystring: GetGroupQuery;
    }>,
    reply: FastifyReply,
  ) {
    try {
      const { userId, groupId } = request.params;
      const { role } = request.query;

      if (!userId || !groupId) {
        return reply.status(400).send({
          message: "User ID and group ID are required",
        });
      }

      const result = await service.getGroup({
        userId,
        groupId,
        role,
      });
      return reply.status(200).send(result);
    } catch (error: any) {
      return reply.status(error.statusCode || 404).send({
        message: error.message || "Group not found",
        error: error.message,
      });
    }
  }

  async joinGroup(
    request: FastifyRequest<{
      Params: UserIdParams;
      Body: JoinGroupBody;
    }>,
    reply: FastifyReply,
  ) {
    try {
      const { userId } = request.params;

      if (!userId) {
        return reply.status(400).send({
          message: "User ID is required",
        });
      }

      const result = await service.joinGroup({
        userId,
        code: request.body.code,
      });
      return reply.status(200).send(result);
      
    } catch (error: any) {
      return reply.status(error.statusCode || 400).send({
        message: error.message || "Failed to join group",
        error: error.message,
      });
    }
  }
}
