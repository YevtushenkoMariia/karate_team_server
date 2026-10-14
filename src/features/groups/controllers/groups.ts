import { FastifyRequest, FastifyReply } from "fastify";
import {
  GetGroupQuery,
  GetGroupRequest,
  GetUserMemberGroupsRequest,
  GroupBody,
  GroupIdParams,
  GroupMembersRequest,
  JoinGroupBody,
  JoinGroupRequest,
  UserIdParams,
} from "../types";
import { GroupsService } from "../services";

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

      const payload: GetUserMemberGroupsRequest = {
        userId,
        role,
      };

      const result = await service.getUserMemberGroups(payload);
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

      const payload: GetGroupRequest = {
        userId,
        groupId,
        role,
      };

      const result = await service.getGroup(payload);
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

      const payload: JoinGroupRequest = {
        userId,
        code: request.body.groupCode,
      };

      const result = await service.joinGroup(payload);
      return reply.status(200).send(result);
    } catch (error: any) {
      return reply.status(error.statusCode || 400).send({
        message: error.message || "Failed to join group",
        error: error.message,
      });
    }
  }

  async getGroupMembers(
    request: FastifyRequest<{
      Params: GroupIdParams;
    }>,
    reply: FastifyReply,
  ) {
    try {
      const { groupId, userId } = request.params;

      if (!userId) {
        return reply.status(400).send({
          message: "User ID is required",
        });
      }

      const payload: GroupMembersRequest = { userId, groupId };

      const result = await service.getGroupMembers(payload);

      return reply.status(200).send(result);
    } catch (error: any) {
      return reply.status(error.statusCode || 400).send({
        message: error.message || "Failed getting all group members",
        error: error.message,
      });
    }
  }
}
