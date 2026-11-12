import { ConflictError, ForbiddenError, NotFoundError } from "../../shared";
import type { IdentityApi, UserSummary } from "../identity";
import { GroupsRepository } from "./groups.repository";

export class GroupsService {
  constructor(
    private readonly groups: GroupsRepository,
    private readonly identity: IdentityApi,
  ) {}

  async getUserGroups(userId: string, role: string) {
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

  async getGroup(userId: string, groupId: string, role?: string) {
    await this.assertUser(userId, role);
    return this.getGroupDetails(groupId);
  }

  async joinGroup(userId: string, code: string) {
    await this.assertUser(userId);

    const group = await this.groups.findByCode(code);
    if (!group) {
      throw new NotFoundError("Group not found");
    }

    if (await this.groups.isMember(userId, group.id)) {
      throw new ConflictError("User is already a member of this group");
    }

    await this.groups.addMember(userId, group.id);

    return this.getGroupDetails(group.id);
  }

  async getGroupMembers(userId: string, groupId: string) {
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

  private async getGroupDetails(groupId: string) {
    const group = await this.groups.findById(groupId);
    if (!group) {
      throw new NotFoundError("Group not found");
    }

    const authors = await this.findAuthors([group.author_id]);

    return {
      id: group.id,
      name: group.name,
      description: group.description,
      code: group.code,
      author: this.toAuthor(authors, group.author_id),
      membersCount: group._count.users_groups,
    };
  }

  private async assertUser(userId: string, role?: string) {
    const user = await this.identity.findUserById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (role && user.role !== role) {
      throw new ForbiddenError("User role does not match");
    }
  }

  private async findAuthors(authorIds: (string | null)[]) {
    const ids = [...new Set(authorIds.filter((id): id is string => id !== null))];
    const authors = await this.identity.findUsersByIds(ids);

    return new Map(authors.map((author) => [author.id, author]));
  }

  private toAuthor(authors: Map<string, UserSummary>, authorId: string | null) {
    const author = authorId ? authors.get(authorId) : undefined;
    return { name: author?.name, surname: author?.surname };
  }
}
