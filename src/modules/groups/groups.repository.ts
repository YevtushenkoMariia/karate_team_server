import type { Db } from "../../shared";

export class GroupsRepository {
  constructor(private readonly db: Db) {}

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
      select: {
        id: true,
        name: true,
        description: true,
        code: true,
        author_id: true,
        _count: { select: { users_groups: true } },
      },
    });
  }

  findByCode(code: string) {
    return this.db.groups.findUnique({
      where: { code },
      select: { id: true },
    });
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

  async findMemberIds(groupId: string) {
    const memberships = await this.db.users_groups.findMany({
      where: { group_id: groupId },
      select: { user_id: true },
    });

    return memberships.map((membership) => membership.user_id);
  }
}
