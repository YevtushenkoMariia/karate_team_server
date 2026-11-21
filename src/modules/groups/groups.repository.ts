import type { DbClient } from "../../shared";

const groupDetailsSelect = {
  id: true,
  name: true,
  description: true,
  code: true,
  author_id: true,
  _count: { select: { users_groups: true } },
} as const;

export class GroupsRepository {
  constructor(private readonly db: DbClient) {}

  create(data: {
    name: string;
    description?: string;
    code: string;
    authorId: string;
  }) {
    return this.db.groups.create({
      data: {
        name: data.name,
        description: data.description,
        code: data.code,
        author_id: data.authorId,
        users_groups: { create: { user_id: data.authorId } },
      },
      select: groupDetailsSelect,
    });
  }

  findGroupsOfUser(userId: string) {
    return this.db.groups.findMany({
      where: { users_groups: { some: { user_id: userId } } },
      select: {
        id: true,
        name: true,
        code: true,
        author_id: true,
        _count: { select: { users_groups: true } },
      },
    });
  }

  findById(groupId: string) {
    return this.db.groups.findUnique({
      where: { id: groupId },
      select: groupDetailsSelect,
    });
  }

  findByCode(code: string) {
    return this.db.groups.findUnique({
      where: { code },
      select: { id: true },
    });
  }

  update(
    groupId: string,
    data: { name?: string; description?: string | null },
  ) {
    return this.db.groups.update({
      where: { id: groupId },
      data,
      select: groupDetailsSelect,
    });
  }

  delete(groupId: string) {
    return this.db.groups.delete({ where: { id: groupId } });
  }

  async isMember(userId: string, groupId: string) {
    const membership = await this.db.users_groups.findUnique({
      where: { user_id_group_id: { user_id: userId, group_id: groupId } },
      select: { user_id: true },
    });

    return membership !== null;
  }

  async addMember(userId: string, groupId: string) {
    await this.db.users_groups.create({
      data: { user_id: userId, group_id: groupId },
    });
  }

  async removeMember(userId: string, groupId: string) {
    await this.db.users_groups.delete({
      where: { user_id_group_id: { user_id: userId, group_id: groupId } },
    });
  }

  async findMemberIds(groupId: string) {
    const memberships = await this.db.users_groups.findMany({
      where: { group_id: groupId },
      select: { user_id: true },
    });

    return memberships.map((membership) => membership.user_id);
  }
}
