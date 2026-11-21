import { FastifyReply, FastifyRequest } from "fastify";
import { GroupsService } from "./groups.service";
import {
  GetGroupQuery,
  CreateGroupBody,
  GroupParams,
  JoinGroupBody,
  ListGroupsQuery,
  MemberParams,
  UpdateGroupBody,
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

  createGroup = async (
    request: FastifyRequest<{ Body: CreateGroupBody }>,
    reply: FastifyReply,
  ) => {
    return reply
      .status(201)
      .send(
        await this.service.createGroup(
          request.user.id,
          request.user.role,
          request.body,
        ),
      );
  };

  updateGroup = async (
    request: FastifyRequest<{
      Params: GroupParams;
      Body: UpdateGroupBody;
    }>,
    reply: FastifyReply,
  ) => {
    return reply.send(
      await this.service.updateGroup(
        request.user.id,
        request.user.role,
        request.params.groupId,
        request.body,
      ),
    );
  };

  deleteGroup = async (
    request: FastifyRequest<{ Params: GroupParams }>,
    reply: FastifyReply,
  ) => {
    await this.service.deleteGroup(
      request.user.id,
      request.user.role,
      request.params.groupId,
    );
    return reply.status(204).send();
  };

  removeMember = async (
    request: FastifyRequest<{ Params: MemberParams }>,
    reply: FastifyReply,
  ) => {
    await this.service.removeMember(
      request.user.id,
      request.user.role,
      request.params.groupId,
      request.params.memberId,
    );
    return reply.status(204).send();
  };
}
