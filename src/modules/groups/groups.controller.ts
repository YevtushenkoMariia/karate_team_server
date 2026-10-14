import { FastifyReply, FastifyRequest } from "fastify";
import { GroupsService } from "./groups.service";
import {
  GetGroupQuery,
  GroupParams,
  JoinGroupBody,
  ListGroupsQuery,
  UserParams,
} from "./groups.schemas";

export class GroupsController {
  constructor(private readonly service: GroupsService) {}

  getUserGroups = async (
    request: FastifyRequest<{ Params: UserParams; Querystring: ListGroupsQuery }>,
    reply: FastifyReply,
  ) => {
    const { userId } = request.params;
    return reply.send(
      await this.service.getUserGroups(userId, request.query.role),
    );
  };

  getGroup = async (
    request: FastifyRequest<{ Params: GroupParams; Querystring: GetGroupQuery }>,
    reply: FastifyReply,
  ) => {
    const { userId, groupId } = request.params;
    return reply.send(
      await this.service.getGroup(userId, groupId, request.query.role),
    );
  };

  joinGroup = async (
    request: FastifyRequest<{ Params: UserParams; Body: JoinGroupBody }>,
    reply: FastifyReply,
  ) => {
    const { userId } = request.params;
    return reply.send(
      await this.service.joinGroup(userId, request.body.groupCode),
    );
  };

  getGroupMembers = async (
    request: FastifyRequest<{ Params: GroupParams }>,
    reply: FastifyReply,
  ) => {
    const { userId, groupId } = request.params;
    return reply.send(await this.service.getGroupMembers(userId, groupId));
  };
}
