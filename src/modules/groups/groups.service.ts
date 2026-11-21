import { randomBytes } from "node:crypto";
import { role_type } from "../../../generated/prisma/client";
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from "../../shared";
import type { IdentityApi, UserSummary } from "../identity";
import { GroupsRepository } from "./groups.repository";
import type { CreateGroupBody, UpdateGroupBody } from "./groups.schemas";
import type {
  GroupDetailsDto,
  GroupAuthorDto,
  GroupListDto,
  GroupMemberDto,
  GroupRecordDto,
} from "./groups.types";

export class GroupsService {
  constructor(
    private readonly groups: GroupsRepository,
    private readonly identity: IdentityApi,
  ) {}

  async getUserGroups(userId: string, role: string): Promise<GroupListDto[]> {
    await this.assertUser(userId, role);

    const groups = await this.groups.findGroupsOfUser(userId);
    const authors = await this.findAuthors(groups.map((group) => group.author_id));

    return groups.map((group) => ({
      id: group.id,
      name: group.name,
      code: group.code,
      author: this.toAuthor(authors, group.author_id),
      membersCount: group._count.users_groups,
    }));
  }

  async getGroup(
    userId: string,
    groupId: string,
    role?: string,
  ): Promise<GroupDetailsDto> {
    await this.assertUser(userId, role);
    return this.getGroupDetails(groupId);
  }

  async joinGroup(userId: string, code: string): Promise<GroupDetailsDto> {
    await this.assertUser(userId);

    const normalizedCode = code.trim().toUpperCase();
    if (!normalizedCode) {
      throw new BadRequestError("Group code is required");
    }

    const group = await this.groups.findByCode(normalizedCode);
    if (!group) {
      throw new NotFoundError("Group not found");
    }

    if (await this.groups.isMember(userId, group.id)) {
      throw new ConflictError("User is already a member of this group");
    }

    await this.groups.addMember(userId, group.id);

    return this.getGroupDetails(group.id);
  }

  async getGroupMembers(
    userId: string,
    groupId: string,
  ): Promise<GroupMemberDto[]> {
    await this.assertUser(userId);

    if (!(await this.groups.findById(groupId))) {
      throw new NotFoundError("Group not found");
    }

    if (!(await this.groups.isMember(userId, groupId))) {
      throw new ForbiddenError("You are not member of this group");
    }

    const members = await this.identity.findUsersByIds(
      await this.groups.findMemberIds(groupId),
    );

    return members.map(({ id, name, surname, role }) => ({
      id,
      name,
      surname,
      role,
    }));
  }

  async createGroup(
    userId: string,
    role: string,
    data: CreateGroupBody,
  ): Promise<GroupDetailsDto> {
    const author = await this.assertGroupManager(userId, role);
    const code = await this.generateCode();
    const group = await this.groups.create({
      ...data,
      code,
      authorId: author.id,
    });

    return this.toGroup(group, new Map([[author.id, author]]));
  }

  async updateGroup(
    userId: string,
    role: string,
    groupId: string,
    data: UpdateGroupBody,
  ): Promise<GroupDetailsDto> {
    if (data.name === undefined && data.description === undefined) {
      throw new BadRequestError("At least one group field must be provided");
    }

    await this.assertGroupOwnerOrAdmin(userId, role, groupId);
    const group = await this.groups.update(groupId, data);
    const authors = await this.findAuthors([group.author_id]);

    return this.toGroup(group, authors);
  }

  async deleteGroup(
    userId: string,
    role: string,
    groupId: string,
  ): Promise<void> {
    await this.assertGroupOwnerOrAdmin(userId, role, groupId);
    await this.groups.delete(groupId);
  }

  async removeMember(
    actorId: string,
    role: string,
    groupId: string,
    memberId: string,
  ): Promise<void> {
    const actor = await this.assertUser(actorId, role);
    const group = await this.groups.findById(groupId);
    if (!group) {
      throw new NotFoundError("Group not found");
    }

    if (
      memberId !== actorId &&
      actor.role !== role_type.ADMIN &&
      group.author_id !== actorId
    ) {
      throw new ForbiddenError("Only the group author can remove members");
    }

    if (!(await this.groups.isMember(memberId, groupId))) {
      throw new NotFoundError("Group member not found");
    }

    await this.groups.removeMember(memberId, groupId);
  }

  private async getGroupDetails(
    groupId: string,
  ): Promise<GroupDetailsDto> {
    const group = await this.groups.findById(groupId);
    if (!group) {
      throw new NotFoundError("Group not found");
    }

    const authors = await this.findAuthors([group.author_id]);

    return this.toGroup(group, authors);
  }

  private async assertUser(userId: string, role?: string) {
    const user = await this.identity.findUserById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (role && user.role !== role) {
      throw new ForbiddenError("User role does not match");
    }

    return user;
  }

  private async assertGroupManager(userId: string, role: string) {
    const user = await this.assertUser(userId, role);
    if (user.role !== role_type.ADMIN && user.role !== role_type.COACH) {
      throw new ForbiddenError("Only coaches and admins can manage groups");
    }

    return user;
  }

  private async assertGroupOwnerOrAdmin(
    userId: string,
    role: string,
    groupId: string,
  ) {
    const user = await this.assertGroupManager(userId, role);
    const group = await this.groups.findById(groupId);
    if (!group) {
      throw new NotFoundError("Group not found");
    }

    if (user.role !== role_type.ADMIN && group.author_id !== user.id) {
      throw new ForbiddenError("Only the group author can manage this group");
    }

    return group;
  }

  private async generateCode() {
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const code = randomBytes(8).toString("hex").toUpperCase();
      if (!(await this.groups.findByCode(code))) {
        return code;
      }
    }

    throw new ConflictError("Unable to generate a unique group code");
  }

  private toGroup(
    group: GroupRecordDto,
    authors: Map<string, UserSummary>,
  ): GroupDetailsDto {
    return {
      id: group.id,
      name: group.name,
      description: group.description,
      code: group.code,
      author: this.toAuthor(authors, group.author_id),
      membersCount: group._count.users_groups,
    };
  }

  private async findAuthors(
    authorIds: (string | null)[],
  ): Promise<Map<string, UserSummary>> {
    const ids = [...new Set(authorIds.filter((id): id is string => id !== null))];
    const authors = await this.identity.findUsersByIds(ids);

    return new Map(authors.map((author) => [author.id, author]));
  }

  private toAuthor(
    authors: Map<string, UserSummary>,
    authorId: string | null,
  ): GroupAuthorDto {
    const author = authorId ? authors.get(authorId) : undefined;
    return { name: author?.name, surname: author?.surname };
  }
}
